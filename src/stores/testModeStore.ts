import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { TestMode } from "../types";

interface TestModeStore {
   mode: TestMode;
   testTime: number;
   testWords: number;
   setMode: (mode: TestMode) => void;
   setTestTime: (testTime: number) => void;
   setTestWords: (testWords: number) => void;
}

export const useTestModeStore = create<TestModeStore>()(
   persist(
      (set) => ({
         // State
         mode: "time",
         testTime: 30,
         testWords: 25,

         // Actions
         setMode: (mode) => set({ mode }),
         setTestTime: (testTime) => set({ testTime }),
         setTestWords: (testWords) => set({ testWords }),
      }),
      {
         name: "modeConfig", // localStorage key (same as before)
         storage: createJSONStorage(() => localStorage),
      }
   )
);
