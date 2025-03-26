import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { loadDocumentsToDb } from "@/app/lib/ai/store";
import { DocumentType } from "@prisma/client";
import { Document } from "@langchain/core/documents";
import { generateChecksum, generateDocumentHash } from "@/app/lib/utils";
import { getSignedURL } from "@/app/lib/storage";
import db from "@/app/lib/db";

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
    const pTagSelector = `p`;
    const cheerioLoader = new CheerioWebBaseLoader(url, {
      selector: pTagSelector,
    });
    const docs = await cheerioLoader.load();
    return docs;
  } catch (error) {
    console.error("Error in URL upload:", error);
    throw new Error("Failed to load document from");
  }
};

export async function indexUrlDocument(docs: Document[], src: string) {
  let error = false;

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
