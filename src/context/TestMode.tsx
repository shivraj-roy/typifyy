import { createContext, useContext, useState } from "react";
import { TestModeContextType, TestMode } from "../types";

const TestModeContext = createContext<TestModeContextType | undefined>(
   undefined
);

export const TestModeContextProvider = ({
   children,
}: {
   children: React.ReactNode;
}) => {
   const [mode, setMode] = useState<TestMode>("time");
   const [testTime, setTestTime] = useState(30);
   const [testWords, setTestWords] = useState(25);

   const value = {
      mode,
      setMode,
      testTime,
      setTestTime,
      testWords,
      setTestWords,
   };

   return (
      <TestModeContext.Provider value={value}>
         {children}
      </TestModeContext.Provider>
   );
};

export const useTestMode = () => useContext(TestModeContext);
