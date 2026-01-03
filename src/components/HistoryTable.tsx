import React, { useState } from "react";
import { FaChartLine, FaCrown } from "react-icons/fa";

interface HistoryEntry {
   wpm: number;
   raw?: number;
   accuracy: number;
   consistency: number;
   correctChar: number;
   incorrectChar: number;
   missedChar: number;
   extraChar: number;
   mode: string;
   testWords?: number;
   testTime?: number;
   timestamp: {
      seconds: number;
   };
}

interface HistoryTableProps {
   data: HistoryEntry[];
}

const TableCell = ({
   children,
   className = "",
}: {
   children?: React.ReactNode;
   className?: string;
}) => <td className={`p-2 ${className}`}>{children}</td>;

// Helper to get raw value (use stored or calculate fallback)
const getRawValue = (entry: HistoryEntry): number => {
   if (entry.raw !== undefined) {
      return entry.raw;
   }
   // Fallback calculation for older records
   const totalChars = entry.correctChar + entry.incorrectChar + entry.extraChar;
   if (entry.mode === "time" && entry.testTime) {
      return Math.round(totalChars / 5 / (entry.testTime / 60));
   }
   // For words mode, estimate time from WPM
   const estimatedTimeMinutes = entry.correctChar / 5 / entry.wpm;
   return Math.round(totalChars / 5 / estimatedTimeMinutes);
};

function HistoryTable({ data }: HistoryTableProps) {
   const [visibleCount, setVisibleCount] = useState(10);

   const loadMore = () => {
      setVisibleCount((prev) => prev + 10);
   };

   const visibleData = data.slice(0, visibleCount);
   const hasMore = visibleCount < data.length;

   return (
      <>
         <div className="history mt-8">
            <table className="w-full">
               <thead className="text-[0.65rem] md:text-[0.75rem] text-left text-secondary">
                  <tr>
                     <TableCell className="hidden md:table-cell" />
                     <TableCell>wpm</TableCell>
                     <TableCell className="hidden sm:table-cell">raw</TableCell>
                     <TableCell>acc</TableCell>
                     <TableCell className="hidden lg:table-cell">
                        consistency
                     </TableCell>
                     <TableCell className="hidden md:table-cell">
                        <div className="relative group cursor-pointer">
                           <span>char</span>
                           <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-black text-primary text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              correct/incorrect/missed/extra
                           </div>
                        </div>
                     </TableCell>
                     <TableCell className="hidden md:table-cell">
                        mode
                     </TableCell>
                     <TableCell className="hidden lg:table-cell">
                        info
                     </TableCell>
                     <TableCell>date</TableCell>
                  </tr>
               </thead>
               <tbody>
                  {visibleData.map((entry, index) => (
                     <tr
                        key={index}
                        className={`text-left rounded-lg text-sm md:text-md h-12 md:h-14 ${
                           index % 2 === 0 ? "bg-alt-bg" : ""
                        }`}
                     >
                        <TableCell className="hidden md:table-cell rounded-bl-lg rounded-tl-lg">
                           <FaCrown size={16} className="opacity-0" />
                        </TableCell>
                        <TableCell className="md:rounded-none rounded-bl-lg rounded-tl-lg">
                           {entry.wpm}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                           {getRawValue(entry)}
                        </TableCell>
                        <TableCell>{entry.accuracy}%</TableCell>
                        <TableCell className="hidden lg:table-cell">
                           {entry.consistency}%
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                           {entry.correctChar}/{entry.incorrectChar}/
                           {entry.missedChar}/{entry.extraChar}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                           {entry.mode}{" "}
                           {entry.mode === "words"
                              ? `${entry.testWords}`
                              : `${entry.testTime}`}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                           <FaChartLine size={16} />
                        </TableCell>
                        <TableCell className="rounded-br-lg rounded-tr-lg text-xs md:text-sm">
                           <div className="leading-tight">
                              {new Date(
                                 entry.timestamp.seconds * 1000,
                              ).toLocaleDateString("en-GB", {
                                 day: "2-digit",
                                 month: "short",
                                 year: "numeric",
                              })}
                           </div>
                           <div className="leading-tight">
                              {new Date(
                                 entry.timestamp.seconds * 1000,
                              ).toLocaleTimeString("en-GB", {
                                 hour: "2-digit",
                                 minute: "2-digit",
                                 hour12: false,
                              })}
                           </div>
                        </TableCell>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
         {data.length > 10 && hasMore && (
            <div
               className="loadMoreButton bg-alt-bg p-2 rounded-lg mt-4 cursor-pointer hover:bg-primary hover:text-bg transition-colors text-center"
               onClick={loadMore}
            >
               load more
            </div>
         )}
      </>
   );
}

export default HistoryTable;
