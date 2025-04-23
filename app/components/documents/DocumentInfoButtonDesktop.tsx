"use client";

import { useDocumentSelection } from "@/app/lib/stores/document-selection";
import { FileText, ArrowRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { DocumentWithData } from "@/app/lib/types/documentUpload.types";

interface DocumentInfoButtonProps {
  document: DocumentWithData;
}

export default function DocumentInfoButtonDesktop({ document }: DocumentInfoButtonProps) {
  const {
    selectedDocumentId,
    setSelectedDocumentId,
    showDetail,
    setShowDetail,
  } = useDocumentSelection();

  const handleDocumentClick = (documentId: string) => {
    setSelectedDocumentId(documentId);
    setShowDetail(true);
  };

  return (
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
  );
}
