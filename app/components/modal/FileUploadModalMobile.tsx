"use client";

import { handleFileUpload } from "@/app/lib/actions/document-actions";
import { useFileUploadModal } from "@/app/lib/stores/file-upload";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/app/lib/ui/drawer";
import { Input } from "@/app/lib/ui/Input";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { useRef, useState } from "react";
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

const FileUploadModalMobile = () => {
  const { isOpen, setIsOpen } = useFileUploadModal();
  const drawerRef = useRef<HTMLDivElement>(null);
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
    <Drawer
      open={isOpen}
      dismissible
      onOpenChange={(open) => setIsOpen(open)}
      shouldScaleBackground
      closeThreshold={0.4}
    >
      <DrawerContent
        ref={drawerRef}
        className="bg-white dark:bg-zinc-900 rounded-t-xl border-t border-gray-100 dark:border-zinc-700 min-h-[50vh] max-h-[94vh] focus:outline-none"
      >
        <div className="absolute right-4 top-4">
          <button
            className="h-9 w-9 rounded-full flex items-center justify-center bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
            data-vaul-no-drag
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <DrawerHeader className="px-4 pt-6 pb-0">
          <DrawerTitle className="text-xl font-semibold text-black dark:text-white">
            Upload File
          </DrawerTitle>
          <DrawerDescription className="text-gray-500 dark:text-gray-400 mt-1">
            Upload a document for the research assistant.
          </DrawerDescription>
        </DrawerHeader>

        <form
          className="p-4 flex flex-col gap-6 items-center justify-center flex-1 max-w-sm mx-auto overflow-y-auto"
          data-vaul-no-drag
          onSubmit={handleSubmit(fileUploadHandler)}
        >
          <button
            type="submit"
            disabled={isValid === false}
            className={cn(
              "w-16 h-16 rounded-full border hover:bg-gray-200 hover:scale-105 transition-all duration-300 bg-gray-100 dark:bg-zinc-800 flex items-center justify-center mb-2",
              isValid === false && "opacity-50 cursor-not-allowed",
            )}
          >
            <UploadCloud
              className={cn("h-8 w-8 text-gray-500 dark:text-gray-400")}
            />
          </button>

          <p className="text-gray-500 dark:text-gray-400 text-center text-sm">
            Upload PDF, DOCX, TXT, or other text-based documents
          </p>

          <div className="flex flex-col gap-2 w-full mt-2">
            <Input
              {...register("title")}
              placeholder="Enter a title for your document"
              className="w-full h-12 px-4 py-2 flex items-center justify-center  bg-white text-black rounded-lg  hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
            />
            <button
              type="button"
              onClick={() =>
                document.getElementById("mobileFileUpload")?.click()
              }
              className="w-full h-12 px-4 py-2 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
              data-vaul-no-drag
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white dark:border-black border-t-transparent dark:border-t-transparent rounded-full animate-spin mr-2" />
              ) : null}
              {isLoading ? "Uploading..." : "Choose Files"}
              <Input
                type="file"
                id="mobileFileUpload"
                accept={acceptedTypes.join(",")}
                max={1}
                size={1024 * 1024 * 10} //10MB max file
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
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            Max file size: 10MB
          </p>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default FileUploadModalMobile;
