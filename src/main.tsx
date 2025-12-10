import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.tsx";
import { TestModeContextProvider } from "./context/TestMode.tsx";

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <TestModeContextProvider>
         <App />
      </TestModeContextProvider>
   </StrictMode>
);
