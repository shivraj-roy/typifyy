import { Outlet, useNavigation } from "react-router-dom";
import { Footer, Header } from "../components";
import LoadingBar from "../components/ui/LoadingBar";
import { useEffect, useState } from "react";

const RootLayout = () => {
   const navigation = useNavigation();
   const isLoading = navigation.state === "loading";
   const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

   // Listen for keyboard open/close events from TypeZone
   useEffect(() => {
      const handleKeyboardOpen = () => setIsKeyboardVisible(true);
      const handleKeyboardClose = () => setIsKeyboardVisible(false);

      window.addEventListener("keyboardOpen", handleKeyboardOpen);
      window.addEventListener("keyboardClose", handleKeyboardClose);

      return () => {
         window.removeEventListener("keyboardOpen", handleKeyboardOpen);
         window.removeEventListener("keyboardClose", handleKeyboardClose);
      };
   }, []);

   return (
      <div className={`canvas transition-transform duration-300 ${isKeyboardVisible ? "-translate-y-24 md:translate-y-0" : "translate-y-0"}`}>
         <div className={isLoading ? "opacity-30 pointer-events-none" : ""}>
            <Header />
         </div>
         {/* <div className="w-full h-full"> */}
         {isLoading ? <LoadingBar /> : <Outlet />}
         {/* </div> */}
         <div className={isLoading ? "opacity-30 pointer-events-none" : ""}>
            <Footer />
         </div>
      </div>
   );
};

export default RootLayout;
