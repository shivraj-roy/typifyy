import { useTestMode } from "../context/TestMode";
import { StatsProps } from "../types";
import Graph from "./Graph";

const Stats = ({
   raw,
   wpm,
   accuracy,
   correctChar,
   incorrectChar,
   missedChar,
   extraChar,
   correctWord,
   consistency,
   graphData,
   mode,
   testWords,
   isAfk,
}: StatsProps) => {
   const testModeContext = useTestMode();
   const testTime = testModeContext?.testTime || 30;

   return (
      <>
         <div className="max-w-full h-full text-fade-100 cursor-default">
            <div className="stats-box flex justify-between h-[80%]">
               <div className="left-stats w-[10%] h-full flex flex-col justify-center items-center gap-2">
                  <div className="stat flex flex-col justify-center items-baseline w-full">
                     <h3 className="text-3xl lowercase">WPM</h3>
                     <p className="text-7xl text-active">{wpm}</p>
                  </div>
                  <div className="stat flex flex-col justify-center items-baseline w-full">
                     <h3 className="text-3xl lowercase">Acc</h3>
                     <p className="text-7xl text-active">{accuracy}%</p>
                  </div>
               </div>
               <div className="right-stats w-[90%] h-full">
                  <Graph graphData={graphData} />
               </div>
            </div>
            <div className="flex justify-between items-center h-[20%] mt-1">
               <div>
                  <h3 className="text-xs lowercase">Test Type</h3>
                  <p className="text-xl text-active">
                     {mode === "words"
                        ? `words ${testWords}`
                        : `time ${testTime}s`}
                  </p>
               </div>
               {isAfk && (
                  <div>
                     <h3 className="text-xs lowercase">other</h3>
                     <p className="text-xl text-active">afk detected</p>
                  </div>
               )}
               <div>
                  <h3 className="text-xs">raw</h3>
                  <p className="text-3xl text-active">{raw}</p>
               </div>
               <div>
                  <h3 className="text-xs">Words</h3>
                  <p className="text-3xl text-active">{correctWord}</p>
               </div>
               <div className="relative group cursor-pointer">
                  <h3 className="text-xs">Characters</h3>
                  <p className="text-3xl text-active">
                     {correctChar}/{incorrectChar}/{missedChar}/{extraChar}
                  </p>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-dark text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     Correct: {correctChar}, Incorrect: {incorrectChar}, Missed:{" "}
                     {missedChar}, Extra: {extraChar}
                  </div>
               </div>
               <div>
                  <h3 className="text-xs">Consistency</h3>
                  <p className="text-3xl text-active">{consistency}%</p>
               </div>
            </div>
         </div>
      </>
   );
};
export default Stats;
