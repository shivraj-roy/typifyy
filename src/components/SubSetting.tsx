import { ReactNode } from "react";
import InputAndIndicator from "./ui/InputAndIndicator";

interface ButtonConfig {
   label: string;
   isActive: boolean;
   onClick: () => void;
}

type ValidatorFn = (
   value: string
) =>
   | { valid: boolean; error?: string }
   | Promise<{ valid: boolean; error?: string }>;

interface SubSettingProps {
   icon: ReactNode;
   title: string;
   description: string;
   buttons: ButtonConfig[];
   showInput?: boolean;
   inputValue?: number;
   onInputChange?: (value: number) => void;
   onInputCommit?: () => void;
   validator?: ValidatorFn;
   inputName?: string;
}

const SubSetting = ({
   icon,
   title,
   description,
   buttons,
   showInput = false,
   inputValue = 100,
   onInputChange = () => {},
   onInputCommit = () => {},
   validator,
   inputName = "setting",
}: SubSettingProps) => {
   return (
      <div className="section grid grid-cols-[2fr_1fr] grid-rows-[auto_1fr] gap-4">
         <div className="groupTitle text-[1rem] text-fade-100 flex items-center gap-1.5">
            {icon}
            <span>{title}</span>
         </div>
         <div className="inputs grid grid-rows-[auto_1fr] gap-2 row-span-2 mt-10">
            {showInput && (
               <div className="inputAndBtn">
                  <InputAndIndicator
                     type="text"
                     name={inputName}
                     value={inputValue.toString()}
                     onChange={(value) => {
                        if (value === "") {
                           onInputChange(0);
                        } else {
                           const num = parseInt(value, 10);
                           if (!isNaN(num)) {
                              onInputChange(num);
                           }
                        }
                     }}
                     onBlur={onInputCommit}
                     onKeyDown={(e) => {
                        if (e.key === "Enter") {
                           onInputCommit();
                        }
                     }}
                     validator={validator}
                  />
               </div>
            )}
            <div className="buttons grid grid-cols-[repeat(auto-fit,minmax(4.5rem,1fr))] gap-2">
               {buttons.map((button, index) => (
                  <button
                     key={index}
                     onClick={button.onClick}
                     className={`cursor-pointer p-2 rounded-lg text-center h-min text-[1em] gap-2 justify-center align-baseline hover:bg-glow-100 hover:text-dark-100 ${
                        button.isActive ? "activeBtn" : "bg-dark-100/40"
                     }`}
                  >
                     {button.label}
                  </button>
               ))}
            </div>
         </div>
         <div className="text text-start">{description}</div>
      </div>
   );
};

export default SubSetting;
