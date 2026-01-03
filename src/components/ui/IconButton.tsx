import { ReactNode } from "react";

interface IconButtonProps {
   type?: "button" | "submit" | "reset";
   icon?: ReactNode;
   text?: string;
   onClick?: () => void;
   disabled?: boolean;
   className?: string;
}

const IconButton = ({
   type = "button",
   icon,
   text,
   onClick,
   disabled = false,
   className = "",
}: IconButtonProps) => {
   return (
      <button
         type={type}
         onClick={onClick}
         disabled={disabled}
         className={`flex items-center justify-center gap-2 w-full h-9 text-[1em] bg-alt-bg hover:bg-primary rounded-[8px] p-2 leading-5 text-primary transition-colors group cursor-pointer disabled:opacity-40 disabled:cursor-default disabled:hover:bg-alt-bg ${className}`}
      >
         {icon && (
            <span className={`${!disabled ? "group-hover:text-bg" : ""}`}>
               {icon}
            </span>
         )}
         {text && (
            <span className={`${!disabled ? "group-hover:text-bg" : ""}`}>
               {text}
            </span>
         )}
      </button>
   );
};

export default IconButton;
