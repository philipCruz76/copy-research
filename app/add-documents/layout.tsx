import { Suspense } from "react";
import DocumentUploadSkeleton from "@/app/components/documentUpload/DocumentUploadSkeleton";

export default function AddDocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full max-w-[100dvw] bg-white dark:bg-zinc-900 text-black dark:text-white p-6">
      <Suspense fallback={<DocumentUploadSkeleton />}>{children}</Suspense>
    </div>
  );
}
