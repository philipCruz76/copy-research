"use client";

import {
  FileText,
  Calendar,
  ArrowRight,
  Upload,
  Search,
  Filter,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Document, DocumentData } from "@prisma/client";
import DocumentDataComponent from "../components/documents/DocumentData";

type DocumentWithData = Document & { documentData: DocumentData["data"] };

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

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentWithData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const response = await fetch("/api/documents");
        if (!response.ok) {
          throw new Error("Failed to fetch documents");
        }
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDocuments();
  }, []);

  const handleDocumentClick = (documentId: string) => {
    setSelectedDocumentId(documentId);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
    // Using a timeout to wait for the animation to complete before deselecting
    setTimeout(() => {
      setSelectedDocumentId(null);
    }, 300);
  };

  const selectedDocument = documents.find(
    (doc) => doc.id === selectedDocumentId,
  );

  // Filter documents based on search term
  const filteredDocuments = documents;

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
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
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
        </div>

        <div className="flex-1 overflow-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
            </div>
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
                  <button
                    onClick={() => handleDocumentClick(document.id)}
                    className={`w-full text-left block p-4 rounded-lg border transition-all duration-200 ${
                      selectedDocumentId === document.id
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-400"
                        : "border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
                    }`}
                    aria-expanded={selectedDocumentId === document.id}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3 items-start">
                        <div
                          className={`p-2 rounded ${
                            selectedDocumentId === document.id
                              ? "bg-indigo-100 dark:bg-indigo-800"
                              : "bg-gray-100 dark:bg-zinc-800"
                          }`}
                        >
                          <FileText
                            className={`h-5 w-5 ${
                              selectedDocumentId === document.id
                                ? "text-indigo-600 dark:text-indigo-400"
                                : "text-gray-500 dark:text-gray-400"
                            }`}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {document.title || "Untitled Document"}
                          </h3>
                          {document.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                              {document.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mr-4">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(document.createdAt).toLocaleDateString()}
                        </div>
                        <motion.div
                          animate={{
                            rotate: selectedDocumentId === document.id ? 90 : 0,
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <ArrowRight
                            className={`h-4 w-4 ${
                              selectedDocumentId === document.id
                                ? "text-indigo-500 dark:text-indigo-400"
                                : "text-gray-400"
                            }`}
                          />
                        </motion.div>
                      </div>
                    </div>
                  </button>
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
                document={selectedDocument}
                onClose={closeDetail}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
