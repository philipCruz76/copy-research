import { Document, DocumentData } from "@prisma/client";
import { z } from "zod";

export const DocumentUploadSchema = z.object({
  pageContent: z.string(),
  metadata: z.object({
    title: z.string(),
    documentId: z.string(),
    type: z.string(),
    size: z.number(),
    checksum: z.string(),
  }),
});

export type DocumentType = z.infer<typeof DocumentUploadSchema>;

export type DocumentWithData = Document & {
  documentData: DocumentData["data"];
};

export const FileUploadValidator = z.object({
  title: z.string().min(3),
  file: z.instanceof(File, {
    message: "File is required",
  }),
});

export type FileUploadType = z.infer<typeof FileUploadValidator>;
