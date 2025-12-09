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
         className={`flex items-center justify-center gap-2 w-full h-9 text-[1em] bg-dark-100/40 hover:bg-glow rounded-[8px] p-2 leading-5 text-glow-100 transition-colors group cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
         {icon && (
            <span className="group-hover:text-dark-100">{icon}</span>
         )}
         {text && (
            <span className="group-hover:text-dark-100">{text}</span>
         )}
      </button>
   );
};

export default IconButton;
