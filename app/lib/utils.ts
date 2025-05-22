import { Document } from "@langchain/core/documents";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as Crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validates a URL string
 * @param url The URL to validate
 * @returns An object with isValid boolean and the sanitized URL if valid
 */
export const isValidURL = (
  url: string,
): { isValid: boolean; sanitizedUrl: string } => {
  try {
    // Trim whitespace
    let trimmedUrl = url.trim();

    // Check if URL starts with http:// or https://
    if (
      !trimmedUrl.startsWith("http://") &&
      !trimmedUrl.startsWith("https://")
    ) {
      trimmedUrl = "https://" + trimmedUrl;
    }

    // Create URL object to validate URL format
    const urlObj = new URL(trimmedUrl);

    // Check if hostname is valid (has at least one dot, indicating a domain)
    if (!urlObj.hostname.includes(".")) {
      return { isValid: false, sanitizedUrl: "" };
    }

    // Make sure the protocol is http or https
    if (urlObj.protocol !== "http:" && urlObj.protocol !== "https:") {
      return { isValid: false, sanitizedUrl: "" };
    }

    return { isValid: true, sanitizedUrl: urlObj.toString() };
  } catch (error) {
    // URL constructor will throw if URL is invalid
    return { isValid: false, sanitizedUrl: "" };
  }
};
export function generateDocumentHash(document: Document) {
  return Crypto.createHash("md5").update(document.pageContent).digest("hex");
}
export async function generateRandomFileName(bytes = 32) {
  const crypto = await import("crypto");
  return crypto.randomBytes(bytes).toString("hex");
}

export async function generateChecksum(file: File) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}
export function getLocalStorage(key: string) {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem(key) || "[]");
  }
  return [];
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Helper function to extract text from various message formats
export const extractTextFromMessage = (message: any): string => {
  if (!message) return "";

  // Direct string content
  if (typeof message.content === "string") {
    return message.content;
  }

  // Object with content
  if (typeof message.content === "object") {
    // Check for text property
    if (message.content.text) {
      return message.content.text;
    }

    // Check for parts array
    if (message.content.parts && Array.isArray(message.content.parts)) {
      const textParts = message.content.parts
        .filter((part: any) => typeof part === "string")
        .join(" ");
      if (textParts) return textParts;

      // Check for text in each part
      for (const part of message.content.parts) {
        if (part && typeof part === "object" && part.text) {
          return part.text;
        }
      }
    }
  }

  // Fallback to stringifying the content if possible
  try {
    if (message.content) {
      return JSON.stringify(message.content);
    }
  } catch (e) {
    // Ignore stringification errors
  }

  return "";
};

// Convert an async iterable to an array
export async function convertAsyncIterableToArray<T>(
  iterable: AsyncIterable<T>,
): Promise<T[]> {
  const result: T[] = [];
  for await (const item of iterable) {
    result.push(item);
  }
  return result;
}
