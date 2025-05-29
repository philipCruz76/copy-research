import { create } from "zustand";

type OpenFileUploadModal = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const useFileUploadModal = create<OpenFileUploadModal>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));
