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
         <div>
            <div className="flex text-3xl ml-2 text-active">{wpm} WPM</div>
            <div className="flex text-3xl ml-2 text-active">{accuracy} %</div>
            <div className="flex text-3xl ml-2 text-active">
               {correctChar} correct
            </div>
            <div className="flex text-3xl ml-2 text-active">
               {incorrectChar} incorrect
            </div>
            <div className="flex text-3xl ml-2 text-active">
               {missedChar} missed
            </div>
            <div className="flex text-3xl ml-2 text-active">
               {extraChar} extra
            </div>
            <div className="flex text-3xl ml-2 text-active">
               {correctWord} correct words
            </div>
         </div>
      </>
   );
};
export default Stats;
