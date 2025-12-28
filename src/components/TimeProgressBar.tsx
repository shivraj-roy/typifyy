interface TimeProgressBarProps {
   mode: "time" | "words";
   counter: number;
   testTime: number;
   completedWords: number;
   testWords: number;
   testStart: boolean;
   testEnd: boolean;
}

const TimeProgressBar = ({
   mode,
   counter,
   testTime,
   completedWords,
   testWords,
   testStart,
   testEnd,
}: TimeProgressBarProps) => {
   // Don't show if test hasn't started or has ended
   if (!testStart || testEnd) return null;

   // Calculate progress percentage
   const getProgress = () => {
      if (mode === "time") {
         // For time mode: starts at 100%, decreases to 0%
         return (counter / testTime) * 100;
      } else {
         // For words mode: starts at 0%, increases to 100%
         return (completedWords / testWords) * 100;
      }
   };

   const progress = getProgress();

   return (
      <div
         className="fixed top-0 left-0 right-0 h-1 bg-dark-100/40 z-50"
         style={{
            width: "100%",
         }}
      >
         <div
            className="h-full bg-active transition-all duration-1000 ease-linear"
            style={{
               width: `${progress}%`,
            }}
         />
      </div>
   );
};

export default TimeProgressBar;
