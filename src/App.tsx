import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { createPortal } from "react-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import Account from "./pages/Account";
import Settings from "./pages/Settings";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
   {
      path: "/",
      element: <RootLayout />,
      children: [
         {
            index: true,
            element: <Home />,
         },
         {
            path: "login",
            element: <Login />,
         },
         {
            path: "account",
            element: <Account />,
         },
         {
            path: "settings",
            element: <Settings />,
         },
         {
            path: "about",
            element: <About />,
         },
         {
            path: "*",
            element: <NotFound />,
         },
      ],
   },
]);

function App() {
   const popupsContainer = document.getElementById("popups");

   return (
      <>
         {popupsContainer &&
            createPortal(
               <ToastContainer
                  toastClassName="!bg-transparent !shadow-none !p-0"
                  closeButton={false}
                  newestOnTop={true}
               />,
               popupsContainer,
            )}
         <RouterProvider router={router} />
      </>
   );
}

export default App;
