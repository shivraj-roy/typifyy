import { generate } from "random-words";
import { useRef, useEffect, useState, createRef, useMemo } from "react";
import { useTestMode } from "../context/TestMode";
import TimeCounter from "./TimeCounter";

const TypeZone = () => {
   const [words, setWords] = useState<string[]>(() => generate(50) as string[]);
   const { testTime } = useTestMode() as { testTime: number }; // Ensure the type matches your context
   const [counter, setCounter] = useState<number>(testTime);

   const inputRef = useRef<HTMLInputElement>(null);

   const wordSpanRef = useMemo(() => {
      return Array(words.length)
         .fill(0)
         .map(() => createRef<HTMLSpanElement>());
   }, [words]);

   console.log(wordSpanRef);

   const handleUserInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
      console.log(e.key);
   };

   const focusInput = () => {
      inputRef.current?.focus();
   };

   useEffect(() => {
      focusInput();
   }, []);

   useEffect(() => {
      setCounter(testTime);
   }, [testTime]);

   return (
      <>
         <div
            className="max-w-full mx-auto overflow-hidden self-start  mb-16"
            onClick={focusInput}
         >
            <TimeCounter countDown={counter} />
            <div className="text-3xl flex flex-wrap leading-12 tracking-wide">
               {words.map((word, wordIndex) => (
                  <span
                     key={`${wordIndex}-${word}`}
                     className="my-[0.3rem] mx-2"
                     ref={wordSpanRef[wordIndex]}
                  >
                     {word.split("").map((letter, letterIndex) => (
                        <span key={`${letterIndex}-${wordIndex}`}>
                           {letter}
                        </span>
                     ))}
                  </span>
               ))}
            </div>
            <input
               type="text"
               className="hidden"
               onKeyDown={handleUserInput}
               ref={inputRef}
            />
         </div>
      </>
   );
};
export default TypeZone;
