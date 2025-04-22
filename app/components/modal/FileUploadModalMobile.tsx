"use client";

import { useFileUploadModal } from "@/app/lib/stores/file-upload";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/app/lib/ui/drawer";
import { Input } from "@/app/lib/ui/Input";
import { useRef } from "react";

const FileUploadModalMobile = () => {
  const { isOpen, setIsOpen } = useFileUploadModal();
  const drawerRef = useRef<HTMLDivElement>(null);

  return (
    <Drawer
      open={isOpen}
      dismissible
      onOpenChange={(open) => setIsOpen(open)}
      fixed
    >
      <DrawerContent
        ref={drawerRef}
        autoFocus
        className="absolute left-0 top-[-14dvh] flex min-h-[100dvh] w-[100dvw] grow px-4 focus:outline-none"
      >
        {/* Close Button*/}
        <div className="flex items-center justify-start">
          <button
            className="h-[44px] w-[44px] relative  rounded-md p-0 left-2"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6 stroke-black dark:stroke-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <DrawerHeader>
          <DrawerTitle>Upload File</DrawerTitle>
          <DrawerDescription>
            Upload a document for the research assistant.
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label>Document</label>
            <Input type="file" />
            <button>Upload</button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default FileUploadModalMobile;
