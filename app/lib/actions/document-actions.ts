"use server";

import { indexUrlDocument, loadUrlDocument } from "../ai/getAnswers";
import db from "@/app/lib/db";

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
