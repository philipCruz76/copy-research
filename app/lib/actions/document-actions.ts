"use server";

import { indexUrlDocument, loadUrlDocument } from "../ai/getAnswers";
import db from "@/app/lib/db";
import { generateRandomFileName, generateChecksum } from "../utils";
import { downloadDocument } from "../storage";

export async function processUrl(url: string) {
  try {
    const document = await loadUrlDocument(url);
    const response = await indexUrlDocument(document, url);
    if (!response.success) {
      throw new Error(response.message);
    }
    return { success: true, message: "Document indexed successfully" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function checkForDocumentLimit(): Promise<{
  success: boolean;
  message: string;
}> {
  const docs = await db.document.findMany();
  if (docs.length >= 10) {
    return { success: false, message: "Document limit reached" };
  }
  return { success: true, message: "Document limit not reached" };
}

export async function documentLimitCheck() {
  const response = await checkForDocumentLimit();
  if (!response.success) {
    throw new Error(response.message);
  }
}

export const handleFileUpload = async (file: File) => {
  await documentLimitCheck();
  const checksum = await generateChecksum(file);
  const documentId = await generateRandomFileName();

  console.log(documentId, file.type, file.size, checksum);
  try {
    // Get the signed URL from our API route
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/fileUpload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        documentId,
        fileType: file.type,
        fileSize: file.size,
        checksum,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      return { success: false, message: data.message };
    }

    const data = await response.json();
    console.log("API Response:", data);

    if (
      !data.signedUrl ||
      !data.signedUrl.success ||
      !data.signedUrl.success.url
    ) {
      return { success: false, message: "No valid signed URL returned" };
    }

    const signedUrl = data.signedUrl.success.url;
    console.log("Signed URL:", signedUrl);

    // Step 2: Upload the file to S3 using the signed URL
    const uploadResponse = await fetch(signedUrl, {
      method: "PUT", // Important: Use PUT not POST for S3 signed URLs
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!uploadResponse.ok) {
      return {
        success: false,
        message: `Failed to upload file: ${uploadResponse.status} ${uploadResponse.statusText}`,
      };
    }

    // Get the file URL from the upload response
    const resultURL = new URL(uploadResponse.url);
    const objectLocation = resultURL.origin + resultURL.pathname;

    const { content, text } = await downloadDocument(documentId);

    if (!content) {
      return { success: false, message: "Failed to get document content" };
    }

    if (!text) {
      return { success: false, message: "Failed to download document" };
    }

    const pineconeResponse = await fetch(`${baseUrl}/api/pinecone-upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        documentId,
        fileType: file.type,
        documentURL: objectLocation,
        checksum,
      }),
    });

    if (!pineconeResponse.ok) {
      return {
        success: false,
        message: "Failed to upload documents to Pinecone",
      };
    }

    return { success: true, message: "Document uploaded successfully" };
  } catch (error) {
    console.error("Error in file upload process:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to upload document",
    };
  }
};
