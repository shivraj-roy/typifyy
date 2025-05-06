import { generate } from "random-words";
import { useRef, useEffect, useState, createRef, useMemo } from "react";
import { useTestMode } from "../context/TestMode";
import TimeCounter from "./TimeCounter";

const TypeZone = () => {
   const [words, setWords] = useState<string[]>(() => generate(50) as string[]);
   const { testTime } = useTestMode() as { testTime: number };
   const [counter, setCounter] = useState<number>(testTime);
   const [onWordIndex, setOnWordIndex] = useState(0);
   const [onCharIndex, setOnCharIndex] = useState(0);

   const inputRef = useRef<HTMLInputElement>(null);

   // * Reference for each word span element in the DOM...
   const wordSpanRef = useMemo(() => {
      return Array(words.length)
         .fill(0)
         .map(() => createRef<HTMLSpanElement>());
   }, [words]);

   // * Focus the input when the component mounts...
   const focusInput = () => {
      inputRef.current?.focus();
   };

   useEffect(() => {
      focusInput();
      console.log("focused");
      const firstChild = wordSpanRef[0].current?.childNodes[0] as HTMLElement;
      if (firstChild) {
         firstChild.className = " caret ";
      }
   }, []);

   // * Handles user input...
   const handleUserInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
      console.log(e.key);
      const currentWord = wordSpanRef[onWordIndex].current
         ?.childNodes as NodeListOf<HTMLElement>;
      const currentChar = currentWord[onCharIndex].innerText;

      if (e.key === currentChar) {
         console.log("correct");
         currentWord[onCharIndex].className = "correct";
         // setOnCharIndex((prev) => prev + 1);
      } else {
         console.log("incorrect");
         currentWord[onCharIndex].className = "incorrect";
         // setOnCharIndex((prev) => prev + 1);
      }
   };

   // * Reset the counter when the test time changes...
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
            <div className="text-3xl flex flex-wrap leading-12 tracking-tight relative text-fade-100">
               {/* <div className="absolute top-3 left-1 caret w-1 h-9 bg-active rounded-2xl animate-blinking" /> */}
               {words.map((word, wordIndex) => (
                  <span
                     key={`${wordIndex}-${word}`}
                     className="my-[0.3rem] mx-2"
                     ref={wordSpanRef[wordIndex]}
                  >
                     {word.split("").map((letter, letterIndex) => (
                        <span
                           key={`${letterIndex}-${wordIndex}`}
                           // className="caret"
                        >
                           {letter}
                        </span>
                     ))}
                  </span>
               ))}
            </div>
            <input
               type="text"
               className="opacity-0 pointer-events-none absolute"
               onKeyDown={handleUserInput}
               ref={inputRef}
            />
         </div>
      </>
   );
};
export default TypeZone;
