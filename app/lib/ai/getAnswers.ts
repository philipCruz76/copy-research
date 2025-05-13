"use server";

import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { loadDocumentsToDb } from "@/app/lib/ai/store";
import { DocumentType } from "@prisma/client";
import { Document } from "@langchain/core/documents";
import { generateChecksum, generateDocumentHash } from "@/app/lib/utils";
import { getSignedURL } from "@/app/lib/storage";
import db from "@/app/lib/db";
import { getDocumentSummary } from "./getDocumentSummary";
import { getCitationsForChunks } from "./store";

export async function indexFileDocument(
  document: File,
  documentId: string,
  title: string,
) {
  const checksum = await generateChecksum(document);
  const signedURL = await getSignedURL(
    documentId,
    document.type,
    document.size,
    checksum,
  );

  if (signedURL.error) {
    throw new Error(signedURL.error);
  }

  const url = signedURL.success?.url;

  if (!url) {
    throw new Error("No URL returned from S3");
  }

  await fetch(url, {
    method: "PUT",
    body: document,
    headers: {
      "Content-Type": document.type,
    },
  })
    .then(async (res) => {
      const resultURL = new URL(res.url);
      const objectLocation = resultURL.origin + resultURL.pathname;

      try {
        await db.document.create({
          data: {
            src: objectLocation,
            documentType: DocumentType.FILES,
            id: documentId,
          },
        });
      } catch (error) {
        throw new Error(`Failed to save document in DB: ${error}`);
      }
    })
    .catch((error) => {
      throw new Error(`Failed to upload file to S3: ${error}`);
    });
}

export const loadUrlDocument = async (url: string) => {
  try {
    console.log("Loading documents...");

    // First, load the document with Cheerio to extract the title
    const titleLoader = new CheerioWebBaseLoader(url, {
      selector: "h1",
    });

    // Then, load the document to extract paragraphs
    const contentLoader = new CheerioWebBaseLoader(url, {
      selector: "p",
    });

    // Load both parts
    const [titleDocs, contentDocs] = await Promise.all([
      titleLoader.load(),
      contentLoader.load(),
    ]);

    // Get the title from the first h1 element (if available)
    const title =
      titleDocs.length > 0 ? titleDocs[0].pageContent.trim() : "Unknown Title";

    // Create a single document with content as pageContent and title in metadata
    const processedDoc = new Document({
      pageContent: contentDocs
        .map((doc) => doc.pageContent.trim())
        .join("\n\n"),
      metadata: {
        source: url,
        title: title,
      },
    });

    const documentSummary = await getDocumentSummary(processedDoc.pageContent);

    const documentWithSummary = {
      ...processedDoc,
      metadata: {
        ...processedDoc.metadata,
        summary: documentSummary.summary,
        keyTopics: documentSummary.keyTopics,
      },
    };

    return [documentWithSummary];
  } catch (error) {
    console.error("Error in URL upload:", error);
    throw new Error("Failed to load document from");
  }
};

export async function indexUrlDocument(docs: Document[], src: string) {
  try {
    console.log("Indexing documents...");

    // Check if the document has already been indexed
    console.log("Checking if documents have already been indexed...");
    const documentHashes = await db.documentHashes.findMany({
      where: {
        hash: { in: docs.map((doc) => generateDocumentHash(doc)) },
      },
    });

    if (documentHashes.length > 0) {
      console.log("Documents already indexed in database");
      return {
        success: false,
        message: "Documents already indexed in database",
      };
    }

    // If not, index the documents
    await loadDocumentsToDb(src, DocumentType.URL, docs);

    return { success: true, message: "Documents indexed successfully" };
  } catch (e) {
    console.error("Error in URL upload:", e);
    return { success: false, message: "Error in URL upload" };
  }
}

// Add this new function to extract vector IDs from AI response metadata
export const getCitationsForResponse = async (responseMetadata: any) => {
  try {
    // Extract source document IDs from the response metadata
    // This assumes the AI response includes source document references
    if (!responseMetadata || !responseMetadata.sourceDocuments) {
      return [];
    }

    // Extract all vector IDs from the source documents
    const vectorIds = responseMetadata.sourceDocuments
      .filter((doc: any) => doc && doc.metadata && doc.metadata.id)
      .map((doc: any) => doc.metadata.id);

    if (vectorIds.length === 0) {
      return [];
    }

    // Get citations for all referenced vector IDs
    return await getCitationsForChunks(vectorIds);
  } catch (error) {
    console.error("Error getting citations for response:", error);
    return [];
  }
};
