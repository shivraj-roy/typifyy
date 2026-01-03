import { createContext, useContext, useState, useEffect } from "react";
import { TestModeContextType, TestMode } from "../types";

const STORAGE_KEY = "modeConfig";

interface ModeConfig {
   mode: TestMode;
   testTime: number;
   testWords: number;
}

const DEFAULT_CONFIG: ModeConfig = {
   mode: "time",
   testTime: 30,
   testWords: 25,
};

// Load config from localStorage
const loadConfig = (): ModeConfig => {
   try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
         const parsed = JSON.parse(saved);
         return {
            mode: parsed.mode || DEFAULT_CONFIG.mode,
            testTime: parsed.testTime || DEFAULT_CONFIG.testTime,
            testWords: parsed.testWords || DEFAULT_CONFIG.testWords,
         };
      }
   } catch (error) {
      console.error("Failed to load modeConfig from localStorage:", error);
   }
   return DEFAULT_CONFIG;
};

// Save config to localStorage
const saveConfig = (config: ModeConfig) => {
   try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
   } catch (error) {
      console.error("Failed to save modeConfig to localStorage:", error);
   }
};

const TestModeContext = createContext<TestModeContextType | undefined>(
   undefined
);

export const TestModeContextProvider = ({
   children,
}: {
   children: React.ReactNode;
}) => {
   const [config, setConfig] = useState<ModeConfig>(loadConfig);

   // Save to localStorage whenever config changes
   useEffect(() => {
      saveConfig(config);
   }, [config]);

   // Wrapper setters that update the config object
   const setMode = (mode: TestMode) => {
      setConfig((prev) => ({ ...prev, mode }));
   };

   const setTestTime = (testTime: number) => {
      setConfig((prev) => ({ ...prev, testTime }));
   };

   const setTestWords = (testWords: number) => {
      setConfig((prev) => ({ ...prev, testWords }));
   };

   const value = {
      mode: config.mode,
      setMode,
      testTime: config.testTime,
      setTestTime,
      testWords: config.testWords,
      setTestWords,
   };

   return (
      <TestModeContext.Provider value={value}>
         {children}
      </TestModeContext.Provider>
   );
};

export const useTestMode = () => useContext(TestModeContext);
