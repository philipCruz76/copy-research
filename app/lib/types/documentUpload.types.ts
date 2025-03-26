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
