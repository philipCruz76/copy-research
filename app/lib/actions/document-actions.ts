"use server";

import { indexUrlDocument, loadUrlDocument } from "@/app/lib/ai/getAnswers";
import db from "@/app/lib/db";
import { generateRandomFileName, generateChecksum } from "@/app/lib/utils";
import { auth } from "../auth";
import { PdfReader } from "pdfreader";

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

export async function checkForDocumentLimit(userId: string): Promise<{
  success: boolean;
  message: string;
}> {
  const docs = await db.document.findMany({
    where: {
      userId: userId,
    },
  });
  if (docs.length >= 5) {
    return { success: false, message: "Document limit reached" };
  }
  return { success: true, message: "Document limit not reached" };
}

export async function checkCurrentUserDocumentLimit(): Promise<{
  success: boolean;
  message: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "User not authenticated" };
  }
  return checkForDocumentLimit(session.user.id);
}

export const handleFileUpload = async (file: File, documentTitle: string) => {
  const checksum = await generateChecksum(file);
  const documentId = await generateRandomFileName();

  const session = await auth();
  console.log(documentId, file.type, file.size, checksum);
  try {
    // Get the signed URL from our API route
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const { text, error } = await parsePdf(file);

    if (error) {
      return { success: false, message: error };
    }

    const response = await fetch(`${baseUrl}/api/fileUpload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-vercel-protection-bypass": `${process.env.VERCEL_AUTOMATION_BYPASS_SECRET}`,
      },
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

    const [uploadResponse, pineconeResponse] = await Promise.all([
      // Upload the file to S3 using the signed URL
      fetch(signedUrl, {
        method: "PUT", // Important: Use PUT not POST for S3 signed URLs
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      }),
      // Upload the file to Pinecone
      fetch(`${baseUrl}/api/pinecone-upload`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          documentId,
          fileType: file.type,
          documentURL: "",
          checksum,
          documentTitle,
          userId: session?.user.id!,
        }),
      }),
    ]);

    if (!uploadResponse.ok) {
      return {
        success: false,
        message: `Failed to upload file: ${uploadResponse.status} ${uploadResponse.statusText}`,
      };
    }

    if (!pineconeResponse.ok) {
      return {
        success: false,
        message: "Failed to upload documents to Pinecone",
      };
    }
    const resultURL = new URL(uploadResponse.url);
    const objectLocation = resultURL.origin + resultURL.pathname;

    await db.document.update({
      where: {
        id: documentId,
      },
      data: {
        src: objectLocation,
      },
    });

    return {
      success: true,
      message: "Document uploaded successfully",
      userId: session?.user.id,
    };
  } catch (error) {
    console.error("Error in file upload process:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to upload document",
    };
  }
};

async function parsePdf(file: File) {
  const content = await file.arrayBuffer();

  if (file.type !== "application/pdf") {
    return {
      content,
      error: "File is not a PDF",
      size: file.size,
      fileType: file.type,
    };
  }
  try {
    console.log("Parsing PDF");
    const buffer = Buffer.from(content);

    // Create a promise-based wrapper around the callback-based PdfReader
    const extractPdfText = () => {
      return new Promise<string[]>((resolve) => {
        const pdfText: string[] = [];
        let currentPage = 0;
        let pageText = "";
        const maxSectionLength = 1000; // Character limit per section

        new PdfReader().parseBuffer(buffer, (err, item) => {
          if (err) {
            console.error("Error parsing PDF:", err);
            return;
          }

          if (!item) {
            // End of file, resolve with collected text
            if (pageText) {
              pdfText.push(pageText.trim());
            }
            resolve(pdfText);
            return;
          }

          if (item.page && item.page !== currentPage) {
            // New page
            if (pageText) {
              pdfText.push(pageText.trim());
              pageText = "";
            }
            currentPage = item.page;
          } else if (item.text) {
            // Add text to current section
            const newText =
              (pageText && !pageText.endsWith(" ") ? " " : "") + item.text;

            // Check if adding this text would exceed the character limit
            if ((pageText + newText).length > maxSectionLength) {
              // Save current section and start a new one
              pdfText.push(pageText.trim());
              pageText = item.text;
            } else {
              // Add to current section
              pageText += newText;
            }
          }
        });
      });
    };

    const extractedText = await extractPdfText();

    console.log("PDF parsed with", extractedText.length, "pages/sections");

    return {
      content, // Original binary content
      text: extractedText, // Extracted text
      size: file.size,
      fileType: file.type,
    };
  } catch (error) {
    console.error("Error parsing PDF:", error);
    return {
      content,
      error: "Failed to parse PDF content",
      size: file.size,
      fileType: file.type,
    };
  }
}
