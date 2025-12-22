import { MdTimer } from "react-icons/md";
import Button from "../ui/Button";
import { useTestMode } from "../context/TestMode";

const MenuBar = ({ testStart }: { testStart: boolean }) => {
   const testMode = useTestMode();
   const mode = testMode?.mode || "time";
   const setMode = testMode?.setMode || (() => {});
   const setTestTime = testMode?.setTestTime || (() => {});
   const setTestWords = testMode?.setTestWords || (() => {});
   const testTime = testMode?.testTime || 30;
   const testWords = testMode?.testWords || 25;

   const handleModeChange = (newMode: "time" | "words") => {
      setMode(newMode);
   };

   const handleTime = (e: React.MouseEvent<HTMLButtonElement>) => {
      const time = Number(e.currentTarget.id);
      setTestTime(time);
   };

   const handleWords = (e: React.MouseEvent<HTMLButtonElement>) => {
      const words = Number(e.currentTarget.id);
      setTestWords(words);
   };

   return (
      <div
         className={`flex justify-center items-center self-start transition-opacity duration-300 w-full ${
            testStart ? "opacity-0 pointer-events-none" : "opacity-100"
         }`}
      >
         <div className="flex bg-dark-100 px-3 py-2 rounded-xl">
            <div className="flex">
               <Button
                  btnIcon={<MdTimer />}
                  btnTxt="time"
                  btnClass={mode === "time" ? "active" : ""}
                  btnClick={() => handleModeChange("time")}
               />
               <Button
                  btnIcon={<span className="font-serif">A</span>}
                  btnTxt="words"
                  btnClass={mode === "words" ? "active" : ""}
                  btnClick={() => handleModeChange("words")}
               />
            </div>
            <div className="w-1 h-auto bg-fade rounded-2xl mr-2 ml-3 my-1" />
            <div className="flex">
               {mode === "time" ? (
                  <>
                     <Button
                        btnTxt="15"
                        btnId={15}
                        btnClick={handleTime}
                        btnClass={testTime === 15 ? "active" : ""}
                     />
                     <Button
                        btnTxt="30"
                        btnId={30}
                        btnClick={handleTime}
                        btnClass={testTime === 30 ? "active" : ""}
                     />
                     <Button
                        btnTxt="60"
                        btnId={60}
                        btnClick={handleTime}
                        btnClass={testTime === 60 ? "active" : ""}
                     />
                  </>
               ) : (
                  <>
                     <Button
                        btnTxt="10"
                        btnId={10}
                        btnClick={handleWords}
                        btnClass={testWords === 10 ? "active" : ""}
                     />
                     <Button
                        btnTxt="25"
                        btnId={25}
                        btnClick={handleWords}
                        btnClass={testWords === 25 ? "active" : ""}
                     />
                     <Button
                        btnTxt="50"
                        btnId={50}
                        btnClick={handleWords}
                        btnClass={testWords === 50 ? "active" : ""}
                     />
                  </>
               )}
            </div>
         </div>
      </div>
   );
};

export default MenuBar;
