const TimeCounter = ({
   countDown,
   className,
   mode = "time",
   current = 0,
   total = 0,
}: {
   countDown: number;
   className?: string;
   mode?: "time" | "words";
   current?: number;
   total?: number;
}) => {
   return (
      <div>
         <div className={`flex text-3xl ml-2 text-active ${className}`}>
            {mode === "time" ? countDown : `${current}/${total}`}
         </div>
      </div>
   );
};
export default TimeCounter;
