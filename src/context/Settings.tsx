import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { SettingMode, SoundMode, SettingsContextType } from "../types";

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

   const [soundVolume, setSoundVolume] = useState<number>(() => {
      const saved = localStorage.getItem("soundVolume");
      return saved ? parseFloat(saved) : 0.5;
   });

   const [soundMode, setSoundMode] = useState<SoundMode>(() => {
      const saved = localStorage.getItem("soundMode");
      return (saved as SoundMode) || "off";
   });

   // Save to localStorage whenever settings change
   useEffect(() => {
      try {
         localStorage.setItem("minSpeedMode", minSpeedMode);
      } catch (error) {
         console.error("Failed to save minSpeedMode to localStorage:", error);
      }
   }, [minSpeedMode]);

   useEffect(() => {
      try {
         localStorage.setItem("minSpeedValue", minSpeedValue.toString());
      } catch (error) {
         console.error("Failed to save minSpeedValue to localStorage:", error);
      }
   }, [minSpeedValue]);

   useEffect(() => {
      try {
         localStorage.setItem("minAccuracyMode", minAccuracyMode);
      } catch (error) {
         console.error("Failed to save minAccuracyMode to localStorage:", error);
      }
   }, [minAccuracyMode]);

   useEffect(() => {
      try {
         localStorage.setItem("minAccuracyValue", minAccuracyValue.toString());
      } catch (error) {
         console.error("Failed to save minAccuracyValue to localStorage:", error);
      }
   }, [minAccuracyValue]);

   useEffect(() => {
      try {
         localStorage.setItem("soundVolume", soundVolume.toString());
      } catch (error) {
         console.error("Failed to save soundVolume to localStorage:", error);
      }
   }, [soundVolume]);

   useEffect(() => {
      try {
         localStorage.setItem("soundMode", soundMode);
      } catch (error) {
         console.error("Failed to save soundMode to localStorage:", error);
      }
   }, [soundMode]);

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
            soundVolume,
            setSoundVolume,
            soundMode,
            setSoundMode,
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
