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
  Share,
  Trash,
  Edit,
  Tag,
  BookOpen,
  FileInput,
  Search,
} from "lucide-react";
import { DocumentWithData } from "@/app/lib/types/documentUpload.types";

// Animation variants
const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1.0] },
  },
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

// Enhanced animations for document content
const itemAnimations = {
  initial: { opacity: 0, y: 15 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  }),
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
};

type DocumentDataProps = {
  doc: DocumentWithData; // Replace with your proper document type
  onClose?: () => void;
};

export default function DocumentDataComponent({
  doc,
  onClose,
}: DocumentDataProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isSummaryCollapsed, setIsSummaryCollapsed] = useState(false);
  const [topicFilter, setTopicFilter] = useState("");
  const documentContent = doc.documentData[0]?.data || "";
  const documentSummary = doc.documentData[0]?.summary || "";
  const documentKeyTopics = doc.documentData[0]?.keyTopics || [];
  const [activeTab, setActiveTab] = useState<"content" | "details">("content");

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white dark:bg-zinc-900">
      {/* Header */}
      <motion.div
        className="p-6 border-b border-gray-200 dark:border-zinc-800 flex justify-between"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
      >
        <div className="flex items-start gap-3">
          <motion.div
            className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 0.1,
              duration: 0.3,
              type: "spring",
              stiffness: 400,
            }}
          >
            <FileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </motion.div>
          <div>
            <motion.h2
              className="text-xl font-bold"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
            >
              {doc.title || "Untitled Document"}
            </motion.h2>
            {doc.description && (
              <motion.p
                className="text-sm text-gray-500 dark:text-gray-400 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                {doc.description}
              </motion.p>
            )}
            <motion.div
              className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              <Calendar className="h-3 w-3 mr-1" />
              <span>
                Created: {new Date(doc.createdAt).toLocaleDateString()}
              </span>

              {doc.documentType && (
                <span className="ml-4 px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 rounded text-xs">
                  {doc.documentType}
                </span>
              )}
            </motion.div>
          </div>
        </div>

        {onClose && (
          <motion.div
            className="flex items-start gap-2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <motion.button
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              onClick={onClose}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              aria-label="Close document view"
            >
              <X className="h-5 w-5" />
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="px-6 pt-4 border-b border-gray-200 dark:border-zinc-800"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
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
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
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
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        className="px-6 py-3 flex gap-2"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        {documentContent && (
          <motion.button
            className="px-3 py-1.5 text-sm rounded-md bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 hover:bg-indigo-200 dark:hover:bg-indigo-900/70 transition-colors"
            onClick={() => {
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
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.45, duration: 0.2 }}
          >
            <Download className="h-4 w-4" />
            Download
          </motion.button>
        )}

        <motion.button
          className="px-3 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 flex items-center gap-1.5 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.2 }}
        >
          <Share className="h-4 w-4" />
          Share
        </motion.button>

        <motion.button
          className="px-3 py-1.5 text-sm rounded-md bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 flex items-center gap-1.5 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.55, duration: 0.2 }}
        >
          <Edit className="h-4 w-4" />
          Edit
        </motion.button>

        <div className="flex-grow"></div>

        <motion.button
          className="px-3 py-1.5 text-sm rounded-md text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/40 flex items-center gap-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.2 }}
        >
          <Trash className="h-4 w-4" />
          Delete
        </motion.button>
      </motion.div>

      {/* Content */}
      <motion.div
        className="flex-grow overflow-hidden p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <AnimatePresence mode="wait">
          {activeTab === "content" ? (
            <motion.div
              key="content"
              className="h-full overflow-auto"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {documentContent ? (
                <>
                  {/* Summary Section */}
                  {documentSummary && (
                    <motion.div
                      className="w-full bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 overflow-auto mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800">
                        <div className="flex items-center text-sm font-medium">
                          <BookOpen className="h-4 w-4 mr-1.5 text-indigo-500 dark:text-indigo-400" />
                          Document Summary
                        </div>
                        <motion.button
                          onClick={() =>
                            setIsSummaryCollapsed(!isSummaryCollapsed)
                          }
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isSummaryCollapsed ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                          )}
                        </motion.button>
                      </div>
                      <AnimatePresence>
                        {!isSummaryCollapsed && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{
                              height: "auto",
                              opacity: 1,
                              transition: {
                                height: { duration: 0.4 },
                                opacity: { duration: 0.3, delay: 0.1 },
                              },
                            }}
                            exit={{
                              height: 0,
                              opacity: 0,
                              transition: {
                                height: { duration: 0.3 },
                                opacity: { duration: 0.2 },
                              },
                            }}
                            className="overflow-hidden"
                          >
                            <div className="whitespace-pre-wrap text-sm p-4 overflow-auto max-h-[30vh] bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200">
                              {documentSummary}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {/* Key Topics Section */}
                  {documentKeyTopics.length > 0 && (
                    <motion.div
                      className="w-full bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 overflow-auto mb-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.4 }}
                    >
                      <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800">
                        <div className="flex items-center text-sm font-medium">
                          <Tag className="h-4 w-4 mr-1.5 text-indigo-500 dark:text-indigo-400" />
                          Key Topics
                        </div>
                        <div className="relative flex items-center">
                          <Search className="absolute left-2 h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
                          <input
                            type="text"
                            placeholder="Filter topics..."
                            value={topicFilter}
                            onChange={(e) => setTopicFilter(e.target.value)}
                            className="py-1 pl-7 pr-2 text-xs rounded border border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-300"
                          />
                        </div>
                      </div>
                      <AnimatePresence>
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                            transition: {
                              height: { duration: 0.4 },
                              opacity: { duration: 0.3, delay: 0.1 },
                            },
                          }}
                          className="overflow-hidden"
                        >
                          <div className="p-4">
                            <div className="flex flex-wrap gap-2">
                              {documentKeyTopics
                                .filter((topic) =>
                                  topic
                                    .toLowerCase()
                                    .includes(topicFilter.toLowerCase()),
                                )
                                .map((topic, index) => (
                                  <motion.span
                                    key={index}
                                    className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full text-xs font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors cursor-pointer"
                                    onClick={() => {
                                      setTopicFilter(topic);
                                    }}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{
                                      opacity: 1,
                                      scale: 1,
                                      transition: {
                                        delay: 0.1 + index * 0.05,
                                        duration: 0.3,
                                      },
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                  >
                                    {topic}
                                  </motion.span>
                                ))}
                              {documentKeyTopics.filter((topic) =>
                                topic
                                  .toLowerCase()
                                  .includes(topicFilter.toLowerCase()),
                              ).length === 0 && (
                                <motion.p
                                  className="text-xs text-gray-500 dark:text-gray-400 py-1"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                >
                                  No topics match your filter
                                </motion.p>
                              )}
                              {topicFilter && (
                                <motion.button
                                  onClick={() => setTopicFilter("")}
                                  className="text-xs text-indigo-500 dark:text-indigo-400 hover:underline ml-2"
                                  initial={{ opacity: 0 }}
                                  animate={{
                                    opacity: 1,
                                    transition: { delay: 0.2 },
                                  }}
                                  whileHover={{ scale: 1.05 }}
                                >
                                  Clear filter
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {/* Document Content Section */}
                  <motion.div
                    className="w-full bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 overflow-auto"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                  >
                    <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800">
                      <div className="flex items-center text-sm font-medium">
                        <FileInput className="h-4 w-4 mr-1.5 text-indigo-500 dark:text-indigo-400" />
                        Document Content
                      </div>
                      <motion.button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isCollapsed ? (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronUp className="h-4 w-4 text-gray-500" />
                        )}
                      </motion.button>
                    </div>
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                            transition: {
                              height: { duration: 0.4 },
                              opacity: { duration: 0.3, delay: 0.1 },
                            },
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                            transition: {
                              height: { duration: 0.3 },
                              opacity: { duration: 0.2 },
                            },
                          }}
                          className="overflow-hidden"
                        >
                          <div className="whitespace-pre-wrap font-mono text-sm p-4 overflow-auto max-h-[60vh] bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200">
                            {documentContent}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  className="flex flex-col items-center justify-center h-full py-12 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                    className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </motion.div>
                  <motion.h3
                    className="text-lg font-medium mb-2"
                    custom={0}
                    variants={itemAnimations}
                    initial="initial"
                    animate="animate"
                  >
                    No content available
                  </motion.h3>
                  <motion.p
                    className="text-gray-500 dark:text-gray-400 max-w-md"
                    custom={1}
                    variants={itemAnimations}
                    initial="initial"
                    animate="animate"
                  >
                    This document does not have any content stored.
                  </motion.p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="details"
              className="h-full overflow-auto"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 p-5 mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <h3 className="text-sm font-medium mb-4">
                  Document Information
                </h3>
                <div className="space-y-4">
                  <motion.div
                    className="flex flex-col"
                    custom={0}
                    variants={itemAnimations}
                    initial="initial"
                    animate="animate"
                  >
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Title
                    </span>
                    <span className="text-sm mt-1">
                      {doc.title || "Untitled Document"}
                    </span>
                  </motion.div>

                  {doc.description && (
                    <motion.div
                      className="flex flex-col"
                      custom={1}
                      variants={itemAnimations}
                      initial="initial"
                      animate="animate"
                    >
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Description
                      </span>
                      <span className="text-sm mt-1">{doc.description}</span>
                    </motion.div>
                  )}

                  <motion.div
                    className="flex flex-col"
                    custom={2}
                    variants={itemAnimations}
                    initial="initial"
                    animate="animate"
                  >
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Created
                    </span>
                    <span className="text-sm mt-1">
                      {new Date(doc.createdAt).toLocaleString()}
                    </span>
                  </motion.div>

                  <motion.div
                    className="flex flex-col"
                    custom={3}
                    variants={itemAnimations}
                    initial="initial"
                    animate="animate"
                  >
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Last Updated
                    </span>
                    <span className="text-sm mt-1">
                      {new Date(doc.updatedAt).toLocaleString()}
                    </span>
                  </motion.div>

                  <motion.div
                    className="flex flex-col"
                    custom={4}
                    variants={itemAnimations}
                    initial="initial"
                    animate="animate"
                  >
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Document Type
                    </span>
                    <span className="text-sm mt-1">
                      {doc.documentType || "Unknown"}
                    </span>
                  </motion.div>

                  <motion.div
                    className="flex flex-col"
                    custom={5}
                    variants={itemAnimations}
                    initial="initial"
                    animate="animate"
                  >
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Source
                    </span>
                    <span className="text-sm mt-1 truncate">
                      {doc.src || "Unknown"}
                    </span>
                  </motion.div>

                  <motion.div
                    className="flex flex-col"
                    custom={6}
                    variants={itemAnimations}
                    initial="initial"
                    animate="animate"
                  >
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Index Status
                    </span>
                    <span className="text-sm mt-1 flex items-center">
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          doc.indexed ? "bg-green-500" : "bg-yellow-500"
                        }`}
                      ></span>
                      {doc.indexStatus}
                    </span>
                  </motion.div>

                  {documentKeyTopics.length > 0 && (
                    <motion.div
                      className="flex flex-col"
                      custom={7}
                      variants={itemAnimations}
                      initial="initial"
                      animate="animate"
                    >
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Key Topics
                      </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {documentKeyTopics.slice(0, 5).map((topic, index) => (
                          <span
                            key={index}
                            className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 rounded-full text-xs"
                          >
                            {topic}
                          </span>
                        ))}
                        {documentKeyTopics.length > 5 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{documentKeyTopics.length - 5} more
                          </span>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
