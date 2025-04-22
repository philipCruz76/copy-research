"use client";

import { Upload, Link as LinkIcon } from "lucide-react";
import { Input } from "../lib/ui/Input";
import {
  generateChecksum,
  generateRandomFileName,
  isValidURL,
} from "../lib/utils";
import { toast } from "sonner";
import { lazy, useState } from "react";
import { downloadDocument } from "../lib/storage";
import {
  checkForDocumentLimit,
  processUrl,
} from "../lib/actions/document-actions";
import { useFileUploadModal } from "../lib/stores/file-upload";
import { useMediaQuery } from "react-responsive";

const FileUploadModalMobile = lazy(
  () => import("@/app/components/modal/FileUploadModalMobile"),
);
const FileUploadModalDesktop = lazy(
  () => import("@/app/components/modal/FileUploadModalDesktop"),
);
const acceptedTypes = [
  "text/plain",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export default function AddDocumentsPage() {
  const [documentURL, setDocumentURL] = useState<string | null>(null);
  const [documentContent, setDocumentContent] = useState<string | null>(null);
  const [url, setUrl] = useState<string>("");
  const { setIsOpen } = useFileUploadModal();
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 900 });

  const documentLimitCheck = async () => {
    const response = await checkForDocumentLimit();
    if (!response.success) {
      toast.error(response.message);
      return;
    }
  };

  const handleURLUpload = async (url: string) => {
    // Validate URL
    const { isValid, sanitizedUrl } = isValidURL(url);
    await documentLimitCheck();
    if (!isValid) {
      toast.error("Please enter a valid URL");
      return;
    }

    // Proceed with the sanitized URL
    const response = await processUrl(sanitizedUrl);
    if (response.success) {
      toast.success(response.message);
    } else {
      toast.error(response.message);
    }
  };

  const handleFileUpload = async (file: File) => {
    await documentLimitCheck();
    const checksum = await generateChecksum(file);
    const documentId = await generateRandomFileName();

    console.log(documentId, file.type, file.size, checksum);
    try {
      // Get the signed URL from our API route
      const response = await fetch("/api/fileUpload", {
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
        toast.error(data.message);
        return;
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (
        !data.signedUrl ||
        !data.signedUrl.success ||
        !data.signedUrl.success.url
      ) {
        throw new Error("No valid signed URL returned");
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
        throw new Error(
          `Failed to upload file: ${uploadResponse.status} ${uploadResponse.statusText}`,
        );
      }

      // Get the file URL from the upload response
      const resultURL = new URL(uploadResponse.url);
      const objectLocation = resultURL.origin + resultURL.pathname;
      setDocumentURL(objectLocation);

      const { content, text } = await downloadDocument(documentId);

      if (!content) {
        toast.error("Failed to download document");
        return;
      }

      if (!text) {
        toast.error("Failed to download document");
        return;
      }

      await fetch("/api/pinecone-upload", {
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

      if (!response.ok) {
        toast.error("Failed to upload documents to Pinecone");
        return;
      }

      toast.success("Documents loaded to db");
      setDocumentContent(text?.join(" ") ?? "No text found");

      toast.success("Document uploaded successfully");
    } catch (error) {
      console.error("Error in file upload process:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload document",
      );
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 text-black dark:text-white p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Add Documents</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Upload documents or add web URLs to train your AI assistant
        </p>
      </header>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {/* File Upload Card */}
        <div className="border border-gray-200 dark:border-zinc-800 rounded-lg p-6 hover:border-gray-300 dark:hover:border-zinc-700 transition-colors">
          <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800">
            <Upload className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Upload Files</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Upload PDF, DOCX, TXT, or other text-based documents
          </p>
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              // Previous behavior
              // document.getElementById("fileUpload")?.click()
            }}
            className="w-full px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Choose Files
            <Input
              type="file"
              id="fileUpload"
              accept={acceptedTypes.join(",")}
              max={1}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                e.preventDefault();
                const target = e.target as HTMLInputElement & {
                  files: FileList;
                };
                handleFileUpload(target.files[0]);
              }}
              style={{ display: "none" }}
            />
          </button>
          {documentURL && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Document URL: {documentURL}
              </p>
            </div>
          )}

          {documentContent && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Document Content: {documentContent}
              </p>
            </div>
          )}
        </div>

        {/* Web URL Card */}
        <div className="border border-gray-200 dark:border-zinc-800 rounded-lg p-6 hover:border-gray-300 dark:hover:border-zinc-700 transition-colors">
          <div className="w-12 h-12 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800">
            <LinkIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Add Web URL</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Add content from websites by providing the URL
          </p>
          <div className="flex">
            <input
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => {
                e.preventDefault();
                setUrl(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // Prevent form submission
                  handleURLUpload(url);
                }
              }}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-l-md bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
            <button
              id="urlUpload"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleURLUpload(url);
              }}
              className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-r-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </form>
      {isDesktopOrLaptop && <FileUploadModalDesktop />}
      {!isDesktopOrLaptop && <FileUploadModalMobile />}
    </div>
  );
}
