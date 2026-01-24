import { useState, useEffect } from "react";

/**
 * Custom hook to detect if the current viewport is mobile-sized
 * @param breakpoint - The breakpoint in pixels (default: 768px for md breakpoint)
 * @returns boolean indicating if viewport width is below the breakpoint
 */
export const useIsMobile = (breakpoint: number = 768): boolean => {
   const [isMobile, setIsMobile] = useState(false);

   useEffect(() => {
      setIsMobile(window.innerWidth < breakpoint);
      const handleResize = () => {
         setIsMobile(window.innerWidth < breakpoint);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
   }, [breakpoint]);

   return isMobile;
};
