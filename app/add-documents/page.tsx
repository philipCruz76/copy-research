import DocumentUpload from "@/app/components/documentUpload/DocumentUpload";
import { checkForDocumentLimit } from "../lib/actions/document-actions";

export default async function AddDocumentsPage() {
  const response = await checkForDocumentLimit();
  console.log(response);
  return (
    <div className="flex flex-col h-full max-w-[100dvw] bg-white dark:bg-zinc-900 text-black dark:text-white p-6">
      <DocumentUpload
        limitReached={!response.success}
        limitMessage={response.message}
      />
    </div>
  );
}
