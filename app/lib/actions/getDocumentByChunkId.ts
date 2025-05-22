"use server";

import db from "@/app/lib/db";
import { getCachedDocument } from "../ai/store";

export const getDocumentByChunkId = async (chunkId: string) => {
  try {
    console.log("Retriving document by chunk id:", chunkId);
    const documentId = await db.documentChunk.findFirst({
      where: {
        vectorId: chunkId,
      },
      select: {
        documentId: true,
      },
    });
    if (!documentId) {
      throw new Error("Document not found");
    }

    const document = await getCachedDocument(documentId.documentId);

    return document;
  } catch (error: any) {
    throw new Error("Error retriving document by chunk id:", error);
  }
};
