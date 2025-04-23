"use client";

import {
  documentLimitCheck,
  handleFileUpload,
} from "@/app/lib/actions/document-actions";
import { useFileUploadModal } from "@/app/lib/stores/file-upload";
import { Dialog, DialogContent, DialogTitle } from "@/app/lib/ui/dialog";
import { Input } from "@/app/lib/ui/Input";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";

const acceptedTypes = [
  "text/plain",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const FileUploadModalDesktop = () => {
  const { isOpen, setIsOpen } = useFileUploadModal();

  const processFile = async (file: File) => {
    try {
      const result = await handleFileUpload(file);
      if (result.success) {
        toast.success(result.message);
        setIsOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload document");
    }
  };

  return (
    <Dialog open={isOpen} modal onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent className="flex flex-col fixed min-w-[500px] min-h-[300px]  z-50 overflow-y-auto">
        <DialogTitle>Upload File</DialogTitle>
        <div className="pt-12 flex flex-col gap-4 items-center justify-center h-full">
          <UploadCloud className="h-12 w-12 text-gray-600 dark:text-gray-400" />
          <p className="text-gray-500 flex-wrap dark:text-gray-400 mb-4">
            Upload PDF, DOCX, TXT, or other text-based documents
          </p>
          <button
            type="button"
            onClick={() => {
              document.getElementById("fileUpload")?.click();
            }}
            className="w-full px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
          >
            Choose Files
            <Input
              type="file"
              id="fileUpload"
              accept={acceptedTypes.join(",")}
              max={1}
              onChange={(e: React.FormEvent<HTMLInputElement>) => {
                e.preventDefault();
                const target = e.target as HTMLInputElement & {
                  files: FileList;
                };
                processFile(target.files[0]);
              }}
              style={{ display: "none" }}
            />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadModalDesktop;
