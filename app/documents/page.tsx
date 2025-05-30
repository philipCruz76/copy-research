"use client";

import { FileText, Upload, Search, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DocumentDataComponent from "@/app/components/documents/DocumentData";
import DocumentInfoButtonMobile from "@/app/components/documents/DocumentInfoButtonMobile";
import DocumentInfoButtonDesktop from "@/app/components/documents/DocumentInfoButtonDesktop";
import { DocumentWithData } from "@/app/lib/types/documentUpload.types";
import { useDocumentSelection } from "@/app/lib/stores/document-selection";
import { useMediaQuery } from "react-responsive";
import useSWR from "swr";

// Animation variants for list items
const listItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: "easeOut",
    },
  }),
};

// Animation variants for containers
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration: 0.3,
    },
  },
};

// Skeleton components for document list
const SkeletonDocumentItem = () => (
  <div className="p-4 border border-gray-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-shadow animate-pulse">
    <div className="flex justify-between">
      <div className="flex items-start gap-3 flex-1">
        <div className="p-2 bg-gray-200 dark:bg-zinc-700 rounded h-10 w-10"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-200 dark:bg-zinc-700 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-2/3 mb-2"></div>
          <div className="flex items-center mt-2">
            <div className="h-3 w-3 bg-gray-200 dark:bg-zinc-700 rounded-full mr-1"></div>
            <div className="h-3 bg-gray-200 dark:bg-zinc-700 rounded w-24"></div>
          </div>
        </div>
      </div>
      <div className="h-8 w-8 bg-gray-200 dark:bg-zinc-700 rounded-md"></div>
    </div>
  </div>
);

const SkeletonDocumentList = () => (
  <div className="grid gap-3">
    {Array.from({ length: 6 }).map((_, index) => (
      <SkeletonDocumentItem key={index} />
    ))}
  </div>
);

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    selectedDocumentId,
    setSelectedDocumentId,
    showDetail,
    setShowDetail,
  } = useDocumentSelection();
  const isNotDesktop = useMediaQuery({ maxWidth: 900 });

  // Use SWR for data fetching with caching
  const fetcher = useCallback(
    (url: string) => fetch(url).then((res) => res.json()),
    [],
  );
  const {
    data: documents = [],
    isLoading,
    error,
  } = useSWR<DocumentWithData[]>("/api/documents", fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    dedupingInterval: 60000, // 1 minute
  });

  const closeDetail = () => {
    setShowDetail(false);
    // Using a timeout to wait for the animation to complete before deselecting
    setTimeout(() => {
      setSelectedDocumentId(null);
    }, 300);
  };

  useEffect(() => {
    if (isNotDesktop) {
      setShowDetail(false);
    }
  }, [isNotDesktop, setShowDetail]);

  const selectedDocument = documents.find(
    (doc) => doc.id === selectedDocumentId,
  );

  // Filter documents based on search term
  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentData[0].keyTopics.some((topic) =>
        topic.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  return (
    <div className="flex h-full bg-white dark:bg-zinc-900 text-black dark:text-white">
      {/* Documents List Panel */}
      <motion.div
        className={`flex flex-col ${showDetail ? "w-1/3 border-r border-gray-200 dark:border-zinc-800" : "w-full"} transition-all duration-300 h-full overflow-hidden`}
        initial={false}
        animate={{
          width: showDetail ? "33.333%" : "100%",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
          <>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">Documents</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Manage your uploaded documents
                </p>
              </div>

              <Link
                href="/add-documents"
                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Document
              </Link>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 mobile:text-[16px] mobile:leading-[16px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
                </button>
              )}
            </div>
          </>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <SkeletonDocumentList />
          ) : !filteredDocuments || filteredDocuments.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center h-full p-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800">
                <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                {searchTerm ? "No matching documents" : "No documents yet"}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                {searchTerm
                  ? "Try a different search term or clear your search."
                  : "Upload documents to train your AI assistant with your content."}
              </p>
              {!searchTerm && (
                <Link
                  href={"/add-documents"}
                  className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
                >
                  Upload Document
                </Link>
              )}
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 bg-gray-200 dark:bg-zinc-700 text-black dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-zinc-600 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="grid gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredDocuments.map((document, i) => (
                <motion.div
                  key={document.id}
                  variants={listItemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <>
                    <div className="flex desktop:hidden">
                      <DocumentInfoButtonMobile document={document} />
                    </div>
                    <div className="hidden desktop:flex">
                      <DocumentInfoButtonDesktop document={document} />
                    </div>
                  </>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Document Detail Panel: DESKTOP ONLY */}
      <div className="hidden desktop:flex max-w-2/3">
        <AnimatePresence>
          {showDetail && selectedDocument && (
            <motion.div
              className="min-w-2/3 h-full overflow-hidden"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <DocumentDataComponent
                doc={selectedDocument}
                onClose={closeDetail}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
