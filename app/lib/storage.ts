"use server";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import s3 from "@/app/lib/s3";

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
