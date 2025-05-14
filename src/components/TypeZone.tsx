import { generate } from "random-words";
import { useRef, useEffect, useState, createRef, useMemo } from "react";
import { useTestMode } from "../context/TestMode";
import TimeCounter from "./TimeCounter";
import { HiCursorClick } from "react-icons/hi";
import Stats from "./Stats";

const TypeZone = ({
   setTestStart,
   testStart,
}: {
   setTestStart: React.Dispatch<React.SetStateAction<boolean>>;
   testStart: boolean;
}) => {
   const [words, setWords] = useState<string[]>(() => generate(50) as string[]);
   const { testTime } = useTestMode() as { testTime: number };
   const [counter, setCounter] = useState<number>(testTime);
   const [onWordIndex, setOnWordIndex] = useState(0);
   const [onCharIndex, setOnCharIndex] = useState(0);
   // const [testStart, setTestStart] = useState(false);
   const [testEnd, setTestEnd] = useState(false);
   const [isFocused, setIsFocused] = useState(true);
   const [correctChar, setCorrectChar] = useState(0);
   const [incorrectChar, setIncorrectChar] = useState(0);
   const [missedChar, setMissedChar] = useState(0);
   const [extraChar, setExtraChar] = useState(0);
   const [correctWord, setCorrectWord] = useState(0);

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

   // * Handle to start the counter when the test starts...
   const startTimer = () => {
      const timer = setInterval(() => {
         setCounter((prev) => {
            if (prev <= 0) {
               clearInterval(timer);
               setTestEnd(true);
               return 0;
            }
            return prev - 1;
         });
      }, 1000);
      // return timer;
   };

   // * Handles user input...
   const handleUserInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
      console.log(e.key);

      // ? Prevent default behavior for non-character keys
      if (e.keyCode !== 8 && e.key.length > 1) {
         e.preventDefault();
         return;
      }

      // ? Start the test when the user types the first character
      if (!testStart && e.key.length === 1) {
         setTestStart(true);
         startTimer();
      }

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

      // ? Handle space key (move to the next word)
      if (e.key === " " || e.keyCode === 32) {
         e.preventDefault(); // Prevent the default space behavior

         const correctCharInWord = currentWordRef.querySelectorAll(".correct");

         if (correctCharInWord.length === currentWord.length) {
            setCorrectWord((prev) => prev + 1);
         }

         // Add 'incorrect' class if space is pressed in the middle of a word or at the start
         if (onCharIndex < currentWord.length || onCharIndex === 0) {
            for (let i = onCharIndex; i < currentWord.length; i++) {
               currentWord[i].className = "incorrect"; // Mark remaining characters as incorrect
            }
         }

         if (currentWord.length <= onCharIndex) {
            currentWord[onCharIndex - 1].classList.remove("caret_end");
         } else {
            currentWord[onCharIndex].classList.remove("caret");
            setMissedChar((prev) => prev + (currentWord.length - onCharIndex));
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

      // ? Handle backspace key (move to the previous word/character)
      if (e.key === "Backspace" || e.keyCode === 8) {
         e.preventDefault(); // Prevent the default backspace behavior

         if (onCharIndex > 0) {
            if (currentWord.length === onCharIndex) {
               if (currentWord[onCharIndex - 1].className.includes("extra")) {
                  currentWord[onCharIndex - 1].remove();
                  currentWord[onCharIndex - 2].className += " caret_end";
               } else {
                  currentWord[onCharIndex - 1].className = "caret";
               }
               setOnCharIndex((prev) => prev - 1);
               return;
            }
            currentWord[onCharIndex].className = "";
            currentWord[onCharIndex - 1].className = "caret";
            setOnCharIndex((prev) => prev - 1);
         }
         return;
      }

      // ? Handle other extra keys
      if (currentWord.length === onCharIndex) {
         const newSpan = document.createElement("span");
         newSpan.innerText = e.key;
         newSpan.className = "extra-key caret_end extra"; // "extra" className is for key reference for backspace key
         currentWord[onCharIndex - 1].classList.remove("caret_end");
         wordSpanRef[onWordIndex].current?.appendChild(newSpan);
         setOnCharIndex((prev) => prev + 1);
         setExtraChar((prev) => prev + 1);
         return;
      }

      // ? Check if the character is correct
      if (currentChar && e.key === currentChar) {
         console.log("correct");
         currentWord[onCharIndex].className = "correct";
         setOnCharIndex((prev) => prev + 1);
         setCorrectChar((prev) => prev + 1);
      } else {
         console.log("incorrect");
         if (currentChar) {
            currentWord[onCharIndex].className = "incorrect";
            setIncorrectChar((prev) => prev + 1);
         }
         setOnCharIndex((prev) => prev + 1);
      }

      // ? Handle caret movement
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

   // * Calculate WPM
   const calculateWPM = () => {
      const totalTimeInMinutes = testTime / 60;
      const wpm = Math.floor(correctChar / 5 / totalTimeInMinutes);
      return wpm;
   };

   // * Calculate net WPM
   const calculateNetWPM = () => {
      const totalTimeInMinutes = testTime / 60;
      const netWPM = Math.floor(
         (correctChar - incorrectChar) / 5 / totalTimeInMinutes
      );
      return netWPM;
   };

   // * Calculate accuracy
   const calculateAccuracy = () => {
      const totalChars = correctChar + incorrectChar + missedChar + extraChar;
      if (totalChars === 0) return 0;
      const accuracy = Math.floor((correctChar / totalChars) * 100);
      return accuracy;
   };

   // * Calculate consistency
   const calculateConsistency = () => {
      const totalChars = correctChar + incorrectChar + missedChar + extraChar;
      if (totalChars === 0) return 0;
      const consistency = Math.floor(
         ((correctChar - incorrectChar) / totalChars) * 100
      );
      return consistency;
   };

   return (
      <>
         {testEnd ? (
            <h1 className="max-w-full overflow-hidden self-start  mb-16 h-[17rem]">
               <Stats
                  wpm={calculateWPM()}
                  netWPM={calculateNetWPM()}
                  accuracy={calculateAccuracy()}
                  correctChar={correctChar}
                  incorrectChar={incorrectChar}
                  missedChar={missedChar}
                  extraChar={extraChar}
                  correctWord={correctWord}
                  consistency={calculateConsistency()}
               />
            </h1>
         ) : (
            <div
               className="max-w-full mx-auto overflow-hidden self-start  mb-16 h-[17rem]"
               onClick={focusInput}
            >
               <TimeCounter
                  countDown={counter}
                  className={testStart ? "opacity-100" : "opacity-0"}
               />
               <div className="text-3xl flex flex-wrap leading-12 tracking-tight relative text-fade-100">
                  {!isFocused && (
                     <div
                        className="cursor-default absolute top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm z-10 pb-16 "
                        onClick={focusInput}
                     >
                        <span className="flex items-center justify-around text-xl text-fade gap-5 font-mono tracking-wider">
                           <HiCursorClick />
                           Click here to focus
                        </span>
                     </div>
                  )}
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
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
               />
            </div>
         )}
      </>
   );
};
export default TypeZone;
