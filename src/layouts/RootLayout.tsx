import { Outlet } from "react-router-dom";
import { Footer, Header } from "../components";

const RootLayout = () => {
   return (
      <div className="canvas">
         <Header />
         <Outlet />
         <Footer />
      </div>
   );
};

export default RootLayout;
