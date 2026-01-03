import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import {
   SettingMode,
   SoundMode,
   ErrorSoundMode,
   TimeWarningMode,
   LiveProgressMode,
   CapsLockWarningMode,
   SettingsContextType,
} from "../types";

const STORAGE_KEY = "settingConfig";

interface SettingConfig {
   minSpeedMode: SettingMode;
   minSpeedValue: number;
   minAccuracyMode: SettingMode;
   minAccuracyValue: number;
   soundVolume: number;
   soundMode: SoundMode;
   errorSoundMode: ErrorSoundMode;
   timeWarningMode: TimeWarningMode;
   liveProgressMode: LiveProgressMode;
   capsLockWarningMode: CapsLockWarningMode;
}

const DEFAULT_CONFIG: SettingConfig = {
   minSpeedMode: "off",
   minSpeedValue: 100,
   minAccuracyMode: "off",
   minAccuracyValue: 75,
   soundVolume: 0.5,
   soundMode: "off",
   errorSoundMode: "off",
   timeWarningMode: "off",
   liveProgressMode: "mini",
   capsLockWarningMode: "show",
};

// Load config from localStorage
const loadConfig = (): SettingConfig => {
   try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
         const parsed = JSON.parse(saved);
         return {
            minSpeedMode: parsed.minSpeedMode || DEFAULT_CONFIG.minSpeedMode,
            minSpeedValue: parsed.minSpeedValue ?? DEFAULT_CONFIG.minSpeedValue,
            minAccuracyMode:
               parsed.minAccuracyMode || DEFAULT_CONFIG.minAccuracyMode,
            minAccuracyValue:
               parsed.minAccuracyValue ?? DEFAULT_CONFIG.minAccuracyValue,
            soundVolume: parsed.soundVolume ?? DEFAULT_CONFIG.soundVolume,
            soundMode: parsed.soundMode || DEFAULT_CONFIG.soundMode,
            errorSoundMode: parsed.errorSoundMode || DEFAULT_CONFIG.errorSoundMode,
            timeWarningMode:
               parsed.timeWarningMode || DEFAULT_CONFIG.timeWarningMode,
            liveProgressMode:
               parsed.liveProgressMode || DEFAULT_CONFIG.liveProgressMode,
            capsLockWarningMode:
               parsed.capsLockWarningMode || DEFAULT_CONFIG.capsLockWarningMode,
         };
      }
   } catch (error) {
      console.error("Failed to load settingConfig from localStorage:", error);
   }
   return DEFAULT_CONFIG;
};

// Save config to localStorage
const saveConfig = (config: SettingConfig) => {
   try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
   } catch (error) {
      console.error("Failed to save settingConfig to localStorage:", error);
   }
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsContextProvider = ({
   children,
}: {
   children: ReactNode;
}) => {
   const [config, setConfig] = useState<SettingConfig>(loadConfig);

   // Save to localStorage whenever config changes
   useEffect(() => {
      saveConfig(config);
   }, [config]);

   // Wrapper setters that update the config object
   const setMinSpeedMode = (minSpeedMode: SettingMode) => {
      setConfig((prev) => ({ ...prev, minSpeedMode }));
   };

   const setMinSpeedValue = (minSpeedValue: number) => {
      setConfig((prev) => ({ ...prev, minSpeedValue }));
   };

   const setMinAccuracyMode = (minAccuracyMode: SettingMode) => {
      setConfig((prev) => ({ ...prev, minAccuracyMode }));
   };

   const setMinAccuracyValue = (minAccuracyValue: number) => {
      setConfig((prev) => ({ ...prev, minAccuracyValue }));
   };

   const setSoundVolume = (soundVolume: number) => {
      setConfig((prev) => ({ ...prev, soundVolume }));
   };

   const setSoundMode = (soundMode: SoundMode) => {
      setConfig((prev) => ({ ...prev, soundMode }));
   };

   const setErrorSoundMode = (errorSoundMode: ErrorSoundMode) => {
      setConfig((prev) => ({ ...prev, errorSoundMode }));
   };

   const setTimeWarningMode = (timeWarningMode: TimeWarningMode) => {
      setConfig((prev) => ({ ...prev, timeWarningMode }));
   };

   const setLiveProgressMode = (liveProgressMode: LiveProgressMode) => {
      setConfig((prev) => ({ ...prev, liveProgressMode }));
   };

   const setCapsLockWarningMode = (capsLockWarningMode: CapsLockWarningMode) => {
      setConfig((prev) => ({ ...prev, capsLockWarningMode }));
   };

   return (
      <SettingsContext.Provider
         value={{
            minSpeedMode: config.minSpeedMode,
            setMinSpeedMode,
            minSpeedValue: config.minSpeedValue,
            setMinSpeedValue,
            minAccuracyMode: config.minAccuracyMode,
            setMinAccuracyMode,
            minAccuracyValue: config.minAccuracyValue,
            setMinAccuracyValue,
            soundVolume: config.soundVolume,
            setSoundVolume,
            soundMode: config.soundMode,
            setSoundMode,
            errorSoundMode: config.errorSoundMode,
            setErrorSoundMode,
            timeWarningMode: config.timeWarningMode,
            setTimeWarningMode,
            liveProgressMode: config.liveProgressMode,
            setLiveProgressMode,
            capsLockWarningMode: config.capsLockWarningMode,
            setCapsLockWarningMode,
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
