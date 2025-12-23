import { Outlet, useNavigation } from "react-router-dom";
import { Footer, Header } from "../components";
import LoadingBar from "../components/ui/LoadingBar";

const RootLayout = () => {
   const navigation = useNavigation();
   const isLoading = navigation.state === "loading";

   return (
      <div className="canvas">
         <div className={isLoading ? "opacity-30 pointer-events-none" : ""}>
            <Header />
         </div>
         {isLoading ? <LoadingBar /> : <Outlet />}
         <div className={isLoading ? "opacity-30 pointer-events-none" : ""}>
            <Footer />
         </div>
      </div>
   );
};

export default RootLayout;
