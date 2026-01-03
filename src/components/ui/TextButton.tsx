import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface TextButtonProps {
   icon: ReactNode;
   text: string;
   onClick?: () => void;
   href?: string;
   to?: string;
   target?: string;
   rel?: string;
   className?: string;
}

const TextButton = ({
   icon,
   text,
   onClick,
   href,
   to,
   target,
   rel,
   className = "",
}: TextButtonProps) => {
   const baseClasses =
      "textButton flex gap-1 items-center text-[0.75rem] leading-4 py-[0.25em] px-[0.5em] text-secondary cursor-pointer hover:text-primary transition-colors no-underline";

   // External link
   if (href) {
      return (
         <a
            href={href}
            target={target}
            rel={rel}
            className={`${baseClasses} ${className}`}
         >
            {icon}
            <div className="text">{text}</div>
         </a>
      );
   }

   // Internal link
   if (to) {
      return (
         <Link to={to} className={`${baseClasses} ${className}`}>
            {icon}
            <div className="text">{text}</div>
         </Link>
      );
   }

   // Button
   return (
      <button onClick={onClick} className={`${baseClasses} ${className}`}>
         {icon}
         <div className="text">{text}</div>
      </button>
   );
};

export default TextButton;
