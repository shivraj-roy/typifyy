import { ReactNode } from "react";
import InputAndIndicator from "./ui/InputAndIndicator";

interface ButtonConfig {
   label: string;
   isActive: boolean;
   onClick: () => void;
   className?: string; // Optional custom className for special buttons
}

type ValidatorFn = (
   value: string
) =>
   | { valid: boolean; error?: string }
   | Promise<{ valid: boolean; error?: string }>;

interface SubSettingProps {
   icon: ReactNode;
   title: string;
   description: ReactNode; // Changed from string to ReactNode to support JSX
   buttons: ButtonConfig[];
   showInput?: boolean;
   showSlider?: boolean;
   inputValue?: number;
   sliderValue?: number;
   sliderMin?: number;
   sliderMax?: number;
   sliderStep?: number;
   onInputChange?: (value: number) => void;
   onSliderChange?: (value: number) => void;
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
   showSlider = false,
   inputValue = 100,
   sliderValue = 0.5,
   sliderMin = 0,
   sliderMax = 1,
   sliderStep = 0.1,
   onInputChange = () => {},
   onSliderChange = () => {},
   onInputCommit = () => {},
   validator,
   inputName = "setting",
}: SubSettingProps) => {
   return (
      <div className="section grid grid-cols-1 lg:grid-cols-[2fr_1fr] lg:grid-rows-[auto_1fr] gap-4">
         <div className="groupTitle text-base md:text-[1rem] text-fade-100 flex items-center gap-1.5">
            {icon}
            <span>{title}</span>
         </div>
         <div className="text text-start text-sm md:text-base lg:order-3">
            {description}
         </div>
         <div className="inputs grid grid-rows-[auto_1fr] gap-2 lg:row-span-2 lg:mt-10 lg:order-2">
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
            {showSlider && (
               <div className="sliderContainer flex items-center gap-4">
                  <div className="sliderValue text-[1em] text-fade-100 min-w-[3rem]">
                     {sliderValue.toFixed(1)}
                  </div>
                  <input
                     type="range"
                     min={sliderMin}
                     max={sliderMax}
                     step={sliderStep}
                     value={sliderValue}
                     onChange={(e) =>
                        onSliderChange(parseFloat(e.target.value))
                     }
                     className="volumeSlider flex-1 h-4 rounded-full appearance-none cursor-pointer"
                  />
               </div>
            )}
            <div className="buttons grid grid-cols-[repeat(auto-fit,minmax(4.5rem,1fr))] gap-2">
               {buttons.map((button, index) => (
                  <button
                     key={index}
                     onClick={button.onClick}
                     className={
                        button.className ||
                        `cursor-pointer p-2 rounded-lg text-center h-min text-[1em] gap-2 justify-center align-baseline hover:bg-glow-100 hover:text-dark-100 ${
                           button.isActive ? "activeBtn" : "bg-dark-100/40"
                        }`
                     }
                  >
                     {button.label}
                  </button>
               ))}
            </div>
         </div>
      </div>
   );
};

export default SubSetting;
