import DocumentUpload from "@/app/components/documentUpload/DocumentUpload";
import { checkForDocumentLimit } from "../lib/actions/document-actions";
import { auth } from "../lib/auth";
import { redirect } from "next/navigation";

export default async function AddDocumentsPage() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }
  const response = await checkForDocumentLimit(session.user.id!);
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
