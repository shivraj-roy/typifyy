// * Button Types
export type ButtonProps = {
   btnIcon?: React.ReactNode;
   btnTxt?: string;
   btnClass?: string;
   btnId?: number | string;
   btnClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

// * Stats Types
export type StatsProps = {
   raw: number;
   wpm: number;
   accuracy: number;
   correctChar: number;
   incorrectChar: number;
   missedChar: number;
   extraChar: number;
   correctWord: number;
   consistency: number;
   graphData: number[][];
   elapsedTime?: number;
   mode?: TestMode;
   testWords?: number;
   isAfk?: boolean;
};

// * Personal Best Types
export interface PersonalBestData {
   wpm: number;
   raw: number;
   accuracy: number;
   consistency: number;
   timestamp: Date;
}

export interface PersonalBestCardProps {
   label: string;
   data: PersonalBestData | null;
}

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

// * Settings Types
export type SettingMode = "off" | "custom";
export type SoundMode = "off" | "nk cream" | "osu";

export interface SettingsContextType {
   minSpeedMode: SettingMode;
   setMinSpeedMode: (mode: SettingMode) => void;
   minSpeedValue: number;
   setMinSpeedValue: (value: number) => void;
   minAccuracyMode: SettingMode;
   setMinAccuracyMode: (mode: SettingMode) => void;
   minAccuracyValue: number;
   setMinAccuracyValue: (value: number) => void;
   soundMode: SoundMode;
   setSoundMode: (mode: SoundMode) => void;
}
