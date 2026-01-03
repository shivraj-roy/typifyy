import { PersonalBestCardProps } from "../../types";

const PersonalBestCard = ({ label, data }: PersonalBestCardProps) => {
   const hasData = data !== null;

   const formatDate = (date: Date): string => {
      return date.toLocaleDateString("en-US", {
         day: "numeric",
         month: "short",
         year: "numeric",
      });
   };

   return (
      <div
         className={`best grid gap-1 justify-center self-center relative ${hasData ? "group" : ""}`}
      >
         <div
            className={`quick grid gap-1.5 justify-center self-center cursor-default ${hasData ? "group-hover:opacity-0" : ""} transition-opacity`}
         >
            <div className="test text-[0.8em] grid content-end leading-[100%] text-secondary">
               {label}
            </div>
            <div className="wpm text-[2.5em] grid leading-[100%]">
               {hasData ? data.wpm : "—"}
            </div>
            <div className="acc text-[1.5em] opacity-75 grid leading-[100%] content-start">
               {hasData ? `${data.accuracy}%` : "—"}
            </div>
         </div>
         {hasData && (
            <div className="fullTest text-[0.8em] grid content-center grid-cols-1 gap-1.5 leading-[100%] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-0 group-hover:opacity-100">
               <div className="text-primary">{label}</div>
               <div>{data.wpm} wpm</div>
               <div>{data.raw} raw</div>
               <div>{data.accuracy}% acc</div>
               <div>{data.consistency}% con</div>
               <div className="text-primary">{formatDate(data.timestamp)}</div>
            </div>
         )}
      </div>
   );
};

export default PersonalBestCard;
