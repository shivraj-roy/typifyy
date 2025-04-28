import { createContext, useContext, useState } from "react";

const TestModeContext = createContext();

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
