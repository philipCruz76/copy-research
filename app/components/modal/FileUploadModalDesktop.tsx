import { useFileUploadModal } from "@/app/lib/stores/file-upload";
import { Dialog, DialogContent, DialogTitle } from "@/app/lib/ui/dialog";

const FileUploadModalDesktop = () => {
  const { isOpen, setIsOpen } = useFileUploadModal();

  return (
    <Dialog open={isOpen} modal onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent className="fixed min-w-[500px] min-h-[500px]  z-50 flex overflow-y-auto">
        <DialogTitle>Upload File</DialogTitle>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadModalDesktop;
