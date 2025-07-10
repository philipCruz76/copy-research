import { create } from "zustand";

type OpenFileUploadModal = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  documentLimit: boolean;
  documentLimitMessage: string;
  setDocumentLimit: (documentLimit: boolean) => void;
  setDocumentLimitMessage: (documentLimitMessage: string) => void;
};

export const useFileUploadModal = create<OpenFileUploadModal>((set) => ({
  isOpen: false,
  documentLimit: false,
  documentLimitMessage: "",
  setIsOpen: (isOpen) => set({ isOpen }),
  setDocumentLimit: (documentLimit) => set({ documentLimit }),
  setDocumentLimitMessage: (documentLimitMessage) =>
    set({ documentLimitMessage }),
}));
