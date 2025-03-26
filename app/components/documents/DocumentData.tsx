"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  X,
} from "lucide-react";

type DocumentDataProps = {
  document: any; // Replace with your proper document type
  onClose: () => void;
};

export default function DocumentDataComponent({
  document,
  onClose,
}: DocumentDataProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const documentContent = document.documentData[0]?.data || "";

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden bg-gray-50 dark:bg-zinc-800 rounded-lg mb-4"
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white dark:bg-zinc-700 rounded">
              <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <h2 className="font-medium">
                {document.title || "Untitled Document"}
              </h2>
              {document.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {document.description}
                </p>
              )}
              <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{new Date(document.createdAt).toLocaleDateString()}</span>

                {document.documentType && (
                  <span className="ml-4 px-2 py-0.5 bg-gray-100 dark:bg-zinc-700 rounded text-xs">
                    {document.documentType}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {documentContent && (
              <button
                className="p-1.5 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
                onClick={() => {
                  // Download functionality (would need to be implemented)
                  const blob = new Blob([documentContent], {
                    type: "text/plain",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${document.title || "document"}.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                <Download className="h-4 w-4" />
              </button>
            )}

            <button
              className="p-1.5 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </button>

            <button
              className="p-1.5 bg-gray-100 dark:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-600 transition-colors"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {documentContent ? (
                <div className="whitespace-pre-wrap font-mono text-sm bg-white dark:bg-zinc-900 p-4 rounded border border-gray-200 dark:border-zinc-700 overflow-auto max-h-[60vh]">
                  {documentContent}
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                  No content available for this document.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
