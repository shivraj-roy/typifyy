import PersonalBestCard from "./ui/PersonalBestCard";
import { PersonalBestData } from "../types";

interface PersonalBestsProps {
   time: {
      15: PersonalBestData | null;
      30: PersonalBestData | null;
      60: PersonalBestData | null;
   };
   words: {
      10: PersonalBestData | null;
      25: PersonalBestData | null;
      50: PersonalBestData | null;
   };
}

const PersonalBests = ({ time, words }: PersonalBestsProps) => {
   return (
      <div className="personalBests grid grid-cols-2 items-center justify-center gap-8">
         <div className="pbsTime grid grid-cols-3 items-center justify-center gap-4 p-4 bg-dark-100/40 rounded-lg">
            <PersonalBestCard label="15 seconds" data={time[15]} />
            <PersonalBestCard label="30 seconds" data={time[30]} />
            <PersonalBestCard label="60 seconds" data={time[60]} />
         </div>

         <div className="pbsWord grid grid-cols-3 items-center justify-center gap-4 p-4 bg-dark-100/40 rounded-lg">
            <PersonalBestCard label="10 words" data={words[10]} />
            <PersonalBestCard label="25 words" data={words[25]} />
            <PersonalBestCard label="50 words" data={words[50]} />
         </div>
      </div>
   );
};

export default PersonalBests;
