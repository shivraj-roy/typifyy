const TimeCounter = ({
   countDown,
   className,
}: {
   countDown: number;
   className?: string;
}) => {
   return (
      <div>
         <div className={`flex text-3xl ml-2 text-active ${className}`}>
            {countDown}
         </div>
      </div>
   );
};
export default TimeCounter;
