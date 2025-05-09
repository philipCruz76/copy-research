import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { DocumentChunk, DocumentType } from "@prisma/client";
import { Document } from "@langchain/core/documents";
import { embeddings } from "./gpt";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { generateDocumentHash, generateRandomFileName } from "../utils";
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
  src: string,
  docType: DocumentType,
  docs: Array<Document>,
) => {
  console.log("Loading documents to db...");
  const documentId = await generateRandomFileName();

  const documents = docs.map(
    (doc) =>
      new Document({
        pageContent: doc.pageContent,
        metadata: { ...doc.metadata, documentId, src, type: docType },
      }),
  );

  const dbDocument = await db.document.create({
    data: {
      src: src,
      id: documentId,
      documentType: DocumentType.URL,
      title: docs[0].metadata.title,
      indexed: true,
      documentData: {
        create: {
          data: documents.map((doc) => doc.pageContent).join(" "),
          displayName: "Document Text",
          size: documents.length,
          indexed: true,
          summary: docs[0].metadata.summary,
          keyTopics: docs[0].metadata.keyTopics,
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

  console.log("Documents: ", documents[0].pageContent.length);
  // Split the documents into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 0,
  });

  const splitDocs = await splitter.splitDocuments(documents);

  let uniqueIds: string[] = [];
  const chunkCreations: Promise<DocumentChunk>[] = [];
  
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
    doc.metadata.documentTitle = docs[0].metadata.title;
    doc.metadata.citation = {
      documentId,
      chunkIndex: i,
      vectorId,
      title: docs[0].metadata.title,
      startChar,
      endChar,
      src,
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
      }
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

  console.log("Documents loaded to db");
};

export const getVectorDb = async () => {
  const index = getVectorStore();
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
    maxConcurrency: 3,
    namespace: "test-research",
  });

  return vectorStore;
};

// Function to retrieve citation information for a document chunk
export const getCitationForChunk = async (vectorId: string) => {
  // First try to get the chunk directly using the vectorId
  const chunk = await db.documentChunk.findFirst({
    where: {
      vectorId,
    },
    include: {
      document: {
        select: {
          title: true,
          src: true,
          documentType: true,
          documentData: {
            select: {
              summary: true,
              keyTopics: true,
            }
          }
        }
      }
    }
  });

  if (!chunk) {
    return null;
  }

  return {
    documentId: chunk.documentId,
    chunkIndex: chunk.chunkIndex,
    title: chunk.document.title || "Untitled Document",
    src: chunk.document.src,
    summary: chunk.document.documentData[0]?.summary,
    keyTopics: chunk.document.documentData[0]?.keyTopics,
    excerpt: chunk.content,
    documentType: chunk.document.documentType,
  };
};

// Function to retrieve citation information for multiple document chunks
export const getCitationsForChunks = async (vectorIds: string[]) => {
  // Get all chunks matching the provided vector IDs
  const chunks = await db.documentChunk.findMany({
    where: {
      vectorId: {
        in: vectorIds,
      },
    },
    include: {
      document: {
        select: {
          title: true,
          src: true,
          documentType: true,
          documentData: {
            select: {
              summary: true,
              keyTopics: true,
            }
          }
        }
      }
    }
  });

  if (!chunks || chunks.length === 0) {
    return [];
  }

  // Group chunks by document to avoid duplicates
  const citationsByDocument = new Map();
  
  chunks.forEach(chunk => {
    const docId = chunk.documentId;
    
    if (!citationsByDocument.has(docId)) {
      citationsByDocument.set(docId, {
        documentId: docId,
        title: chunk.document.title || "Untitled Document",
        src: chunk.document.src,
        summary: chunk.document.documentData[0]?.summary,
        keyTopics: chunk.document.documentData[0]?.keyTopics,
        documentType: chunk.document.documentType,
        excerpts: []
      });
    }
    
    // Add this chunk's content as an excerpt
    citationsByDocument.get(docId).excerpts.push({
      chunkIndex: chunk.chunkIndex,
      vectorId: chunk.vectorId,
      content: chunk.content,
    });
  });

  return Array.from(citationsByDocument.values());
};
