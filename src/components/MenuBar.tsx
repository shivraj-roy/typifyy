import { MdTimer } from "react-icons/md";
import Button from "./ui/Button";
import { useTestModeStore } from "../stores/testModeStore";

const MenuBar = ({ testStart }: { testStart: boolean }) => {
   const { mode, testTime, testWords, setMode, setTestTime, setTestWords } =
      useTestModeStore();

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
         className={`flex justify-center items-center self-start transition-opacity duration-300 w-full px-4 md:px-0 ${
            testStart ? "opacity-0 pointer-events-none" : "opacity-100"
         }`}
      >
         <div className="flex bg-alt-bg px-2 md:px-3 py-1.5 md:py-2 rounded-xl text-xs md:text-sm">
            <div className="flex">
               <Button
                  btnIcon={<MdTimer />}
                  btnTxt="time"
                  btnClass={mode === "time" ? "active" : "text-secondary"}
                  btnClick={() => handleModeChange("time")}
               />
               <Button
                  btnIcon={<span className="font-serif">A</span>}
                  btnTxt="words"
                  btnClass={mode === "words" ? "active" : "text-secondary"}
                  btnClick={() => handleModeChange("words")}
               />
            </div>
            <div className="w-1 md:w-1.5 h-auto bg-bg rounded-2xl mr-1.5 md:mr-2 ml-2 md:ml-3 my-1" />
            <div className="flex">
               {mode === "time" ? (
                  <>
                     <Button
                        btnTxt="15"
                        btnId={15}
                        btnClick={handleTime}
                        btnClass={testTime === 15 ? "active" : "text-secondary"}
                     />
                     <Button
                        btnTxt="30"
                        btnId={30}
                        btnClick={handleTime}
                        btnClass={testTime === 30 ? "active" : "text-secondary"}
                     />
                     <Button
                        btnTxt="60"
                        btnId={60}
                        btnClick={handleTime}
                        btnClass={testTime === 60 ? "active" : "text-secondary"}
                     />
                  </>
               ) : (
                  <>
                     <Button
                        btnTxt="10"
                        btnId={10}
                        btnClick={handleWords}
                        btnClass={
                           testWords === 10 ? "active" : "text-secondary"
                        }
                     />
                     <Button
                        btnTxt="25"
                        btnId={25}
                        btnClick={handleWords}
                        btnClass={
                           testWords === 25 ? "active" : "text-secondary"
                        }
                     />
                     <Button
                        btnTxt="50"
                        btnId={50}
                        btnClick={handleWords}
                        btnClass={
                           testWords === 50 ? "active" : "text-secondary"
                        }
                     />
                  </>
               )}
            </div>
         </div>
      </div>
   );
};

export default MenuBar;
