import { useTestMode } from "../context/TestMode";

const Stats = ({
   wpm,
   accuracy,
   correctChar,
   incorrectChar,
   missedChar,
   extraChar,
   correctWord,
}: {
   wpm: number;
   accuracy: number;
   correctChar: number;
   incorrectChar: number;
   missedChar: number;
   extraChar: number;
   correctWord: number;
}) => {
   const { testTime } = useTestMode() as { testTime: number };

   return (
      <>
         <div className="max-w-full h-full text-fade-100">
            <div className="stats-box flex justify-between h-[80%]">
               <div className="left-stats w-1/5 h-full flex flex-col justify-center items-center gap-3">
                  <div className="stat flex flex-col justify-center items-baseline w-full">
                     <h3 className="text-3xl lowercase">WPM</h3>
                     <p className="text-7xl text-active">{wpm}</p>
                  </div>
                  <div className="stat flex flex-col justify-center items-baseline w-full">
                     <h3 className="text-3xl lowercase">Acc</h3>
                     <p className="text-7xl text-active">{accuracy}%</p>
                  </div>
               </div>
               <div className="right-stats w-4/5 h-full bg-dark-100"></div>
            </div>
            <div className="flex justify-around items-center h-[20%]">
               <div>
                  <h3 className="text-xs">Test Type</h3>
                  <p className="text-xl text-active">time {testTime}s</p>
               </div>
               <div>
                  <h3 className="text-xs">Words</h3>
                  <p className="text-3xl text-active">{correctWord}</p>
               </div>
               <div>
                  <h3 className="text-xs">Characters</h3>
                  <p className="text-3xl text-active">
                     {correctChar}/{incorrectChar}/{missedChar}/{extraChar}
                  </p>
               </div>
            </div>
         </div>
      </>
   );
};
export default Stats;
