"use client";

import { handleFileUpload } from "@/app/lib/actions/document-actions";
import { useFileUploadModal } from "@/app/lib/stores/file-upload";
import { Dialog, DialogContent, DialogTitle } from "@/app/lib/ui/dialog";
import { Input } from "@/app/lib/ui/Input";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FileUploadType,
  FileUploadValidator,
} from "@/app/lib/types/documentUpload.types";
import { cn } from "@/app/lib/utils";

const acceptedTypes = [
  "text/plain",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const FileUploadModalDesktop = () => {
  const { isOpen, setIsOpen } = useFileUploadModal();
  const [isLoading, setIsLoading] = useState(false);
  const {
    formState: { isValid },
    handleSubmit,
    register,
    setValue,
    trigger,
  } = useForm<FileUploadType>({
    mode: "onChange",
    resolver: zodResolver(FileUploadValidator),
  });

  const fileUploadHandler: SubmitHandler<FileUploadType> = async (
    data: FileUploadType,
  ) => {
    try {
      setIsLoading(true);
      const result = await handleFileUpload(data.file, data.title);
      if (result.success) {
        toast.success(result.message);
        setIsOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload document");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} modal onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent className="flex flex-col fixed min-w-[500px] min-h-[400px] z-50 overflow-y-auto">
        <DialogTitle>Upload File</DialogTitle>

        <form
          className="pt-8 flex flex-col gap-4 items-center justify-center h-full"
          onSubmit={handleSubmit(fileUploadHandler)}
        >
          <UploadCloud className="h-12 w-12 text-gray-600 dark:text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Upload PDF, DOCX, TXT, or other text-based documents
          </p>

          <div className="w-full space-y-4">
            <Input
              {...register("title")}
              placeholder="Enter a title for your document"
              className="w-full px-4 py-2"
            />

            <button
              type="button"
              onClick={() => document.getElementById("fileUpload")?.click()}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            >
              Choose File
              <Input
                type="file"
                id="fileUpload"
                accept={acceptedTypes.join(",")}
                max={1}
                size={1024 * 1024 * 10} // 10MB max file
                onChange={(e: React.FormEvent<HTMLInputElement>) => {
                  e.preventDefault();
                  const target = e.target as HTMLInputElement & {
                    files: FileList;
                  };
                  if (target.files && target.files.length > 0) {
                    setValue("file", target.files[0]);
                    trigger("file");
                  }
                }}
                style={{ display: "none" }}
              />
            </button>

            <button
              type="submit"
              disabled={!isValid || isLoading}
              className={cn(
                "w-full px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors flex items-center justify-center",
                (!isValid || isLoading) && "opacity-50 cursor-not-allowed",
              )}
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white dark:border-black border-t-transparent dark:border-t-transparent rounded-full animate-spin mr-2" />
              ) : null}
              {isLoading ? "Uploading..." : "Upload Document"}
            </button>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
            Max file size: 10MB
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadModalDesktop;
