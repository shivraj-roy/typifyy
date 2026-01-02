import { useEffect } from "react";

/**
 * Custom hook to set the document title
 * @param title - The page title (will be appended with " | Typifyy")
 */
const useDocumentTitle = (title: string) => {
   useEffect(() => {
      const prevTitle = document.title;
      document.title = title ? `${title} | Typifyy` : "Typifyy | Test Your Typing Speed";

      // Cleanup: restore previous title on unmount (optional)
      return () => {
         document.title = prevTitle;
      };
   }, [title]);
};

export default useDocumentTitle;
