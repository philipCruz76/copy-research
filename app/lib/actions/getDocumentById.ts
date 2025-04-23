"use server";

import db from "@/app/lib/db";
import { DocumentWithData } from "../types/documentUpload.types";

export async function getDocumentById(documentId: string) {
  try {
    const document = await db.document.findUnique({
      where: {
        id: documentId,
      },
      include: {
        documentData: true,
      }
    });

    if (!document || !document.documentData) {
      throw new Error("Document not found");
    }

    const documentWithData = {
        ...document,
        documentData: document["documentData"][0].data,
    }

    return documentWithData;
  } catch (error) {
    console.error("Error fetching document by ID:", error);
    throw new Error("Failed to fetch document by ID");
  }
}
