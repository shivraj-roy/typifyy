import { useTestMode } from "../context/TestMode";
import { StatsProps } from "../types";

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
}: StatsProps) => {
   const { testTime } = useTestMode() as { testTime: number };

   return (
      <>
         <div className="max-w-full h-full text-fade-100 cursor-default">
            <div className="stats-box flex justify-between h-[80%]">
               <div className="left-stats w-1/6 h-full flex flex-col justify-center items-center gap-2">
                  <div className="stat flex flex-col justify-center items-baseline w-full">
                     <h3 className="text-3xl lowercase">WPM</h3>
                     <p className="text-7xl text-active">{wpm}</p>
                  </div>
                  <div className="stat flex flex-col justify-center items-baseline w-full">
                     <h3 className="text-3xl lowercase">Acc</h3>
                     <p className="text-7xl text-active">{accuracy}%</p>
                  </div>
               </div>
               <div className="right-stats w-5/6 h-full bg-dark-100"></div>
            </div>
            <div className="flex justify-between items-center h-[20%] mt-1">
               <div>
                  <h3 className="text-xs lowercase">Test Type</h3>
                  <p className="text-xl text-active">time {testTime}s</p>
               </div>
               <div>
                  <h3 className="text-xs">net wpm</h3>
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
