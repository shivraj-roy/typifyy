import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.tsx";
import { TestModeContextProvider } from "./context/TestMode.tsx";
import { SettingsContextProvider } from "./context/Settings.tsx";

createRoot(document.getElementById("root")!).render(
   <StrictMode>
      <SettingsContextProvider>
         <TestModeContextProvider>
            <App />
            <Analytics />
         </TestModeContextProvider>
      </SettingsContextProvider>
   </StrictMode>
);
