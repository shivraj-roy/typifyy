import { useState } from "react";
import { MdTimer } from "react-icons/md";
import Button from "../ui/Button";
import { useTestMode } from "../context/TestMode";

const MenuBar = ({ testStart }: { testStart: boolean }) => {
   const testMode = useTestMode();
   const setTestTime = testMode?.setTestTime || (() => {});
   const [activeButton, setActiveButton] = useState<number | null>(null); // State to track active button

   const handleTime = (e: React.MouseEvent<HTMLButtonElement>) => {
      const time = Number(e.currentTarget.id);
      setTestTime(time);
      setActiveButton(time); // Set the clicked button as active
   };

   return (
      <div
         className={`flex justify-center items-center self-start transition-opacity duration-300 ${
            testStart ? "opacity-0 pointer-events-none" : "opacity-100"
         }`}
      >
         <div className="flex bg-dark-100 px-3 py-2 rounded-xl">
            <div className="flex">
               <Button
                  btnIcon={<MdTimer />}
                  btnTxt="time"
                  btnClass={"active"}
               />
               <Button
                  btnIcon={<span className="font-serif">A</span>}
                  btnTxt="words"
                  // btnClass={activeButton === null ? "" : ""}
               />
            </div>
            <div className="w-1 h-auto bg-fade rounded-2xl mr-2 ml-3 my-1" />
            <div className="flex">
               <Button
                  btnTxt="15"
                  btnId={15}
                  btnClick={handleTime}
                  btnClass={activeButton === 15 ? "active" : ""}
               />
               <Button
                  btnTxt="30"
                  btnId={30}
                  btnClick={handleTime}
                  btnClass={activeButton === 30 ? "active" : ""}
               />
               <Button
                  btnTxt="60"
                  btnId={60}
                  btnClick={handleTime}
                  btnClass={activeButton === 60 ? "active" : ""}
               />
            </div>
         </div>
      </div>
   );
};

export default MenuBar;
