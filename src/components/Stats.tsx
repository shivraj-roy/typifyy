import { useEffect, useRef, useState } from "react";
import { Timestamp, collection, addDoc } from "firebase/firestore";
import { useTestMode } from "../context/TestMode";
import { useSettings } from "../context/Settings";
import { auth, db } from "../firebaseConfig";
import { StatsProps } from "../types";
import Graph from "./Graph";
import { Bounce, toast } from "react-toastify";
import CustomToast from "./ui/CustomToast";

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
   graphData,
   elapsedTime,
   mode,
   testWords,
   isAfk,
   testFailed,
}: StatsProps) => {
   const testModeContext = useTestMode();
   const testTime = testModeContext?.testTime || 30;
   const hasPushed = useRef(false);
   const { minSpeedMode, minSpeedValue, minAccuracyMode, minAccuracyValue } =
      useSettings();
   const [failReason, setFailReason] = useState<string | null>(null);

   useEffect(() => {
      if (hasPushed.current) return;

      // Check if test failed due to inactivity or timeout (word mode auto-end)
      if (testFailed) {
         hasPushed.current = true;
         setFailReason("bad activity");
         return;
      }

      // Check if test failed due to min speed or min accuracy settings (works for all users)
      let testFailedSettings = false;
      let reason = null;

      if (minSpeedMode === "custom" && wpm < minSpeedValue) {
         testFailedSettings = true;
         reason = "min speed";
      } else if (minAccuracyMode === "custom" && accuracy < minAccuracyValue) {
         testFailedSettings = true;
         reason = "min accuracy";
      }

      if (testFailedSettings && reason) {
         hasPushed.current = true; // Mark as processed to prevent re-running
         setFailReason(reason);
         toast(
            <CustomToast
               type="info"
               title="Notice"
               message={`Test failed - ${reason}`}
            />,
            {
               position: "top-right",
               autoClose: 5000,
               hideProgressBar: true,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: false,
               transition: Bounce,
            },
         );
         return;
      }

      // From here onwards, only for authenticated users (DB operations)
      if (!auth.currentUser) {
         console.log("User not authenticated, stats not pushed to DB");
         return;
      }

      // Todo : AFK detection improvements - implement better AFK detection logic
      if (isAfk && (accuracy === 0 || Number.isNaN(accuracy))) {
         toast(
            <CustomToast
               type="info"
               title="Notice"
               message="Test is invalid - AFK detected with 0% accuracy."
            />,
            {
               position: "top-right",
               autoClose: 5000,
               hideProgressBar: true,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: false,
               transition: Bounce,
            },
         );
         return;
      }

      const pushStatsToDB = async () => {
         try {
            const { uid } = auth.currentUser!;
            await addDoc(collection(db, "results"), {
               userId: uid,
               timestamp: Timestamp.now(),
               wpm,
               raw,
               accuracy,
               correctChar,
               incorrectChar,
               missedChar,
               extraChar,
               correctWord,
               consistency,
               mode,
               testWords: mode === "words" ? testWords : null,
               testTime: mode === "time" ? testTime : null,
               testDuration: elapsedTime ?? null,
               isAfk,
            });
            console.log("Stats pushed to DB");
            hasPushed.current = true;
         } catch (error) {
            toast(
               <CustomToast
                  type="error"
                  title="Error"
                  message="Failed to push stats to database."
               />,
               {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: false,
                  transition: Bounce,
               },
            );
            console.error("Error pushing stats to DB:", error);
         }
      };

      pushStatsToDB();
   }, []);

   return (
      <>
         <div className="w-full max-w-full h-full text-secondary cursor-default overflow-hidden">
            <div className="stats-box flex flex-col lg:flex-row justify-between h-[80%]">
               <div className="left-stats w-full lg:w-[10%] h-full flex flex-row lg:flex-col justify-center items-center gap-2">
                  <div className="stat flex flex-row-reverse lg:flex-col gap-0.5 lg:gap-0 justify-center items-center lg:items-baseline w-full">
                     <h3 className="text-xl lg:text-3xl lowercase">WPM</h3>
                     <p className="text-4xl lg:text-6xl text-accent">{wpm}</p>
                  </div>
                  <div className="stat flex flex-row-reverse lg:flex-col gap-0.5 lg:gap-0 justify-center items-center lg:items-baseline w-full">
                     <h3 className="text-xl lg:text-3xl lowercase">Acc</h3>
                     <p className="text-4xl lg:text-6xl text-accent">
                        {accuracy}%
                     </p>
                  </div>
               </div>
               <div className="right-stats w-full lg:w-[90%] h-full">
                  <Graph graphData={graphData} />
               </div>
            </div>
            <div className="w-full max-w-full flex flex-wrap lg:flex-nowrap justify-between items-center gap-2 lg:gap-0 h-[20%] mt-1">
               <div>
                  <h3 className="text-xs lowercase">Test Type</h3>
                  <p className="text-base lg:text-xl text-accent">
                     {mode === "words"
                        ? `words ${testWords}`
                        : `time ${testTime}s`}
                  </p>
               </div>
               {(isAfk || failReason) && (
                  <div>
                     <h3 className="text-xs lowercase">other</h3>
                     <p className="text-base lg:text-xl text-accent">
                        {failReason ? `failed - ${failReason}` : "afk detected"}
                     </p>
                  </div>
               )}
               <div>
                  <h3 className="text-xs">raw</h3>
                  <p className="text-base lg:text-3xl text-accent">{raw}</p>
               </div>
               <div>
                  <h3 className="text-xs">Words</h3>
                  <p className="text-base lg:text-3xl text-accent">
                     {correctWord}
                  </p>
               </div>
               <div className="relative group cursor-pointer">
                  <h3 className="text-xs">Characters</h3>
                  <p className="text-base lg:text-3xl text-accent">
                     {correctChar}/{incorrectChar}/{missedChar}/{extraChar}
                  </p>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-alt-bg text-primary text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     Correct: {correctChar}, Incorrect: {incorrectChar}, Missed:{" "}
                     {missedChar}, Extra: {extraChar}
                  </div>
               </div>
               <div>
                  <h3 className="text-xs">Consistency</h3>
                  <p className="text-base lg:text-3xl text-accent">
                     {consistency}%
                  </p>
               </div>
            </div>
         </div>
      </>
   );
};
export default Stats;
