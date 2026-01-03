import { FaCheck, FaCircleNotch, FaTimes } from "react-icons/fa";
import { useState, useRef } from "react";

type ValidationStatus = "idle" | "checking" | "success" | "failed";

type ValidatorFn = (
   value: string,
) =>
   | { valid: boolean; error?: string }
   | Promise<{ valid: boolean; error?: string }>;

interface InputAndIndicatorProps {
   type?: "text" | "email" | "password";
   name: string;
   placeholder?: string;
   value: string;
   onChange: (value: string) => void;
   onBlur?: () => void;
   onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
   validator?: ValidatorFn;
   debounceMs?: number;
   autoComplete?: string;
}

const InputAndIndicator = ({
   type = "text",
   name,
   placeholder,
   value,
   onChange,
   onBlur,
   onKeyDown,
   validator,
   debounceMs = 1000,
   autoComplete = "off",
}: InputAndIndicatorProps) => {
   const [status, setStatus] = useState<ValidationStatus>("idle");
   const [error, setError] = useState("");
   const debounceRef = useRef<number | null>(null);

   const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue);

      // Clear previous timeout
      if (debounceRef.current) {
         clearTimeout(debounceRef.current);
      }

      // Reset to idle if empty
      if (!newValue) {
         setStatus("idle");
         setError("");
         return;
      }

      // If no validator provided, stay idle
      if (!validator) {
         return;
      }

      // Show checking indicator
      setStatus("checking");

      // Validate after debounce
      debounceRef.current = window.setTimeout(async () => {
         const result = await validator(newValue);
         if (result.valid) {
            setStatus("success");
            setError("");
         } else {
            setStatus("failed");
            setError(result.error || "Invalid input");
         }
      }, debounceMs);
   };

   return (
      <div className="inputAndIndicator relative">
         <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="w-full h-9 text-[1em] bg-alt-bg outline-none border-[1.5px] border-transparent focus:border-primary rounded-[8px] p-2 pr-[2.1em] leading-5 caret-accent text-primary transition-colors"
            autoComplete={autoComplete}
         />
         <div
            className={`statusIndicator absolute right-0 top-0 w-9 h-9 items-center justify-center cursor-pointer ${
               status === "success" ? "flex" : "hidden"
            }`}
         >
            <FaCheck size={20} className="text-accent" />
         </div>
         <div
            className={`statusIndicator absolute right-0 top-0 w-9 h-9 items-center justify-center cursor-pointer group ${
               status === "failed" ? "flex" : "hidden"
            }`}
         >
            <FaTimes size={20} className="text-error" />
            <span className="absolute right-full top-1/2 -translate-y-1/2 mr-1 px-2 py-1 text-sm bg-black text-primary rounded opacity-0 group-hover:opacity-100 transition-opacity w-max max-w-72 pointer-events-none">
               {error}
            </span>
         </div>
         <div
            className={`statusIndicator absolute right-0 top-0 w-9 h-9 items-center justify-center cursor-pointer ${
               status === "checking" ? "flex" : "hidden"
            }`}
         >
            <FaCircleNotch size={20} className="text-primary animate-spin" />
         </div>
      </div>
   );
};

export default InputAndIndicator;
