import { useMemo } from "react";
import { FaUserCircle } from "react-icons/fa";
import DetailCard from "./ui/DetailCard";

interface TestResult {
   wpm: number;
   testDuration?: number;
   testTime?: number;
   correctChar: number;
   mode: "time" | "words";
   timestamp: { seconds: number };
}

interface UserDetailsProps {
   username: string;
   joinedDate: Date | null;
   data: TestResult[];
}

// Format time in HH:MM:SS format
function formatTime(totalSeconds: number): string {
   const hours = Math.floor(totalSeconds / 3600);
   const minutes = Math.floor((totalSeconds % 3600) / 60);
   const seconds = Math.floor(totalSeconds % 60);

   const pad = (n: number) => n.toString().padStart(2, "0");
   return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

// Format joined date
function formatJoinedDate(date: Date): string {
   return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
   });
}

// Calculate days ago from a date
function getDaysAgo(date: Date): string {
   const now = new Date();
   const diffTime = now.getTime() - date.getTime();
   const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

   if (diffDays === 0) return "today";
   if (diffDays === 1) return "1 day ago";
   return `${diffDays} days ago`;
}

// Calculate current streak (consecutive days with at least one test)
function calculateStreak(data: TestResult[]): number {
   if (!data || data.length === 0) return 0;

   // Get unique dates (in local timezone) sorted descending
   const dates = data.map((result) => {
      const date = new Date(result.timestamp.seconds * 1000);
      return new Date(
         date.getFullYear(),
         date.getMonth(),
         date.getDate()
      ).getTime();
   });
   const uniqueDates = [...new Set(dates)].sort((a, b) => b - a);

   if (uniqueDates.length === 0) return 0;

   const today = new Date();
   const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
   ).getTime();
   const yesterday = todayStart - 24 * 60 * 60 * 1000;

   // Streak must start from today or yesterday
   if (uniqueDates[0] !== todayStart && uniqueDates[0] !== yesterday) {
      return 0;
   }

   let streak = 1;
   for (let i = 1; i < uniqueDates.length; i++) {
      const diff = uniqueDates[i - 1] - uniqueDates[i];
      // Check if consecutive day (24 hours)
      if (diff === 24 * 60 * 60 * 1000) {
         streak++;
      } else {
         break;
      }
   }

   return streak;
}

// Calculate total time typing in seconds
function calculateTimeTyping(data: TestResult[]): number {
   if (!data || data.length === 0) return 0;

   return data.reduce((total, result) => {
      // Use stored testDuration if available
      if (result.testDuration !== undefined) {
         return total + result.testDuration;
      }
      // Fallback: for time mode, use testTime; for words mode, estimate from WPM
      if (result.mode === "time" && result.testTime) {
         return total + result.testTime;
      }
      // Estimate time for words mode: time = (correctChars / 5) / WPM * 60
      if (result.mode === "words" && result.wpm > 0) {
         const timeInMinutes = result.correctChar / 5 / result.wpm;
         return total + timeInMinutes * 60;
      }
      return total;
   }, 0);
}

const UserDetails = ({ username, joinedDate, data }: UserDetailsProps) => {
   const stats = useMemo(() => {
      const testsCompleted = data.length;
      const currentStreak = calculateStreak(data);
      const timeTyping = calculateTimeTyping(data);

      return {
         testsCompleted,
         currentStreak,
         timeTyping: formatTime(timeTyping),
      };
   }, [data]);

   return (
      <div className="details grid grid-cols-1 lg:grid-cols-[20.5rem_auto_1fr] gap-4 px-4 py-6 bg-dark-100/40 rounded-lg mt-6">
         <div className="avatarAndName grid grid-cols-[auto_1fr] items-center gap-4">
            <div className="avatar w-16 h-16 md:w-20 md:h-20 grid content-center">
               <FaUserCircle className="w-full h-full" />
            </div>
            <div className="text-left">
               <div className="username text-2xl md:text-3xl">{username}</div>
               {joinedDate && (
                  <div className="joined relative group text-[0.8em] leading-[0.8em] mt-1.5 text-fade-100 cursor-default w-fit">
                     joined {formatJoinedDate(joinedDate)}
                     <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 text-xs bg-dark text-glow border border-fade/30 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {getDaysAgo(joinedDate)}
                     </div>
                  </div>
               )}
            </div>
         </div>
         <div className="separator hidden lg:block w-2 h-auto bg-fade-100/40 rounded-md" />
         <div className="typingStats grid grid-cols-1 sm:grid-cols-3 gap-2 w-full h-full text-left self-center items-center">
            <DetailCard
               title="current streak"
               value={`${stats.currentStreak} ${
                  stats.currentStreak === 1 ? "day" : "days"
               }`}
            />
            <DetailCard title="tests completed" value={stats.testsCompleted} />
            <DetailCard title="time typing" value={stats.timeTyping} />
         </div>
      </div>
   );
};

export default UserDetails;
