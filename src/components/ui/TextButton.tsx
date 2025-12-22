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
}

const TextButton = ({
   icon,
   text,
   onClick,
   href,
   to,
   target,
   rel,
}: TextButtonProps) => {
   const baseClasses =
      "textButton grid gap-1 grid-flow-col align-baseline items-center text-[0.75rem] leading-4 py-[0.25em] px-[0.5em] text-fade-100 cursor-pointer hover:text-glow-100 transition-colors no-underline";

   // External link
   if (href) {
      return (
         <a
            href={href}
            target={target}
            rel={rel}
            className={baseClasses}
         >
            {icon}
            <div className="text">{text}</div>
         </a>
      );
   }

   // Internal link
   if (to) {
      return (
         <Link to={to} className={baseClasses}>
            {icon}
            <div className="text">{text}</div>
         </Link>
      );
   }

   // Button
   return (
      <button onClick={onClick} className={baseClasses}>
         {icon}
         <div className="text">{text}</div>
      </button>
   );
};

export default TextButton;
