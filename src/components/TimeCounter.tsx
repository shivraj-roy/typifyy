const TimeCounter = ({ countDown }: { countDown: number }) => {
   return (
      <div>
         <div className="flex text-3xl ml-2">{countDown}</div>
      </div>
   );
};
export default TimeCounter;
