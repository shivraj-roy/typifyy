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
   return (
      <>
         <div className="stats-box flex justify-between w-full h-full">
            <div className="left-stats text-fade-100 w-1/5 h-full flex flex-col justify-center items-center gap-3">
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
      </>
   );
};
export default Stats;
