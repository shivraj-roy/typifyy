import { Link } from "react-router-dom";
import NavIcon from "./ui/NavIcon";
import { BsFillKeyboardFill } from "react-icons/bs";
import { FaCog, FaInfo } from "react-icons/fa";
import { FiUser } from "react-icons/fi";

const Header = () => {
   return (
      <>
         <div className="header flex items-center">
            <Link to="/" className="logo flex items-center gap-2">
               <div className="icon w-10">
                  <img src="/assets/typifyy.png" alt="typifyy-logo" />
               </div>
               <h1 className="text relative text-4xl leading-8 font-logo tracking-wide text-glow-100">
                  <div className="top-text text-[0.325em] leading-[0.325em] left-[0.35em] -top-[0.85em] absolute text-fade-100">
                     on the beat
                  </div>
                  typifyy
               </h1>
            </Link>
            <nav className="flex items-center justify-between w-full px-6">
               <div className="left-nav flex items-center gap-3">
                  <NavIcon
                     to="/"
                     icon={<BsFillKeyboardFill size={20} />}
                     tooltip="start typing"
                  />
                  <NavIcon
                     to="/about"
                     icon={<FaInfo size={20} />}
                     tooltip="about"
                  />
                  <NavIcon
                     to="/settings"
                     icon={<FaCog size={20} />}
                     tooltip="settings"
                  />
               </div>
               <div className="right-nav flex items-center gap-4">
                  <NavIcon to="/login" icon={<FiUser size={20} />} />
               </div>
            </nav>
         </div>
      </>
   );
};
export default Header;
