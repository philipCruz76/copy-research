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
  userId: string;
};
export async function POST(req: Request) {
  try {
    const {
      text,
      documentId,
      fileType,
      documentURL,
      checksum,
      documentTitle,
      userId,
    } = (await req.json()) as DocumentRequest;

    const summaryPromise = getDocumentSummary(text.join(" "));
    let uniqueIds: string[] = [];
    const chunkCreations: Promise<DocumentChunk>[] = [];

    const tempDocuments: Document[] = text.map((doc: string) => {
      return new Document({
        pageContent: doc,
        metadata: { documentId, type: fileType },
      });
    });

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 100,
    });

    const [documentSummary, splitDocs] = await Promise.all([
      summaryPromise,
      splitter.splitDocuments(tempDocuments),
    ]);

    splitDocs.forEach((doc, i) => {
      doc.metadata.summary = documentSummary.summary;
      doc.metadata.keyTopics = documentSummary.keyTopics;
    });

    const vectorStore = await getVectorDb();

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

    // First, create the document in the database
    const dbDocument = await db.document.create({
      data: {
        src: documentURL,
        documentType: DocumentType.FILES,
        id: documentId,
        indexed: true,
        title: documentTitle,
        userId: userId,
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

    // Then, create the chunks and add to vector store in parallel
    const [vectorStoreResponse, chunkResult] = await Promise.all([
      // add documents to vector store
      vectorStore.addDocuments(splitDocs, {
        ids: uniqueIds,
      }),
      // create chunks in db (now that document exists)
      Promise.all(chunkCreations),
    ]);

    if (!dbDocument) {
      throw new Error("Document not created in db");
    }

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
    console.error("Error uploading documents to", error);
    return NextResponse.json({
      success: false,
      message: "Error uploading documents",
    });
  }
}
