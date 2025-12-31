import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import Account from "./pages/Account";
import Settings from "./pages/Settings";
import About from "./pages/About";

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
      ],
   },
]);

function App() {
   return (
      <>
         <ToastContainer
            toastClassName="!bg-transparent !shadow-none !p-0"
            closeButton={false}
            newestOnTop={true}
         />
         <RouterProvider router={router} />
      </>
   );
}

export default App;
