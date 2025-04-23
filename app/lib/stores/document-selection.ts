import { create } from "zustand";

type DocumentSelectionStore = {
  selectedDocumentId: string | null;
  setSelectedDocumentId: (id: string | null) => void;
  showDetail: boolean;
  setShowDetail: (show: boolean) => void;
};

export const useDocumentSelection = create<DocumentSelectionStore>((set) => ({
  selectedDocumentId: null,
  showDetail: false,
  setSelectedDocumentId: (id) => set({ selectedDocumentId: id }),

  setShowDetail: (show) => set({ showDetail: show }),
}));
