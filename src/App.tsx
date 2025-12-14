import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import Account from "./pages/Account";

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
