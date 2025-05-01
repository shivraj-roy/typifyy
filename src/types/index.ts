export type ButtonProps = {
   btnIcon?: React.ReactNode;
   btnTxt?: string;
   btnClass?: string;
   btnId?: number | string;
   btnClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};
