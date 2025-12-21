import { Link } from "react-router-dom";
import { ReactNode, useState, useRef } from "react";

interface NavIconProps {
   to: string;
   icon: ReactNode;
   tooltip?: string;
   onClick?: () => void;
}

const NavIcon = ({ to, icon, tooltip, onClick }: NavIconProps) => {
   const [showTooltip, setShowTooltip] = useState(false);
   const timeoutRef = useRef<number | null>(null);

   const handleMouseEnter = () => {
      timeoutRef.current = window.setTimeout(() => {
         setShowTooltip(true);
      }, 900);
   };

   const handleMouseLeave = () => {
      if (timeoutRef.current) {
         clearTimeout(timeoutRef.current);
         timeoutRef.current = null;
      }
      setShowTooltip(false);
   };

   return (
      <Link
         to={to}
         className="relative w-9 h-9 flex items-center justify-center p-2 text-fade-100 hover:text-glow-100 transition-colors"
         onMouseEnter={handleMouseEnter}
         onMouseLeave={handleMouseLeave}
         onClick={onClick}
      >
         {icon}
         {tooltip && (
            <span
               className={`absolute top-full mt-1 px-2 py-1 text-[10px] bg-dark-200 text-glow-100 bg-dark rounded transition-opacity whitespace-nowrap pointer-events-none ${
                  showTooltip ? "opacity-100" : "opacity-0"
               }`}
            >
               {tooltip}
            </span>
         )}
      </Link>
   );
};

export default NavIcon;
