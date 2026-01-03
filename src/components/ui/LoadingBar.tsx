import { useEffect, useState } from "react";

interface LoadingBarProps {
   initialMessage?: string;
}

const LoadingBar = ({ initialMessage = "Loading..." }: LoadingBarProps) => {
   const [progress, setProgress] = useState(0);
   const [message, setMessage] = useState(initialMessage);

   useEffect(() => {
      // Animate progress bar from 0 to 100%
      const interval = setInterval(() => {
         setProgress((prev) => {
            const next = prev + Math.random() * 8;
            if (next >= 100) {
               clearInterval(interval);
               return 100;
            }
            return next;
         });
      }, 150);

      return () => clearInterval(interval);
   }, []);

   // Update message based on progress
   useEffect(() => {
      if (progress >= 100) {
         setMessage("Done");
      } else if (progress >= 75) {
         setMessage("Loading results...");
      } else if (progress >= 50) {
         setMessage("Almost there...");
      } else {
         setMessage(initialMessage);
      }
   }, [progress, initialMessage]);

   return (
      <div className="flex items-center justify-center w-full h-full">
         <div className="flex flex-col items-center gap-6">
            {/* Progress bar container */}
            <div className="w-48 md:w-80 h-2.5 bg-alt-bg rounded-full overflow-hidden">
               {/* Animated progress bar */}
               <div
                  className="h-full bg-active rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
               />
            </div>

            {/* Loading message */}
            <p
               className={`text-sm md:text-lg font-mono tracking-wide transition-all duration-300 ${
                  progress >= 100
                     ? "text-accent font-semibold"
                     : "text-primary animate-pulse"
               }`}
            >
               {message}
            </p>
         </div>
      </div>
   );
};

export default LoadingBar;
