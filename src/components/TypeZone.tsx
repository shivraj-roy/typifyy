import { generate } from "random-words";
import {
   useRef,
   useEffect,
   useState,
   createRef,
   useMemo,
   useCallback,
} from "react";
import { Link } from "react-router-dom";
import {
   FaRedoAlt,
   FaChevronRight,
   FaBolt,
   FaBullseye,
   FaLock,
} from "react-icons/fa";
import { useTestMode } from "../context/TestMode";
import { useSettings } from "../context/Settings";
import TimeCounter from "./TimeCounter";
import TimeProgressBar from "./TimeProgressBar";
import { HiCursorClick } from "react-icons/hi";
import Stats from "./Stats";
import MenuBar from "./MenuBar";
import TextButton from "./ui/TextButton";
import CustomToast from "./ui/CustomToast";
import { Bounce, toast } from "react-toastify";
import { auth } from "../firebaseConfig";
import {
   playKeySound,
   preloadSounds,
   playErrorSound,
   playWarningSound,
} from "../utils/soundPlayer";

const TypeZone = ({
   setTestStart,
   testStart,
}: {
   setTestStart: React.Dispatch<React.SetStateAction<boolean>>;
   testStart: boolean;
}) => {
   const testMode = useTestMode();
   const mode = testMode?.mode || "time";
   const testTime = testMode?.testTime || 30;
   const testWords = testMode?.testWords || 25;
   const {
      minSpeedMode,
      minSpeedValue,
      minAccuracyMode,
      minAccuracyValue,
      soundVolume,
      soundMode,
      errorSoundMode,
      timeWarningMode,
      liveProgressMode,
      capsLockWarningMode,
   } = useSettings();

   const [words, setWords] = useState<string[]>(() => {
      const wordCount = mode === "words" ? testWords : 50;
      return generate(wordCount) as string[];
   });
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
   const [completedWords, setCompletedWords] = useState(0);
   const [graphData, setGraphData] = useState<number[][]>([]);
   const [isAfk, setIsAfk] = useState(false);
   const [capsLockOn, setCapsLockOn] = useState(false);
   const [testFailed, setTestFailed] = useState(false);

   const inputRef = useRef<HTMLInputElement>(null);
   const wordsContainerRef = useRef<HTMLDivElement>(null);
   const nextTestBtnRef = useRef<HTMLButtonElement>(null);
   const correctCharRef = useRef<number>(0);
   const incorrectCharRef = useRef<number>(0);
   const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
   const elapsedSecondsRef = useRef<number>(0);
   const lastTypingTimeRef = useRef<number>(Date.now());
   const warningPlayedRef = useRef<boolean>(false);

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

   // * Helper function to check if word has errors and update underline
   const updateWordErrorClass = (wordIndex: number) => {
      const wordRef = wordSpanRef[wordIndex]?.current;
      if (!wordRef) return;

      const chars = wordRef.querySelectorAll("span");
      const hasError = Array.from(chars).some(
         (char) =>
            char.className.includes("incorrect") ||
            char.className.includes("extra")
      );

      if (hasError) {
         wordRef.classList.add("word-error");
      } else {
         wordRef.classList.remove("word-error");
      }
   };

   // * Scroll smoothly when moving to the next line
   const scrollToKeepOnSecondLine = (wordIndex: number) => {
      const container = wordsContainerRef.current;
      const wordElement = wordSpanRef[wordIndex]?.current;

      if (!container || !wordElement) return;

      const lineHeight = 48; // 3rem = 48px
      const wordTop = wordElement.offsetTop;
      const currentLine = Math.floor(wordTop / lineHeight);

      // If current word is on line 2 or beyond (0-indexed), scroll up
      if (currentLine >= 2) {
         const scrollAmount = (currentLine - 1) * lineHeight;
         container.scrollTo({
            top: scrollAmount,
            behavior: "smooth",
         });
      }
   };

   useEffect(() => {
      focusInput();
      console.log("focused");
      const firstChild = wordSpanRef[0].current?.childNodes[0] as HTMLElement;
      if (firstChild) {
         firstChild.className = " caret ";
      }
   }, []);

   // * Keep correctCharRef in sync with correctChar state
   useEffect(() => {
      correctCharRef.current = correctChar;
   }, [correctChar]);

   // * Keep incorrectCharRef in sync with incorrectChar state
   useEffect(() => {
      incorrectCharRef.current = incorrectChar;
   }, [incorrectChar]);

   // * Hide caret when focus is lost, show when focused
   useEffect(() => {
      if (!isFocused && !testEnd) {
         // Remove caret classes when unfocused
         const allSpans = document.querySelectorAll(".caret, .caret_end");
         allSpans.forEach((span) => {
            span.classList.remove("caret", "caret_end");
         });
      } else if (isFocused && !testEnd) {
         // Restore caret when focused
         const currentWordRef = wordSpanRef[onWordIndex]?.current;
         if (currentWordRef) {
            const currentWord =
               currentWordRef.childNodes as NodeListOf<HTMLElement>;
            if (onCharIndex < currentWord.length) {
               currentWord[onCharIndex].classList.add("caret");
            } else if (onCharIndex > 0 && onCharIndex === currentWord.length) {
               currentWord[onCharIndex - 1].classList.add("caret_end");
            }
         }
      }
   }, [isFocused, testEnd, onWordIndex, onCharIndex, wordSpanRef]);

   // * Preload sounds when sound mode changes
   useEffect(() => {
      if (soundMode !== "off") {
         preloadSounds(soundMode);
      }
   }, [soundMode]);

   // * Handle to start the counter when the test starts...
   const startTimer = () => {
      if (!timerRef.current) {
         elapsedSecondsRef.current = 0;

         const timer = setInterval(() => {
            elapsedSecondsRef.current += 1;

            if (mode === "time") {
               setCounter((prev) => {
                  if (prev <= 0) {
                     clearInterval(timer);
                     timerRef.current = null;
                     setTestEnd(true);
                     return 0;
                  }

                  // Play time warning sound if enabled and threshold reached
                  if (timeWarningMode !== "off" && !warningPlayedRef.current) {
                     const warningThreshold = parseInt(timeWarningMode);
                     if (prev === warningThreshold) {
                        playWarningSound(soundVolume);
                        warningPlayedRef.current = true;
                     }
                  }

                  const timeElapsed = testTime - prev + 1;
                  const currentCorrectChars = correctCharRef.current;
                  const currentIncorrectChars = incorrectCharRef.current;

                  // Calculate raw WPM and WPM
                  const rawWPM = Math.max(
                     0,
                     Math.floor(currentCorrectChars / 5 / (timeElapsed / 60))
                  );
                  const WPM = Math.max(
                     0,
                     Math.floor(
                        (currentCorrectChars - currentIncorrectChars) /
                           5 /
                           (timeElapsed / 60)
                     )
                  );

                  // Add data point for current second (starting from 1s)
                  setGraphData((prevData) => {
                     const lastEntry = prevData[prevData.length - 1];
                     const newDataPoint = [timeElapsed, rawWPM, WPM];
                     if (lastEntry && lastEntry[0] === timeElapsed) {
                        return [...prevData.slice(0, -1), newDataPoint];
                     }
                     return [...prevData, newDataPoint];
                  });

                  return prev - 1;
               });
            } else if (mode === "words") {
               // For words mode, track elapsed time
               const timeElapsed = elapsedSecondsRef.current;
               const currentCorrectChars = correctCharRef.current;
               const currentIncorrectChars = incorrectCharRef.current;

               // Calculate raw WPM and WPM based on elapsed time
               const rawWPM = Math.max(
                  0,
                  Math.floor(currentCorrectChars / 5 / (timeElapsed / 60))
               );
               const WPM = Math.max(
                  0,
                  Math.floor(
                     (currentCorrectChars - currentIncorrectChars) /
                        5 /
                        (timeElapsed / 60)
                  )
               );

               // Add data point for current second
               setGraphData((prevData) => {
                  const lastEntry = prevData[prevData.length - 1];
                  const newDataPoint = [timeElapsed, rawWPM, WPM];
                  if (lastEntry && lastEntry[0] === timeElapsed) {
                     return [...prevData.slice(0, -1), newDataPoint];
                  }
                  return [...prevData, newDataPoint];
               });
            }
         }, 1000);

         timerRef.current = timer;
      }
   };

   // * Handles user input...
   const handleUserInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
      console.log(e.key);

      // Detect Caps Lock state
      const isCapsLockOn = e.getModifierState("CapsLock");
      setCapsLockOn(isCapsLockOn);

      // Play key sound
      if (soundMode !== "off") {
         const keyCode = e.keyCode || e.which;
         playKeySound(keyCode, soundMode, soundVolume);
      }

      // Update last typing time
      lastTypingTimeRef.current = Date.now();
      setIsAfk(false);

      // ? Allow Tab key to pass through for restart button navigation
      if (e.key === "Tab") {
         return; // Let Tab work normally for button focus
      }

      // ? Prevent default behavior for non-character keys
      if (e.keyCode !== 8 && e.key.length > 1) {
         e.preventDefault();
         return;
      }

      // ? Start the test when the user types the first character (but not space)
      if (!testStart && e.key.length === 1 && e.key !== " ") {
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

         // Ignore space if caret is at the start of the word (no characters typed yet)
         if (onCharIndex === 0) {
            // Play error sound for space pressed too early
            if (errorSoundMode !== "off") {
               playErrorSound(errorSoundMode, soundVolume);
            }
            return;
         }

         const correctCharInWord = currentWordRef.querySelectorAll(".correct");

         if (correctCharInWord.length === currentWord.length) {
            setCorrectWord((prev) => prev + 1);
         }

         // Add 'incorrect' class if space is pressed in the middle of a word or at the start
         if (onCharIndex < currentWord.length || onCharIndex === 0) {
            // Play error sound for space pressed too early (in middle of word)
            if (errorSoundMode !== "off") {
               playErrorSound(errorSoundMode, soundVolume);
            }
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

         // Apply underline if current word has errors
         updateWordErrorClass(onWordIndex);

         if (onWordIndex + 1 < words.length) {
            const nextWordFirstChild = wordSpanRef[onWordIndex + 1].current
               ?.childNodes[0] as HTMLElement;
            if (nextWordFirstChild) {
               nextWordFirstChild.className = "caret";
            }
            setOnWordIndex((prev) => prev + 1);
            setOnCharIndex(0);

            // Scroll to keep current word on second line
            scrollToKeepOnSecondLine(onWordIndex + 1);

            // Increment completed words counter only when moving to next word
            setCompletedWords((prev) => prev + 1);
         } else {
            // Last word completed - end test for words mode
            setCompletedWords((prev) => prev + 1);
            if (mode === "words") {
               if (timerRef.current) {
                  clearInterval(timerRef.current);
                  timerRef.current = null;
               }
               setTestEnd(true);
            }
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
         } else if (onCharIndex === 0 && onWordIndex > 0) {
            // Check if previous word has incorrect characters
            const prevWordRef = wordSpanRef[onWordIndex - 1]?.current;
            if (prevWordRef) {
               const prevWordChars =
                  prevWordRef.childNodes as NodeListOf<HTMLElement>;
               const hasIncorrect = Array.from(prevWordChars).some(
                  (char) =>
                     char.className.includes("incorrect") ||
                     char.className.includes("extra")
               );

               if (hasIncorrect) {
                  // Remove caret from current word
                  currentWord[0].classList.remove("caret");

                  // Move to previous word
                  setOnWordIndex((prev) => prev - 1);

                  // Set char index to end of previous word
                  const newCharIndex = prevWordChars.length;
                  setOnCharIndex(newCharIndex);

                  // Add caret to last character of previous word
                  if (prevWordChars[newCharIndex - 1]) {
                     prevWordChars[newCharIndex - 1].className += " caret_end";
                  }
               }
            }
         }
         return;
      }

      // ? Handle other extra keys
      if (currentWord.length === onCharIndex) {
         // Play error sound for extra characters
         if (errorSoundMode !== "off") {
            playErrorSound(errorSoundMode, soundVolume);
         }
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
         // Play error sound for incorrect character
         if (errorSoundMode !== "off") {
            playErrorSound(errorSoundMode, soundVolume);
         }
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

         // Check if we're on the last word in words mode and just typed the last character
         if (mode === "words" && onWordIndex === words.length - 1) {
            // End the test
            setCompletedWords((prev) => prev + 1);
            if (timerRef.current) {
               clearInterval(timerRef.current);
               timerRef.current = null;
            }
            setTestEnd(true);
         }
      }
   };

   // * Reset the counter when the test time changes...
   useEffect(() => {
      setCounter(testTime);
   }, [testTime]);

   // * Reset words when mode or testWords changes...
   useEffect(() => {
      const wordCount = mode === "words" ? testWords : 50;
      setWords(generate(wordCount) as string[]);
      // Clear existing timer if any
      if (timerRef.current) {
         clearInterval(timerRef.current);
         timerRef.current = null;
      }
      // Reset test state
      setTestEnd(false);
      setOnWordIndex(0);
      setOnCharIndex(0);
      setCorrectChar(0);
      setIncorrectChar(0);
      setMissedChar(0);
      setExtraChar(0);
      setCorrectWord(0);
      setCompletedWords(0);
      setGraphData([]);
      setIsAfk(false);
      setTestFailed(false);
      elapsedSecondsRef.current = 0;
      lastTypingTimeRef.current = Date.now();
      warningPlayedRef.current = false;
   }, [mode, testWords]);

   // * Cleanup timer on unmount
   useEffect(() => {
      return () => {
         if (timerRef.current) {
            clearInterval(timerRef.current);
         }
      };
   }, []);

   // * Check for AFK (5 seconds of inactivity) and auto-end after 30 seconds
   useEffect(() => {
      if (!testStart || testEnd) return;

      const afkCheckInterval = setInterval(() => {
         const timeSinceLastTyping = Date.now() - lastTypingTimeRef.current;

         // Set AFK flag after 5 seconds of inactivity
         if (timeSinceLastTyping >= 5000) {
            setIsAfk(true);
         }

         // Auto-end test after 30 seconds of inactivity (only in word mode)
         if (mode === "words" && timeSinceLastTyping >= 30000) {
            if (timerRef.current) {
               clearInterval(timerRef.current);
               timerRef.current = null;
            }
            setTestFailed(true);
            setTestEnd(true);
         }

         // Auto-end test after 5 minutes maximum time (only in word mode)
         if (mode === "words" && elapsedSecondsRef.current >= 300) {
            if (timerRef.current) {
               clearInterval(timerRef.current);
               timerRef.current = null;
            }
            setTestFailed(true);
            setTestEnd(true);
         }
      }, 1000);

      return () => clearInterval(afkCheckInterval);
   }, [testStart, testEnd, mode]);

   // * Blur active element when test ends so Tab focuses Next Test button first
   useEffect(() => {
      if (testEnd) {
         (document.activeElement as HTMLElement)?.blur();
      }
   }, [testEnd]);

   // * Show error toast when test fails due to inactivity
   useEffect(() => {
      if (testFailed) {
         toast(
            <CustomToast
               type="error"
               title="Test Failed"
               message="Test failed - inactivity detected"
            />,
            {
               position: "top-right",
               autoClose: 3000,
               hideProgressBar: true,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: false,
               transition: Bounce,
            }
         );
      }
   }, [testFailed]);

   // * Calculate raw WPM
   const calculateRAW = () => {
      const timeUsed = mode === "words" ? elapsedSecondsRef.current : testTime;
      const totalTimeInMinutes = timeUsed / 60;
      const wpm = Math.max(0, Math.floor(correctChar / 5 / totalTimeInMinutes));
      return wpm;
   };

   // * Calculate WPM
   const calculateWPM = () => {
      const timeUsed = mode === "words" ? elapsedSecondsRef.current : testTime;
      const totalTimeInMinutes = timeUsed / 60;
      const netWPM = Math.max(
         0,
         Math.floor((correctChar - incorrectChar) / 5 / totalTimeInMinutes)
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
      const consistency = Math.max(
         0,
         Math.floor(((correctChar - incorrectChar) / totalChars) * 100)
      );
      return consistency;
   };

   // * Restart the test
   const restartTest = useCallback(() => {
      // Clear timer
      if (timerRef.current) {
         clearInterval(timerRef.current);
         timerRef.current = null;
      }

      // Generate new words
      const wordCount = mode === "words" ? testWords : 50;
      setWords(generate(wordCount) as string[]);

      // Reset all state
      setCounter(testTime);
      setOnWordIndex(0);
      setOnCharIndex(0);
      setTestStart(false);
      setTestEnd(false);
      setCorrectChar(0);
      setIncorrectChar(0);
      setMissedChar(0);
      setExtraChar(0);
      setCorrectWord(0);
      setCompletedWords(0);
      setGraphData([]);
      setIsAfk(false);
      setTestFailed(false);
      elapsedSecondsRef.current = 0;
      lastTypingTimeRef.current = Date.now();
      warningPlayedRef.current = false;

      // Reset scroll position
      if (wordsContainerRef.current) {
         wordsContainerRef.current.scrollTo({ top: 0 });
      }

      // Focus input after a short delay to ensure DOM is ready
      setTimeout(() => {
         focusInput();
      }, 10);
   }, [mode, testWords, testTime, setTestStart]);

   // * Listen for restart test event from Header
   useEffect(() => {
      const handleRestartEvent = () => {
         restartTest();
      };

      window.addEventListener("restartTest", handleRestartEvent);
      return () => {
         window.removeEventListener("restartTest", handleRestartEvent);
      };
   }, [restartTest]);

   return (
      <div className="typeZoneContainer grid grid-rows-[auto_1fr] w-full h-full items-center">
         <MenuBar testStart={testStart} />
         {testEnd ? (
            <div className="w-full flex flex-col items-center -mt-24">
               <div className="w-full overflow-hidden h-[17rem]">
                  <Stats
                     raw={calculateRAW()}
                     wpm={calculateWPM()}
                     accuracy={calculateAccuracy()}
                     correctChar={correctChar}
                     incorrectChar={incorrectChar}
                     missedChar={missedChar}
                     extraChar={extraChar}
                     correctWord={correctWord}
                     consistency={calculateConsistency()}
                     graphData={graphData}
                     elapsedTime={elapsedSecondsRef.current}
                     mode={mode}
                     testWords={testWords}
                     isAfk={isAfk}
                     testFailed={testFailed}
                  />
               </div>
               <div className="nextTestSection flex flex-col items-center mt-8">
                  <button
                     ref={nextTestBtnRef}
                     onClick={restartTest}
                     className="relative group px-8 py-3 text-fade-100 hover:text-glow-100 border-2 border-transparent focus:border-fade-100 rounded-lg focus:outline-none transition-all cursor-pointer"
                     tabIndex={0}
                  >
                     <FaChevronRight size={20} />
                     <span className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-3 py-1.5 text-sm bg-dark-100 text-glow-100 border border-fade/30 rounded invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus:visible group-focus:opacity-100 transition-all whitespace-nowrap pointer-events-none z-10">
                        Next Test
                     </span>
                  </button>
                  {!auth.currentUser && (
                     <div className="signInPrompt text-center mt-4 text-fade-100 text-sm">
                        <Link
                           to="/login"
                           className="underline hover:text-glow-100 transition-colors"
                        >
                           Sign in
                        </Link>{" "}
                        to save your result
                     </div>
                  )}
               </div>
            </div>
         ) : (
            <div className="w-full flex flex-col items-center -mt-24">
               <div className="w-full overflow-visible" onClick={focusInput}>
                  <div className="testModesNotice flex justify-center text-center gap-2 transition-opacity duration-150 relative">
                     {capsLockOn && capsLockWarningMode === "show" && (
                        <div className="capsWarning absolute -top-16 left-1/2 -translate-x-1/2 flex gap-2.5 items-center text-dark-100 text-[1rem] bg-active w-fit p-4 rounded-lg pointer-events-none z-50">
                           <FaLock size={16} />
                           <span>Caps Lock</span>
                        </div>
                     )}
                     {minSpeedMode === "custom" && (
                        <TextButton
                           icon={<FaBolt size={16} />}
                           text={`min ${minSpeedValue} wpm`}
                           className="text-[1em] !gap-2"
                        />
                     )}
                     {minAccuracyMode === "custom" && (
                        <TextButton
                           icon={<FaBullseye size={16} />}
                           text={`min ${minAccuracyValue}% wpm`}
                           className="text-[1em] !gap-2"
                        />
                     )}
                  </div>
                  {liveProgressMode === "mini" && (
                     <TimeCounter
                        countDown={counter}
                        className={testStart ? "opacity-100" : "opacity-0"}
                        mode={mode}
                        current={completedWords}
                        total={testWords}
                     />
                  )}
                  {liveProgressMode === "bar" && (
                     <TimeProgressBar
                        mode={mode}
                        counter={counter}
                        testTime={testTime}
                        completedWords={completedWords}
                        testWords={testWords}
                        testStart={testStart}
                        testEnd={testEnd}
                     />
                  )}
                  <div
                     ref={wordsContainerRef}
                     className="text-3xl flex flex-wrap leading-[3rem] tracking-tight relative text-fade-100 h-36 overflow-hidden w-full"
                  >
                     {!isFocused && (
                        <div
                           className="cursor-default absolute top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm z-10"
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
                           className="mx-2"
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
               <div className="restartBtn flex justify-center mt-8">
                  <button
                     onClick={restartTest}
                     className="relative group px-8 py-3 text-fade-100 hover:text-glow-100 border-2 border-transparent focus:border-fade-100 rounded-lg focus:outline-none transition-all cursor-pointer"
                     tabIndex={0}
                  >
                     <FaRedoAlt size={20} />
                     <span className="absolute top-full left-1/2 -translate-x-1/2 mt-3 px-3 py-1.5 text-sm bg-dark-100 text-glow-100 border border-fade/30 rounded invisible opacity-0 group-hover:visible group-hover:opacity-100 group-focus:visible group-focus:opacity-100 transition-all whitespace-nowrap pointer-events-none z-10">
                        Restart Test
                     </span>
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};
export default TypeZone;
