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
}: StatsProps) => {
   const testModeContext = useTestMode();
   const testTime = testModeContext?.testTime || 30;
   const hasPushed = useRef(false);
   const { minSpeedMode, minSpeedValue, minAccuracyMode, minAccuracyValue } =
      useSettings();
   const [failReason, setFailReason] = useState<string | null>(null);

   useEffect(() => {
      if (hasPushed.current) return;

      // Check if test failed due to min speed or min accuracy settings (works for all users)
      let testFailed = false;
      let reason = null;

      if (minSpeedMode === "custom" && wpm < minSpeedValue) {
         testFailed = true;
         reason = "min speed";
      } else if (minAccuracyMode === "custom" && accuracy < minAccuracyValue) {
         testFailed = true;
         reason = "min accuracy";
      }

      if (testFailed && reason) {
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
            }
         );
         return;
      }

      // From here onwards, only for authenticated users (DB operations)
      if (!auth.currentUser) {
         console.log("User not authenticated, stats not pushed to DB");
         return;
      }

      // Todo : Accuracy options - user get to choose accuracy % to set as invalid test
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
            }
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
               }
            );
            console.error("Error pushing stats to DB:", error);
         }
      };

      pushStatsToDB();
   }, []);

   return (
      <>
         <div className="w-full h-full text-fade-100 cursor-default">
            <div className="stats-box flex justify-between h-[80%]">
               <div className="left-stats w-[10%] h-full flex flex-col justify-center items-center gap-2">
                  <div className="stat flex flex-col justify-center items-baseline w-full">
                     <h3 className="text-3xl lowercase">WPM</h3>
                     <p className="text-7xl text-active">{wpm}</p>
                  </div>
                  <div className="stat flex flex-col justify-center items-baseline w-full">
                     <h3 className="text-3xl lowercase">Acc</h3>
                     <p className="text-7xl text-active">{accuracy}%</p>
                  </div>
               </div>
               <div className="right-stats w-[90%] h-full">
                  <Graph graphData={graphData} />
               </div>
            </div>
            <div className="flex justify-between items-center h-[20%] mt-1">
               <div>
                  <h3 className="text-xs lowercase">Test Type</h3>
                  <p className="text-xl text-active">
                     {mode === "words"
                        ? `words ${testWords}`
                        : `time ${testTime}s`}
                  </p>
               </div>
               {(isAfk || failReason) && (
                  <div>
                     <h3 className="text-xs lowercase">other</h3>
                     <p className="text-xl text-active">
                        {failReason ? `failed - ${failReason}` : "afk detected"}
                     </p>
                  </div>
               )}
               <div>
                  <h3 className="text-xs">raw</h3>
                  <p className="text-3xl text-active">{raw}</p>
               </div>
               <div>
                  <h3 className="text-xs">Words</h3>
                  <p className="text-3xl text-active">{correctWord}</p>
               </div>
               <div className="relative group cursor-pointer">
                  <h3 className="text-xs">Characters</h3>
                  <p className="text-3xl text-active">
                     {correctChar}/{incorrectChar}/{missedChar}/{extraChar}
                  </p>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-dark text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                     Correct: {correctChar}, Incorrect: {incorrectChar}, Missed:{" "}
                     {missedChar}, Extra: {extraChar}
                  </div>
               </div>
               <div>
                  <h3 className="text-xs">Consistency</h3>
                  <p className="text-3xl text-active">{consistency}%</p>
               </div>
            </div>
         </div>
      </>
   );
};
export default Stats;
