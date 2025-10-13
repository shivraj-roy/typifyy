import { ButtonProps } from "../types";

const Button = ({
   btnIcon,
   btnTxt,
   btnClass,
   btnId,
   btnClick,
}: ButtonProps) => {
   return (
      <button
         id={btnId !== undefined ? String(btnId) : undefined}
         className={`flex items-center justify-center gap-2 px-2 cursor-pointer hover:text-white ${btnClass}`}
         onClick={btnClick}
         onMouseDown={(e) => e.preventDefault()}
      >
         <span>{btnIcon}</span>
         <span>{btnTxt}</span>
      </button>
   );
};
export default Button;
