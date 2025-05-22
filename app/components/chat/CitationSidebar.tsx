"use client";

import { useCitationsSidebarStore } from "@/app/lib/stores/citations-sidebar-store";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
} from "@/app/lib/ui/drawer";
import { ScrollArea } from "@/app/lib/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  BookOpen,
  ChevronDown,
  ChevronUp,
  X,
  Tag,
} from "lucide-react";
import { useState } from "react";

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

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

const LoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white dark:bg-zinc-900">
        <div className="p-3 border-b bg-gray-50 dark:bg-zinc-800">
          <div className="h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-zinc-800" />
        </div>
        <div className="p-4 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-zinc-800" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-zinc-800" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200 dark:bg-zinc-800" />
        </div>
      </div>

      <div className="rounded-lg border bg-white dark:bg-zinc-900">
        <div className="p-3 border-b bg-gray-50 dark:bg-zinc-800">
          <div className="h-5 w-24 animate-pulse rounded bg-gray-200 dark:bg-zinc-800" />
        </div>
        <div className="divide-y divide-gray-200 dark:divide-zinc-800">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3">
              <div className="h-4 w-full mb-2 animate-pulse rounded bg-gray-200 dark:bg-zinc-800" />
              <div className="h-3 w-20 animate-pulse rounded bg-gray-200 dark:bg-zinc-800" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const highlightText = (text: string, citations: { relevantText: string }[]) => {
  if (!text || !citations || citations.length === 0) return text;

  let highlightedText = text;
  citations.forEach((citation) => {
    const words = citation.relevantText.trim().split(/\s+/);
    if (words.length <= 1) return;

    const regex = new RegExp(
      citation.relevantText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "g",
    );
    highlightedText = highlightedText.replace(
      regex,
      (match) =>
        `<span class="bg-yellow-200 dark:bg-indigo-700/70">${match}</span>`,
    );
  });

  return highlightedText;
};

const CitationSidebar = () => {
  const { isOpen, setIsOpen, isLoading, citedDocument, citations } =
    useCitationsSidebarStore();

  const [isContentCollapsed, setIsContentCollapsed] = useState(false);
  const [isCitationsCollapsed, setIsCitationsCollapsed] = useState(false);
  const [citationFilter, setCitationFilter] = useState("");

  const documentContent = citedDocument?.documentData[0]?.data || "";
  const highlightedContent = highlightText(documentContent, citations || []);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} direction="left" fixed>
      <DrawerPortal>
        <DrawerOverlay className="fixed inset-0 bg-black/40" />
        <DrawerTitle>Citations</DrawerTitle>
        <DrawerContent className="w-full md:w-[600px] h-full flex flex-col right-0 overflow-clip">
          <div className="flex flex-col h-full bg-white dark:bg-zinc-900">
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
                    {isLoading
                      ? "Loading..."
                      : citedDocument?.title || "Citations"}
                  </motion.h2>
                  {citedDocument?.src && (
                    <motion.p
                      
                      className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-ellipsis overflow-hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.3 }}
                    >
                      Source: <a href={citedDocument.src}
                      target="_blank"
                      rel="noopener noreferrer" className="text-blue-500 hover:text-blue-900">{isLoading ? "Loading..." : citedDocument.src}</a>
                    </motion.p>
                  )}
                </div>
              </div>

              <motion.button
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                onClick={() => setIsOpen(false)}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                aria-label="Close citations view"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </motion.div>

            {/* Content */}
            <ScrollArea className="flex-1">
              <div className="p-6">
                {isLoading ? (
                  <LoadingSkeleton />
                ) : citations && citations.length > 0 ? (
                  <div className="space-y-4">
                    {/* Document Content Section */}
                    <motion.div
                      className="w-full bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 overflow-auto"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800">
                        <div className="flex items-center text-sm font-medium">
                          <BookOpen className="h-4 w-4 mr-1.5 text-indigo-500 dark:text-indigo-400" />
                          Document Content
                        </div>
                        <motion.button
                          onClick={() =>
                            setIsContentCollapsed(!isContentCollapsed)
                          }
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {isContentCollapsed ? (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                          )}
                        </motion.button>
                      </div>
                      <AnimatePresence>
                        {!isContentCollapsed && (
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
                            <div
                              className="whitespace-pre-wrap text-sm p-4 overflow-auto max-h-[40vh] bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-200 prose dark:prose-invert max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: highlightedContent,
                              }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* Citations Section */}
                    <motion.div
                      className="w-full bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 overflow-auto"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35, duration: 0.4 }}
                    >
                      <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800">
                        <div className="flex items-center text-sm font-medium">
                          <Tag className="h-4 w-4 mr-1.5 text-indigo-500 dark:text-indigo-400" />
                          Citations
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            onClick={() =>
                              setIsCitationsCollapsed(!isCitationsCollapsed)
                            }
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isCitationsCollapsed ? (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronUp className="h-4 w-4 text-gray-500" />
                            )}
                          </motion.button>
                        </div>
                      </div>
                      <AnimatePresence>
                        {!isCitationsCollapsed && (
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
                            <div className="divide-y divide-gray-200 dark:divide-zinc-800">
                              {citations.map((citation, index) => (
                                <motion.div
                                  key={index}
                                  className="p-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                                  custom={index}
                                  variants={itemAnimations}
                                  initial="initial"
                                  animate="animate"
                                >
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {citation.relevantText}
                                  </p>
                                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    Chunk ID: {citation.chunkId}
                                  </div>
                                </motion.div>
                              ))}
                              {citations.length === 0 && (
                                <motion.div
                                  className="p-4 text-center"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                >
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {citationFilter
                                      ? "No citations match your filter"
                                      : "No citations available"}
                                  </p>
                                  {citationFilter && (
                                    <motion.button
                                      onClick={() => setCitationFilter("")}
                                      className="text-xs text-indigo-500 dark:text-indigo-400 hover:underline mt-2"
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      Clear filter
                                    </motion.button>
                                  )}
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </div>
                ) : (
                  <motion.div
                    className="flex flex-col items-center justify-center h-32 text-center"
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
                      No citations available
                    </motion.h3>
                    <motion.p
                      className="text-gray-500 dark:text-gray-400 max-w-md"
                      custom={1}
                      variants={itemAnimations}
                      initial="initial"
                      animate="animate"
                    >
                      This document does not have any citations to display.
                    </motion.p>
                  </motion.div>
                )}
              </div>
            </ScrollArea>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
};

export default CitationSidebar;
