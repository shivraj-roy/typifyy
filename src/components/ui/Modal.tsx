import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
   isOpen: boolean;
   onClose: () => void;
   children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
   const dialogRef = useRef<HTMLDialogElement>(null);

   useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      if (isOpen) {
         dialog.showModal();
         // Prevent body scroll when modal is open
         document.body.style.overflow = "hidden";
      } else {
         dialog.close();
         document.body.style.overflow = "unset";
      }

      return () => {
         document.body.style.overflow = "unset";
      };
   }, [isOpen]);

   useEffect(() => {
      const dialog = dialogRef.current;
      if (!dialog) return;

      // Handle Escape key and backdrop click
      const handleClose = (e: Event) => {
         if (e.type === "close" || e.type === "cancel") {
            onClose();
         }
      };

      dialog.addEventListener("close", handleClose);
      dialog.addEventListener("cancel", handleClose);

      return () => {
         dialog.removeEventListener("close", handleClose);
         dialog.removeEventListener("cancel", handleClose);
      };
   }, [onClose]);

   const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
      // Close if clicking directly on the dialog element (the backdrop)
      // Don't close if clicking on dialog children (the content)
      if (e.target === dialogRef.current) {
         onClose();
      }
   };

   // Don't render if not open
   if (!isOpen) return null;

   const popupsContainer = document.getElementById("popups");
   if (!popupsContainer) return null;

   return createPortal(
      <dialog
         ref={dialogRef}
         onClick={handleBackdropClick}
         className="w-full h-full max-w-full max-h-full m-0 bg-[#00000080] fixed left-0 top-0 z-[1000] grid justify-center justify-items-center items-center p-8 border-none backdrop:bg-transparent"
         style={{ gridTemplateColumns: "100%" }}
      >
         {children}
      </dialog>,
      popupsContainer,
   );
};

export default Modal;
