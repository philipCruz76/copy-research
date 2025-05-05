"use client";

import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import {
  ArrowLeft,
  FileText,
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  Share,
  Edit,
  Trash,
} from "lucide-react";
import { getDocumentById } from "@/app/lib/actions/getDocumentById";
import { DocumentWithData } from "@/app/lib/types/documentUpload.types";
import useSWR from "swr";

type Props = {
  params: Promise<{
    documentId: string;
  }>;
};

// Skeleton components for loading states
const SkeletonHeader = () => (
  <div className="mb-4 animate-pulse">
    <div className="flex items-start gap-3">
      <div className="p-2 bg-gray-200 dark:bg-zinc-700 rounded">
        <div className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="h-7 bg-gray-200 dark:bg-zinc-700 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-2/3 mb-2"></div>
        <div className="flex items-center mt-2">
          <div className="h-3 w-3 bg-gray-200 dark:bg-zinc-700 rounded-full mr-1"></div>
          <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-24"></div>
        </div>
      </div>
    </div>
  </div>
);

const SkeletonActionButtons = () => (
  <div className="flex flex-wrap gap-2 mb-6 animate-pulse">
    <div className="h-9 w-28 bg-gray-200 dark:bg-zinc-700 rounded-md"></div>
    <div className="h-9 w-24 bg-gray-200 dark:bg-zinc-700 rounded-md"></div>
    <div className="h-9 w-24 bg-gray-200 dark:bg-zinc-700 rounded-md"></div>
    <div className="h-9 w-24 bg-gray-200 dark:bg-zinc-700 rounded-md ml-auto"></div>
  </div>
);

const SkeletonContentTab = () => (
  <div className="h-full overflow-auto animate-pulse">
    <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 overflow-auto">
      <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800">
        <div className="h-5 w-32 bg-gray-200 dark:bg-zinc-700 rounded"></div>
        <div className="h-6 w-6 bg-gray-200 dark:bg-zinc-700 rounded"></div>
      </div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-full mb-3"></div>
        <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-full mb-3"></div>
        <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-5/6 mb-3"></div>
        <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-full mb-3"></div>
        <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-3/4 mb-3"></div>
        <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-full mb-3"></div>
        <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-4/5 mb-3"></div>
      </div>
    </div>
  </div>
);

const SkeletonDetailsTab = () => (
  <div className="h-full overflow-auto animate-pulse">
    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-5 mb-4">
      <div className="h-5 w-40 bg-gray-200 dark:bg-zinc-700 rounded mb-4"></div>
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex flex-col">
            <div className="h-3 w-16 bg-gray-200 dark:bg-zinc-700 rounded mb-1"></div>
            <div className="h-5 bg-gray-200 dark:bg-zinc-700 rounded w-2/3 mt-1"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function DocumentPage({ params }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"content" | "details">("content");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Necessary for Next.js 15
  const { documentId } = React.use(params);

  // Use SWR for data fetching with caching
  const fetcher = useCallback(async (id: string) => {
    const doc = await getDocumentById(id);
    return doc as DocumentWithData;
  }, []);

  const {
    data: document,
    error,
    isLoading,
  } = useSWR<DocumentWithData>(documentId, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    dedupingInterval: 60000, // 1 minute
    onError: (err) => {
      console.error("Error fetching document:", err);
      notFound();
    },
  });

  if (error) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-900">
      <header className="sticky top-0 z-5 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Back to documents"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold">Document Details</h1>
          <div className="w-10"></div> {/* Spacer for alignment */}
        </div>
      </header>

      <section className="px-4 py-4 md:px-6">
        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 dark:border-zinc-800 mb-4">
          <div className="flex gap-4">
            <button
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeTab === "content"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
              onClick={() => setActiveTab("content")}
            >
              Content
              {activeTab === "content" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
              )}
            </button>
            <button
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${
                activeTab === "details"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Details
              {activeTab === "details" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
              )}
            </button>
          </div>
        </div>

        {/* Loading Skeleton or Document Content */}
        {isLoading ? (
          <>
            <SkeletonHeader />
            <SkeletonActionButtons />
            <div className="flex-grow overflow-hidden">
              {activeTab === "content" ? (
                <SkeletonContentTab />
              ) : (
                <SkeletonDetailsTab />
              )}
            </div>
          </>
        ) : (
          document && (
            <>
              {/* Document Header Info */}
              <div className="mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded">
                    <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      {document.title || "Untitled Document"}
                    </h2>
                    {document.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {document.description}
                      </p>
                    )}
                    <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>
                        Created:{" "}
                        {new Date(document.createdAt).toLocaleDateString()}
                      </span>

                      {document.documentType && (
                        <span className="ml-4 px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded text-xs">
                          {document.documentType}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mb-6">
                {document.documentData && (
                  <button
                    className="px-3 py-1.5 text-sm rounded-md bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 hover:bg-indigo-200 dark:hover:bg-indigo-900/70 transition-colors"
                    onClick={() => {
                      // Make sure documentData is a string
                      const content = String(document.documentData || "");
                      const blob = new Blob([content], {
                        type: "text/plain",
                      });
                      const url = URL.createObjectURL(blob);
                      // Access the document object from the window
                      const a = window.document.createElement("a");
                      a.href = url;
                      a.download = `${document.title || "document"}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                )}

                <button className="px-3 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 flex items-center gap-1.5 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                  <Share className="h-4 w-4" />
                  Share
                </button>

                <button className="px-3 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 flex items-center gap-1.5 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors">
                  <Edit className="h-4 w-4" />
                  Edit
                </button>

                <button className="px-3 py-1.5 text-sm rounded-md text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 flex items-center gap-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-auto">
                  <Trash className="h-4 w-4" />
                  Delete
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-grow overflow-hidden">
                {activeTab === "content" ? (
                  <div className="h-full overflow-auto">
                    {document.documentData ? (
                      <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 overflow-auto">
                        <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800">
                          <div className="text-sm font-medium">
                            Document Content
                          </div>
                          <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                          >
                            {isCollapsed ? (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronUp className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                        </div>

                        {!isCollapsed && (
                          <div className="whitespace-pre-wrap font-mono text-sm p-4 overflow-auto max-h-[60vh]">
                            {String(document.documentData)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                        <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800">
                          <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">
                          No content available
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md">
                          This document does not have any content stored.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full overflow-auto">
                    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-5 mb-4">
                      <h3 className="text-sm font-medium mb-4">
                        Document Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Title
                          </span>
                          <span className="text-sm mt-1">
                            {document.title || "Untitled Document"}
                          </span>
                        </div>

                        {document.description && (
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Description
                            </span>
                            <span className="text-sm mt-1">
                              {document.description}
                            </span>
                          </div>
                        )}

                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Created
                          </span>
                          <span className="text-sm mt-1">
                            {new Date(document.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Last Updated
                          </span>
                          <span className="text-sm mt-1">
                            {new Date(document.updatedAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Document Type
                          </span>
                          <span className="text-sm mt-1">
                            {document.documentType || "Unknown"}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Source
                          </span>
                          <span className="text-sm mt-1 truncate">
                            {document.src || "Unknown"}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Index Status
                          </span>
                          <span className="text-sm mt-1 flex items-center">
                            <span
                              className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                document.indexed
                                  ? "bg-green-500"
                                  : "bg-yellow-500"
                              }`}
                            ></span>
                            {document.indexStatus}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )
        )}
      </section>
    </div>
  );
}
