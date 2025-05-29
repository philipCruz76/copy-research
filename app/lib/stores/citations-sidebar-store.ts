import { create } from "zustand";
import { DocumentWithData } from "../types/documentUpload.types";
import { Citation } from "../types/citations.types";
type CitationsSidebarState = {
  isOpen: boolean;
  documentId: string | null;
  citedDocument: DocumentWithData | null;
  citations: Citation[];
  isLoading: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setDocumentId: (documentId: string) => void;
  setCitedDocument: (citedDocument: DocumentWithData) => void;
  setCitations: (citations: Citation[]) => void;
  setIsLoading: (isLoading: boolean) => void;
};

export const useCitationsSidebarStore = create<CitationsSidebarState>()(
  (set) => ({
    isOpen: false,
    documentId: null,
    citedDocument: null,
    citations: [],
    isLoading: false,
    setIsOpen: (isOpen: boolean) => set({ isOpen }),
    setDocumentId: (documentId: string) => set({ documentId }),
    setCitedDocument: (citedDocument: DocumentWithData) =>
      set({ citedDocument }),
    setCitations: (citations: Citation[]) => set({ citations }),
    setIsLoading: (isLoading: boolean) => set({ isLoading }),
  }),
);
