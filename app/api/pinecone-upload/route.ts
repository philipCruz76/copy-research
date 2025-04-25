import { getVectorDb } from "@/app/lib/ai/store";
import { Document } from "@langchain/core/documents";
import { NextResponse } from "next/server";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import db from "@/app/lib/db";
import { DocumentType } from "@prisma/client";
import { generateDocumentHash } from "@/app/lib/utils";

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

    let uniqueIds: string[] = [];
    const documents: Document[] = text.map((doc: string) => {
      return new Document({
        pageContent: doc,
        metadata: {
          documentId,
          type: fileType,
        },
      });
    });

    // Add text splitter similar to loadDocumentsToDb
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 100,
    });

    const splitDocs = await splitter.splitDocuments(documents);

    // Generate unique IDs after splitting
    uniqueIds = [];
    splitDocs.forEach((doc) => {
      const contentHash = generateDocumentHash(doc);
      doc.metadata.id = `doc_${contentHash}`;
      uniqueIds.push(doc.metadata.id);
    });

    const vectorStore = await getVectorDb("");
    await vectorStore.addDocuments(splitDocs, {
      ids: uniqueIds,
    });
    console.log("Documents added to Pinecone");

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
          },
        },
      },
    });

    if (!dbDocument) {
      throw new Error("Document not created in db");
    }

    await db.documentHashes.create({
      data: {
        hash: checksum,
        documentId: documentId,
      },
    });

    console.log("Document created in db", dbDocument);

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
