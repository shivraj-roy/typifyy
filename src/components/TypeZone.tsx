import { generate } from "random-words";
import { useEffect, useState } from "react";
import { useTestMode } from "../context/TestMode";
import TimeCounter from "./TimeCounter";

const TypeZone = () => {
   const [words, setWords] = useState<string[]>(() => generate(50) as string[]);
   const { testTime } = useTestMode() as { testTime: number }; // Ensure the type matches your context
   const [counter, setCounter] = useState<number>(testTime);

   useEffect(() => {
      setCounter(testTime);
   }, [testTime]);

   return (
      <>
         <div className="max-w-full mx-auto overflow-hidden self-start  mb-16">
            <TimeCounter countDown={counter} />
            <div className="text-3xl flex flex-wrap leading-12 tracking-wide">
               {words.map((word, wordIndex) => (
                  <span
                     key={`${wordIndex}-${word}`}
                     className="my-[0.3rem] mx-2"
                  >
                     {word.split("").map((letter, letterIndex) => (
                        <span key={`${letterIndex}-${wordIndex}`}>
                           {letter}
                        </span>
                     ))}
                  </span>
               ))}
            </div>
         </div>
      </>
   );
};
export default TypeZone;
