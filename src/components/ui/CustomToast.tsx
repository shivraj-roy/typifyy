import { ReactNode } from "react";
import {
   FaCheckCircle,
   FaExclamationCircle,
   FaInfoCircle,
   FaTimesCircle,
} from "react-icons/fa";

type ToastType = "success" | "error" | "warning" | "info";

interface CustomToastProps {
   type: ToastType;
   title: string;
   message: string;
}

const toastConfig: Record<
   ToastType,
   { icon: ReactNode; bgClass: string; borderClass: string; textClass: string }
> = {
   success: {
      icon: <FaCheckCircle size={18} />,
      bgClass: "bg-green-500/20",
      borderClass: "border-green-500/40",
      textClass: "text-green-400",
   },
   error: {
      icon: <FaTimesCircle size={18} />,
      bgClass: "bg-red-500/20",
      borderClass: "border-red-500/40",
      textClass: "text-red-400",
   },
   warning: {
      icon: <FaExclamationCircle size={18} />,
      bgClass: "bg-yellow-500/20",
      borderClass: "border-yellow-500/40",
      textClass: "text-yellow-400",
   },
   info: {
      icon: <FaInfoCircle size={18} />,
      bgClass: "bg-blue-500/20",
      borderClass: "border-blue-500/40",
      textClass: "text-blue-400",
   },
};

const CustomToast = ({ type, title, message }: CustomToastProps) => {
   const config = toastConfig[type];

   return (
      <div
         className={`font-space-mono flex flex-col gap-1 p-3 rounded-lg border-3 w-80 select-none ${config.bgClass} ${config.borderClass}`}
      >
         <div className={`flex items-center gap-2 ${config.textClass}`}>
            {config.icon}
            <span className="font-semibold text-sm">{title}</span>
         </div>
         <span className="text-sm text-glow">{message}</span>
      </div>
   );
};

export default CustomToast;
