import { MdTimer } from "react-icons/md";
import Button from "../ui/Button";

const MenuBar = () => {
   return (
      <div className="flex justify-center items-center self-start">
         <div className="flex bg-dark-100 px-3 py-2 rounded-xl">
            <div className="flex">
               <Button btnIcon={<MdTimer />} btnTxt="time" btnClass="active" />
               <Button
                  btnIcon={<span className="font-serif">A</span>}
                  btnTxt="words"
               />
            </div>
            <div className="w-1 h-auto bg-fade rounded-2xl mr-2 ml-3 my-1" />
            <div className="flex">
               <Button btnTxt="15" />
               <Button btnTxt="30" />
               <Button btnTxt="60" />
            </div>
         </div>
      </div>
   );
};
export default MenuBar;
