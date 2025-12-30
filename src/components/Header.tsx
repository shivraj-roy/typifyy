import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import {
   FaChartLine,
   FaCog,
   FaGlobeAsia,
   FaInfo,
   FaSignOutAlt,
   FaUserCircle,
   FaCircleNotch,
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
   const navigate = useNavigate();
   const [user, setUser] = useState<User | null>(null);
   const [authLoading, setAuthLoading] = useState(true);
   const [isMenuOpen, setIsMenuOpen] = useState(false);
   const menuRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
         setUser(currentUser);
         setAuthLoading(false);
      });
      return () => unsubscribe();
   }, []);

   // Close menu when clicking outside
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            menuRef.current &&
            !menuRef.current.contains(event.target as Node)
         ) {
            setIsMenuOpen(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
         document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   // Dispatch restart test event
   const handleRestartTest = () => {
      window.dispatchEvent(new CustomEvent("restartTest"));
   };

   const handleLogout = () => {
      setIsMenuOpen(false); // Close menu before logout
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
            // Redirect to home page after logout
            navigate("/");
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
               <div className="icon w-10 hidden md:block">
                  <img src="/assets/typifyy.png" alt="typifyy-logo" />
               </div>
               <h1 className="text relative text-2xl md:text-4xl leading-8 font-logo tracking-wide text-active md:text-glow-100">
                  <div className="top-text text-[0.325em] leading-[0.325em] left-[0.35em] -top-[0.85em] absolute text-fade-100 hidden md:block">
                     on the beat
                  </div>
                  typifyy
               </h1>
            </Link>
            <nav className="flex items-center justify-between w-full px-1 md:px-6">
               <div className="left-nav flex items-center gap-0.5 md:gap-3">
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
                  {authLoading ? (
                     <div className="p-2">
                        <FaCircleNotch
                           size={20}
                           className="text-fade-100 animate-spin"
                        />
                     </div>
                  ) : user ? (
                     <div
                        ref={menuRef}
                        className="accountButtonAndMenu relative group"
                     >
                        <button
                           onClick={() => {
                              // Only toggle on touch devices (non-hover devices)
                              if (
                                 !window.matchMedia("(hover: hover)").matches
                              ) {
                                 setIsMenuOpen(!isMenuOpen);
                              }
                           }}
                           className="relative items-center p-2 grid gap-[0.33em] grid-flow-col text-fade-100 hover:text-glow-100 transition-colors cursor-pointer "
                        >
                           <FaUserCircle size={20} />
                           <div className="text text-sm self-center hidden md:block">
                              {user?.displayName ||
                                 user?.email?.split("@")[0] ||
                                 "User"}
                           </div>
                        </button>
                        <div
                           className={`menu absolute right-0 top-[99%] w-full min-w-44 transition-all duration-200 ${
                              isMenuOpen
                                 ? "opacity-100 visible"
                                 : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
                           }`}
                        >
                           <div className="spacer h-2 "></div>
                           <div className="item bg-dark-100 grid gap-0.5 rounded-md shadow-[0_0_0_0.5em_rgba(13,_13,_13,_0.871)]">
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
