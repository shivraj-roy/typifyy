const MenuBar = ({ countDown }: { countDown: number }) => {
   return (
      <div className="flex">
         <div className="counter">{countDown}</div>
         <div className="flex">
            <div className="time">15</div>
            <div className="time">30</div>
            <div className="time">60</div>
         </div>
      </div>
   );
};
export default MenuBar;
