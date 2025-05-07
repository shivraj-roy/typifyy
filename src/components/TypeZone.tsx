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

      // Ensure the current word exists
      const currentWordRef = wordSpanRef[onWordIndex]?.current;
      if (!currentWordRef) {
         console.error("Current word reference is undefined");
         return;
      }

      const currentWord = currentWordRef.childNodes as NodeListOf<HTMLElement>;

      // Only get currentChar if within bounds
      let currentChar: string | null = null;
      if (onCharIndex < currentWord.length) {
         currentChar = currentWord[onCharIndex].innerText;
      }

      // Handle space key (move to the next word)
      if (e.key === " " || e.keyCode === 32) {
         e.preventDefault(); // Prevent the default space behavior

         if (currentWord.length <= onCharIndex) {
            currentWord[onCharIndex - 1].classList.remove("caret_end");
         } else {
            currentWord[onCharIndex].classList.remove("caret");
         }

         if (onWordIndex + 1 < words.length) {
            const nextWordFirstChild = wordSpanRef[onWordIndex + 1].current
               ?.childNodes[0] as HTMLElement;
            if (nextWordFirstChild) {
               nextWordFirstChild.className = "caret";
            }
            setOnWordIndex((prev) => prev + 1);
            setOnCharIndex(0);
         }
         return;
      }

      // Check if the character is correct
      if (currentChar && e.key === currentChar) {
         console.log("correct");
         currentWord[onCharIndex].className = "correct";
         setOnCharIndex((prev) => prev + 1);
      } else {
         console.log("incorrect");
         if (currentChar) {
            currentWord[onCharIndex].className = "incorrect";
         }
         setOnCharIndex((prev) => prev + 1);
      }

      // Handle caret movement
      if (currentWord[onCharIndex + 1]) {
         currentWord[onCharIndex + 1].className = "caret";
      } else if (onCharIndex === currentWord.length - 1) {
         currentWord[onCharIndex].className += " caret_end";
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
