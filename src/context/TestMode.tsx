import { createContext, useContext, useState } from "react";

interface TestModeContextType {
   // mode: TestMode;
   // setMode: (mode: TestMode) => void;
   testTime: number;
   setTestTime: (time: number) => void;
   // testWords: number;
   // setTestWords: (words: number) => void;
}

const TestModeContext = createContext<TestModeContextType | undefined>(
   undefined
);

export const TestModeContextProvider = ({
   children,
}: {
   children: React.ReactNode;
}) => {
   const [testTime, setTestTime] = useState(30);

   const value = {
      testTime,
      setTestTime,
   };

   return (
      <TestModeContext.Provider value={value}>
         {children}
      </TestModeContext.Provider>
   );
};

export const useTestMode = () => useContext(TestModeContext);
