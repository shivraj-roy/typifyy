import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
   FaChartLine,
   FaCog,
   FaGlobeAsia,
   FaInfo,
   FaSignOutAlt,
   FaUserCircle,
} from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { BsFillKeyboardFill } from "react-icons/bs";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import NavIcon from "./ui/NavIcon";
import MenuItem from "./ui/MenuItem";
import CustomToast from "./ui/CustomToast";
import { Bounce, toast } from "react-toastify";

const Header = () => {
   const [user, setUser] = useState<User | null>(null);

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
         setUser(currentUser);
      });
      return () => unsubscribe();
   }, []);

   // Dispatch restart test event
   const handleRestartTest = () => {
      window.dispatchEvent(new CustomEvent("restartTest"));
   };

   const handleLogout = () => {
      auth
         .signOut()
         .then(() => {
            toast(
               <CustomToast
                  type="success"
                  title="Success"
                  message="Successfully logged out."
               />,
               {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: false,
                  transition: Bounce,
               }
            );
         })
         .catch((error) => {
            toast(
               <CustomToast
                  type="error"
                  title="Error"
                  message="Failed to log out."
               />,
               {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: false,
                  transition: Bounce,
               }
            );
            console.error("Error logging out:", error);
         });
   };

   return (
      <>
         <div className="header flex items-center">
            <Link
               to="/"
               className="logo flex items-center gap-2"
               onClick={handleRestartTest}
            >
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
                     onClick={handleRestartTest}
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
                  {user ? (
                     <div className="accountButtonAndMenu relative group">
                        <Link
                           to={"/account"}
                           className="relative items-center p-2 grid gap-[0.33em] grid-flow-col text-fade-100 hover:text-glow-100 transition-colors cursor-pointer "
                        >
                           <FaUserCircle size={20} />
                           <div className="text text-sm self-center">
                              {user?.displayName ||
                                 user?.email?.split("@")[0] ||
                                 "User"}
                           </div>
                        </Link>
                        <div className="menu absolute right-0 top-[99%] w-full min-w-44 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                           <div className="spacer h-2 "></div>
                           <div className="item bg-dark-100 grid gap-0.5 rounded-md shadow-[0_0_0_0.5em_rgba(13, 13, 13, 0.871)]">
                              <MenuItem
                                 to="/account"
                                 icon={<FaChartLine size={16} />}
                                 text="user stats"
                                 className="rounded-t-md"
                              />
                              <MenuItem
                                 to="/account"
                                 icon={<FaGlobeAsia size={16} />}
                                 text="public profile"
                              />
                              <MenuItem
                                 to="/account-settings"
                                 icon={<FaCog size={16} />}
                                 text="account settings"
                              />
                              <MenuItem
                                 onClick={handleLogout}
                                 icon={<FaSignOutAlt size={16} />}
                                 text="sign out"
                                 className="rounded-b-md"
                              />
                           </div>
                        </div>
                     </div>
                  ) : (
                     <NavIcon to="/login" icon={<FiUser size={20} />} />
                  )}
               </div>
            </nav>
         </div>
      </>
   );
};
export default Header;
