"use client";

import { FileText, Calendar, ArrowRight, Upload } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Document, DocumentData } from "@prisma/client";
import DocumentDataComponent from "../components/documents/DocumentData";

type DocumentWithData = Document & { documentData: DocumentData["data"] };
export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentWithData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(
    null,
  );

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
    setSelectedDocumentId(
      documentId === selectedDocumentId ? null : documentId,
    );
  };

  const selectedDocument = documents.find(
    (doc) => doc.id === selectedDocumentId,
  );

  return (
    <div className="flex flex-col h-full bg-white dark:bg-zinc-900 text-black dark:text-white p-6">
      <header className="flex justify-between items-center mb-6">
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
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center flex-1">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      ) : !documents || documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
          <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800">
            <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No documents yet</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
            Upload documents to train your AI assistant with your content.
          </p>
          <Link
            href={"/add-documents"}
            className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Upload Document
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {selectedDocumentId && (
            <AnimatePresence>
              <DocumentDataComponent
                document={selectedDocument}
                onClose={() => setSelectedDocumentId(null)}
              />
            </AnimatePresence>
          )}

          {documents.map((document) => (
            <div key={document.id}>
              <button
                onClick={() => handleDocumentClick(document.id)}
                className="w-full text-left block p-4 rounded-lg border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
                aria-expanded={selectedDocumentId === document.id}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 items-start">
                    <div className="p-2 bg-gray-100 dark:bg-zinc-800 rounded">
                      <FileText className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {document.title || "Untitled Document"}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mr-4">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(document.createdAt).toLocaleDateString()}
                    </div>
                    <ArrowRight
                      className="h-4 w-4 text-gray-400"
                      transform={
                        selectedDocumentId === document.id
                          ? "rotate(90)"
                          : "rotate(0)"
                      }
                    />
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
