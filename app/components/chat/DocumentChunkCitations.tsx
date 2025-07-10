"use client";

import { getDocumentByChunkId } from "@/app/lib/actions/getDocumentByChunkId";
import { useCitationsSidebarStore } from "@/app/lib/stores/citations-sidebar-store";
import { Citation, CitedResponse } from "@/app/lib/types/citations.types";
import { useCallback } from "react";
import { toast } from "sonner";

type DocumentChunkCitationsProps = {
  index: number;
  messageWithCitations: CitedResponse;
  chunkId: string;
};
const DocumentChunkCitations = ({
  index,
  messageWithCitations,
  chunkId,
}: DocumentChunkCitationsProps) => {
  const { citations, setIsOpen, setCitations, setIsLoading, setCitedDocument } =
    useCitationsSidebarStore();
  const areCitationsEqual = useCallback(
    (citations1: Citation[], citations2: Citation[]) => {
      console.log("citations1", citations1);
      console.log("citations2", citations2);
      if (citations1.length !== citations2.length) return false;
      return citations1.every(
        (citation, index) =>
          citation.chunkId === citations2[index].chunkId &&
          citation.relevantText === citations2[index].relevantText &&
          citation.position === citations2[index].position,
      );
    },
    [],
  );

  const retriveCitationInfo = async (chunkId: string) => {
    try {
      setIsLoading(true);

      const document = await getDocumentByChunkId(chunkId);
      if (!document) {
        toast.error("Document not found");
        return;
      }
      setCitedDocument(document);

      setIsLoading(false);
    } catch (error) {
      console.error("Error retriving citation info:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <button
      key={`citation-${index}`}
      className="p-[2px] text-sm cursor-pointer rounded-md text-blue-500 hover:text-blue-900 hover:bg-blue-200 ml-2"
      onClick={() => {
        if (!areCitationsEqual(messageWithCitations.citations, citations)) {
          setCitations(messageWithCitations.citations);
          retriveCitationInfo(chunkId);
        }
        setIsOpen(true);
      }}
    >
      [{index + 1}]
    </button>
  );
};

export default DocumentChunkCitations;
