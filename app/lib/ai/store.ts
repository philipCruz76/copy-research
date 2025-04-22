import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { DocumentType } from "@prisma/client";
import { Document } from "@langchain/core/documents";
import { embeddings } from "./gpt";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { generateDocumentHash } from "../utils";
import db from "@/app/lib/db";

export const getVectorStore = () => {
  console.log("Getting vector store...");
  const client = new PineconeClient({
    apiKey: process.env.PINECONE_API_KEY!,
    maxRetries: 3,
  });

  return client.Index("doc-store");
};

export const loadDocumentsToDb = async (
  documentId: string,
  docType: DocumentType,
  docs: Array<Document>,
) => {
  console.log("Loading documents to db...");

  const documents = docs.map(
    (doc) =>
      new Document({
        pageContent: doc.pageContent,
        metadata: { ...doc.metadata, documentId, type: docType },
      }),
  );

  const dbDocument = await db.document.create({
    data: {
      src: documentId,
      documentType: DocumentType.URL,
      title: docs[0].metadata.title,
      id: documentId,
      indexed: true,
      documentData: {
        create: {
          data: documents.map((doc) => doc.pageContent).join(" "),
          displayName: "Document Text",
          size: documents.length,
          indexed: true,
        },
      },
    },
  });

  if (!dbDocument) {
    throw new Error("Document not created in db");
  }

  // Calculate and save the hash of the document AFTER creating the document
  const contentHash = generateDocumentHash(documents[0]);

  await db.documentHashes.create({
    data: {
      hash: contentHash,
      documentId,
    },
  });

  // Split the documents into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });

  const splitDocs = await splitter.splitDocuments(documents);

  let uniqueIds: string[] = [];
  splitDocs.forEach((doc) => {
    // Use a consistent ID generation scheme based on content
    const contentHash = generateDocumentHash(doc);
    doc.metadata.id = `doc_${contentHash}`;
    uniqueIds.push(doc.metadata.id);
  });

  const vectorStore = await getVectorDb("");
  await vectorStore.addDocuments(splitDocs, {
    ids: uniqueIds,
  });

  console.log("Documents loaded to db");
};

export const getVectorDb = async (documentId: string) => {
  const index = getVectorStore();
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
    maxConcurrency: 3,
    namespace: "test-research",
  });

  return vectorStore;
};
