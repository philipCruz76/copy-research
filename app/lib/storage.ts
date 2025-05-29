"use server";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "@/app/lib/s3";
import { PdfReader } from "pdfreader";

const maxFileSize = 1024 * 1024 * 512; //512MB
const acceptedTypes = [
  "text/plain",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function getSignedURL(
  documentId: string,
  fileType: string,
  fileSize: number,
  checksum: string,
) {
  if (!acceptedTypes.includes(fileType)) {
    return { error: "File type not accepted" };
  }
  if (fileSize > maxFileSize) {
    return { error: "File size too large" };
  }

  let putObjectS3;

  try {
    putObjectS3 = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: `uploads/${documentId}`,
      ContentType: fileType,
      ContentLength: fileSize,
      ChecksumSHA256: checksum,
    });
  } catch (error) {
    return { error: "Failed to get signed URL" + error };
  }

  const signedURL = await getSignedUrl(s3, putObjectS3, { expiresIn: 60 });
  console.log(signedURL);

  return { success: { url: signedURL } };
}

export async function downloadDocument(documentId: string) {
  const doc = await s3.send(
    new GetObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
      Key: `uploads/${documentId}`,
    }),
  );

  // Get the raw document content
  const content = await doc.Body?.transformToByteArray();

  if (!content) {
    return { error: "Failed to retrieve document content" };
  }

  // Get the document's content type
  const contentType = doc.ContentType;

  // If it's a PDF, parse it to text
  if (contentType === "application/pdf") {
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
        size: doc.ContentLength,
        contentType,
      };
    } catch (error) {
      console.error("Error parsing PDF:", error);
      return {
        content,
        error: "Failed to parse PDF content",
        size: doc.ContentLength,
        contentType,
      };
    }
  }

  // Return original content for non-PDF files
  return {
    content,
    size: doc.ContentLength,
    contentType,
  };
}
