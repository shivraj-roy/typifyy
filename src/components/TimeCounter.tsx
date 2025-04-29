const TimeCounter = ({ countDown }: { countDown: number }) => {
   return (
      <div>
         <div className="counter">{countDown}</div>
      </div>
   );
};
export default TimeCounter;
