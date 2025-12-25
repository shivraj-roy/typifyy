import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { SettingMode, SettingsContextType } from "../types";

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsContextProvider = ({
   children,
}: {
   children: ReactNode;
}) => {
   const [minSpeedMode, setMinSpeedMode] = useState<SettingMode>(() => {
      const saved = localStorage.getItem("minSpeedMode");
      return (saved as SettingMode) || "off";
   });

   const [minSpeedValue, setMinSpeedValue] = useState<number>(() => {
      const saved = localStorage.getItem("minSpeedValue");
      return saved ? parseInt(saved, 10) : 100;
   });

   const [minAccuracyMode, setMinAccuracyMode] = useState<SettingMode>(() => {
      const saved = localStorage.getItem("minAccuracyMode");
      return (saved as SettingMode) || "off";
   });

   const [minAccuracyValue, setMinAccuracyValue] = useState<number>(() => {
      const saved = localStorage.getItem("minAccuracyValue");
      return saved ? parseInt(saved, 10) : 75;
   });

   // Save to localStorage whenever settings change
   useEffect(() => {
      localStorage.setItem("minSpeedMode", minSpeedMode);
   }, [minSpeedMode]);

   useEffect(() => {
      localStorage.setItem("minSpeedValue", minSpeedValue.toString());
   }, [minSpeedValue]);

   useEffect(() => {
      localStorage.setItem("minAccuracyMode", minAccuracyMode);
   }, [minAccuracyMode]);

   useEffect(() => {
      localStorage.setItem("minAccuracyValue", minAccuracyValue.toString());
   }, [minAccuracyValue]);

   return (
      <SettingsContext.Provider
         value={{
            minSpeedMode,
            setMinSpeedMode,
            minSpeedValue,
            setMinSpeedValue,
            minAccuracyMode,
            setMinAccuracyMode,
            minAccuracyValue,
            setMinAccuracyValue,
         }}
      >
         {children}
      </SettingsContext.Provider>
   );
};

export const useSettings = () => {
   const context = useContext(SettingsContext);
   if (!context) {
      throw new Error("useSettings must be used within SettingsContextProvider");
   }
   return context;
};
