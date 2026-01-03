import { Link } from "react-router-dom";
import { ReactNode } from "react";

type MenuItemProps = {
   icon: ReactNode;
   text: string;
   className?: string;
} & ({ to: string; onClick?: never } | { to?: never; onClick: () => void });

const MenuItem = ({
   icon,
   text,
   to,
   onClick,
   className = "",
}: MenuItemProps) => {
   const baseClasses = `flex items-center gap-2 py-2 hover:text-bg hover:bg-primary transition-colors duration-300 ${className}`;

   const content = (
      <>
         <div className="menu-icon ml-[0.9em]">{icon}</div>
         <div className="menu-text text-[12px]">{text}</div>
      </>
   );

   if (to) {
      return (
         <Link to={to} className={baseClasses}>
            {content}
         </Link>
      );
   }

   return (
      <button onClick={onClick} className={`${baseClasses} cursor-pointer`}>
         {content}
      </button>
   );
};

export default MenuItem;
