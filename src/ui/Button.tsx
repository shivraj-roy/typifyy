import { ButtonProps } from "../types";

const Button = ({ btnIcon, btnTxt, btnClass }: ButtonProps) => {
   return (
      <button
         className={`flex items-center justify-center gap-2 px-2 cursor-pointer hover:text-white ${btnClass}`}
      >
         <span>{btnIcon}</span>
         <span>{btnTxt}</span>
      </button>
   );
};
export default Button;
