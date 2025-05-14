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
