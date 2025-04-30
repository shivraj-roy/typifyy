const MenuBar = () => {
   return (
      <div className="flex justify-center items-center self-start">
         <div className="flex bg-[#0d0d0d] p-3 rounded-xl">
            <div className="flex">
               <button className="px-2 cursor-pointer hover:text-white">
                  text
               </button>
               <div>word</div>
            </div>
            <div className="flex">
               <div className="time">15</div>
               <div className="time">30</div>
               <div className="time">60</div>
            </div>
         </div>
      </div>
   );
};
export default MenuBar;
