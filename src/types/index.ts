export type ButtonProps = {
   btnIcon?: React.ReactNode;
   btnTxt?: string;
   btnClass?: string;
   btnId?: number | string;
   btnClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export type StatsProps = {
   wpm: number;
   netWPM: number;
   accuracy: number;
   correctChar: number;
   incorrectChar: number;
   missedChar: number;
   extraChar: number;
   correctWord: number;
   consistency: number;
};

// * Test Mode Types
export type TestMode = "time" | "words";

// * Test Mode Context Type
export interface TestModeContextType {
   mode: TestMode;
   setMode: (mode: TestMode) => void;
   testTime: number;
   setTestTime: (time: number) => void;
   testWords: number;
   setTestWords: (words: number) => void;
}
