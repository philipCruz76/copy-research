import { getVectorDb } from "@/app/lib/ai/store";
import { Document } from "@langchain/core/documents";
import { NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import db from "@/app/lib/db";
import { DocumentChunk, DocumentType } from "@prisma/client";
import { generateDocumentHash } from "@/app/lib/utils";
import { getDocumentSummary } from "@/app/lib/ai/getDocumentSummary";

type DocumentRequest = {
  text: string[];
  documentId: string;
  fileType: string;
  documentURL: string;
  checksum: string;
  documentTitle: string;
};
export async function POST(req: Request) {
  try {
    const { text, documentId, fileType, documentURL, checksum, documentTitle } =
      (await req.json()) as DocumentRequest;

    const documentSummary = await getDocumentSummary(text.join(" "));
    let uniqueIds: string[] = [];
    const chunkCreations: Promise<DocumentChunk>[] = [];
    const documents: Document[] = text.map((doc: string) => {
      return new Document({
        pageContent: doc,
        metadata: {
          documentId,
          type: fileType,
          summary: documentSummary.summary,
          keyTopics: documentSummary.keyTopics,
        },
      });
    });

    console.log("Documents: ", documents.length);
    // Add text splitter similar to loadDocumentsToDb
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 100,
    });

    const splitDocs = await splitter.splitDocuments(documents);

    // Create the parent document first
    const dbDocument = await db.document.create({
      data: {
        src: documentURL,
        documentType: DocumentType.FILES,
        id: documentId,
        indexed: true,
        title: documentTitle,
        documentData: {
          create: {
            data: text.join(" "),
            displayName: "Document Text",
            size: text.length,
            indexed: true,
            summary: documentSummary.summary,
            keyTopics: documentSummary.keyTopics,
          },
        },
      },
    });

    if (!dbDocument) {
      throw new Error("Document not created in db");
    }

    // Process each document chunk and track character positions
    splitDocs.reduce((currentPosition, doc, i) => {
      // Calculate position for this chunk
      const startChar = currentPosition;
      const endChar = currentPosition + doc.pageContent.length;

      // Use a consistent ID generation scheme based on content
      const contentHash = generateDocumentHash(doc);
      const vectorId = `doc_${contentHash}`;
      doc.metadata.id = vectorId;
      uniqueIds.push(vectorId);
      doc.metadata.chunkIndex = i;
      doc.metadata.sourcePage = Math.floor(i / 10) + 1;

      // Add citation metadata
      doc.metadata.documentTitle = documentTitle;
      doc.metadata.citation = {
        documentId,
        chunkIndex: i,
        vectorId,
        title: documentTitle,
        startChar,
        endChar,
        src: documentURL,
      };

      // Store chunk in database for citation lookup
      const chunkCreation = db.documentChunk.create({
        data: {
          documentId,
          chunkIndex: i,
          content: doc.pageContent,
          vectorId,
          startChar,
          endChar,
        },
      });

      chunkCreations.push(chunkCreation);

      // Return the next starting position
      return endChar;
    }, 0); // Start at position 0

    // Create all chunks in parallel
    await Promise.all(chunkCreations);

    const vectorStore = await getVectorDb();
    await vectorStore.addDocuments(splitDocs, {
      ids: uniqueIds,
    });
    console.log("Documents added to Pinecone");

    await db.documentHashes.create({
      data: {
        hash: checksum,
        documentId: documentId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Documents uploaded to Pinecone and saved to Database",
    });
  } catch (error) {
    console.error("Error uploading documents to Pinecone:", error);
    return NextResponse.json({
      success: false,
      message: "Error uploading documents to Pinecone",
    });
  }
}
