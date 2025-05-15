"use client";

import { Upload, Link as LinkIcon, Loader2, AlertCircle } from "lucide-react";
import { cn, isValidURL } from "@/app/lib/utils";
import { toast } from "sonner";
import { lazy, useEffect, useState } from "react";
import {
  checkForDocumentLimit,
  documentLimitCheck,
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

export default function AddDocumentsPage() {
  const [url, setUrl] = useState<string>("");
  const [isUrlLoading, setIsUrlLoading] = useState<boolean>(false);
  const [limitReached, setLimitReached] = useState<boolean>(false);
  const [limitMessage, setLimitMessage] = useState<string>("");
  const [isUrlValid, setIsUrlValid] = useState<boolean | null>(null);
  const [urlTouched, setUrlTouched] = useState<boolean>(false);
  const { setIsOpen } = useFileUploadModal();
  const isDesktopOrLaptop = useMediaQuery({ minWidth: 900 });

  const handleURLUpload = async (url: string) => {
    try {
      setIsUrlLoading(true);

      // Start loading toast with promise
      const toastPromise = toast.promise(
        (async () => {
          // Validate URL
          await documentLimitCheck();
          // Proceed with the sanitized URL
          const response = await processUrl(url);
          if (!response.success) {
            throw new Error(response.message);
          }

          setUrl(""); // Clear the input field after successful upload

          // Check if we're now at the limit after this upload
          await checkLimit();

          return response;
        })(),
        {
          loading: "Processing URL...",
          success: (data) => data.message || "URL processed successfully!",
          error: (err) =>
            err.message || "An error occurred while processing the URL",
        },
      );

      await toastPromise; // Wait for the promise to resolve or reject
    } catch (error) {
      // Additional error handling if needed
    } finally {
      setIsUrlLoading(false);
    }
  };

  const handleFileUploadClick = async () => {
    try {
      setIsOpen(true);
    } catch (error) {
      toast.error("Failed to check document limits");
    }
  };

  const checkLimit = async () => {
    const response = await checkForDocumentLimit();
    if (!response.success) {
      setLimitReached(true);
      setLimitMessage(response.message);
      toast.error(response.message);
    } else {
      setLimitReached(false);
      setLimitMessage("");
    }
  };

  useEffect(() => {
    checkLimit();
  }, []);

  return (
    <div className="flex flex-col h-full max-w-[100dvw] bg-white dark:bg-zinc-900 text-black dark:text-white p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Add Documents</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Upload documents or add web URLs to train your AI assistant
        </p>
      </header>

      {limitReached && (
        <div className="mb-6 p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-800 dark:text-red-300">
          <AlertCircle className="h-5 w-5" />
          <p>{limitMessage}</p>
        </div>
      )}

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
            onClick={handleFileUploadClick}
            disabled={isUrlLoading || limitReached}
            className={`w-full px-4 py-2 rounded-md transition-colors flex items-center justify-center ${
              isUrlLoading || limitReached
                ? "bg-gray-300 dark:bg-zinc-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
            }`}
          >
            {isUrlLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                <span>Wait...</span>
              </>
            ) : (
              "Upload"
            )}
          </button>
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
          <div className="flex flex-col">
            <div className="flex">
              <input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => {
                  e.preventDefault();
                  setUrlTouched(true);
                  const inputValue = e.target.value;
                  const { isValid, sanitizedUrl } = isValidURL(inputValue);
                  setIsUrlValid(isValid);

                  // Always set the raw input value to allow editing
                  setUrl(inputValue);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Prevent form submission
                    if (!isUrlLoading && !limitReached && isUrlValid) {
                      handleURLUpload(url);
                    }
                  }
                }}
                disabled={isUrlLoading || limitReached}
                className={cn(
                  "w-full px-3 py-2 border rounded-l-md bg-white dark:bg-zinc-800 focus:outline-none focus:ring focus:ring-black dark:focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed mobile:text-[16px] mobile:leading-[16px] border-gray-300 dark:border-zinc-700",
                  urlTouched &&
                    isUrlValid === false &&
                    "border-red-500 text-red-500 dark:text-red-400",
                )}
              />
              <button
                id="urlUpload"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleURLUpload(url);
                }}
                disabled={isUrlLoading || !isUrlValid || limitReached}
                className={cn(
                  "px-4 py-2 rounded-r-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center",
                  urlTouched && isUrlValid === false
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : isUrlValid
                      ? "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                      : "bg-gray-300 dark:bg-zinc-700 text-gray-500 dark:text-gray-400",
                )}
              >
                {isUrlLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing
                  </>
                ) : (
                  "Add"
                )}
              </button>
            </div>
            {urlTouched && isUrlValid === false && url.trim() !== "" && (
              <p className="text-red-500 text-sm mt-1">
                Please enter a valid URL
              </p>
            )}
          </div>
        </div>
      </form>
      {isDesktopOrLaptop && <FileUploadModalDesktop />}
      {!isDesktopOrLaptop && <FileUploadModalMobile />}
    </div>
  );
}
