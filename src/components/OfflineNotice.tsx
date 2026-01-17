import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";
import { Bounce, toast } from "react-toastify";
import CustomToast from "./ui/CustomToast";

const OfflineNotice = () => {
   const [isOffline, setIsOffline] = useState(!navigator.onLine);
   const [isDismissed, setIsDismissed] = useState(false);
   const [showNotice, setShowNotice] = useState(false);

   useEffect(() => {
      let showTimer: NodeJS.Timeout;
      let hideTimer: NodeJS.Timeout;

      const handleOnline = () => {
         // Delay hiding the notice for smooth transition
         hideTimer = setTimeout(() => {
            setShowNotice(false);
         }, 300);

         setTimeout(() => {
            setIsOffline(false);
            setIsDismissed(false);

            // Show toast when back online
            toast(
               <CustomToast
                  type="success"
                  title="Connection"
                  message="You are back online"
               />,
               {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: false,
                  transition: Bounce,
               },
            );
         }, 600);
      };

      const handleOffline = () => {
         setIsOffline(true);
         setIsDismissed(false);

         // Delay showing the notice for smooth transition
         showTimer = setTimeout(() => {
            setShowNotice(true);
         }, 300);
      };

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // Set initial show state if already offline
      if (!navigator.onLine) {
         showTimer = setTimeout(() => {
            setShowNotice(true);
         }, 300);
      }

      return () => {
         window.removeEventListener("online", handleOnline);
         window.removeEventListener("offline", handleOffline);
         clearTimeout(showTimer);
         clearTimeout(hideTimer);
      };
   }, []);

   const handleDismiss = () => {
      setShowNotice(false);
      setTimeout(() => {
         setIsDismissed(true);
      }, 300);
   };

   const announcementContainer = document.getElementById("announcement");

   if (!isOffline || isDismissed || !announcementContainer) {
      return null;
   }

   return createPortal(
      <div
         className={`fixed top-14 md:top-3 left-1/2 -translate-x-1/2 z-[100] bg-secondary text-primary flex items-center gap-2 md:gap-3 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-full shadow-lg transition-all duration-300 ease-in-out ${
            showNotice
               ? "opacity-100 translate-y-0"
               : "opacity-0 -translate-y-full"
         }`}
      >
         <FaExclamationTriangle
            className="text-primary flex-shrink-0"
            size={12}
         />
         <span className="whitespace-nowrap">No internet connection</span>
         <button
            onClick={handleDismiss}
            className="ml-1 md:ml-2 text-primary hover:text-accent transition-colors flex-shrink-0"
            aria-label="Dismiss notification"
         >
            <FaTimes size={14} />
         </button>
      </div>,
      announcementContainer,
   );
};

export default OfflineNotice;
