import React, { useState } from "react";
import { FaChartLine, FaCrown } from "react-icons/fa";

interface HistoryEntry {
   wpm: number;
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

function HistoryTable({ data }: HistoryTableProps) {
   const [visibleCount, setVisibleCount] = useState(10);

   const loadMore = () => {
      setVisibleCount((prev) => prev + 10);
   };

   const visibleData = data.slice(0, visibleCount);
   const hasMore = visibleCount < data.length;

   return (
      <>
         <div className="history">
            <table className="w-full">
               <thead className="text-[0.75rem] text-left text-fade-100">
                  <tr>
                     <TableCell />
                     <TableCell>wpm</TableCell>
                     <TableCell>raw</TableCell>
                     <TableCell>accuracy</TableCell>
                     <TableCell>consistency</TableCell>
                     <TableCell>
                        <div className="relative group cursor-pointer">
                           <span>char</span>
                           <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-dark text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              correct/incorrect/missed/extra
                           </div>
                        </div>
                     </TableCell>
                     <TableCell>mode</TableCell>
                     <TableCell>info</TableCell>
                     <TableCell>date</TableCell>
                  </tr>
               </thead>
               <tbody>
                  {visibleData.map((entry, index) => (
                     <tr
                        key={index}
                        className={`text-left rounded-lg text-md h-14 ${
                           index % 2 === 0 ? "bg-dark-100/40" : ""
                        }`}
                     >
                        <TableCell className="rounded-bl-lg rounded-tl-lg">
                           <FaCrown size={16} className="opacity-0" />
                        </TableCell>
                        <TableCell>{entry.wpm}</TableCell>
                        <TableCell>
                           {Math.round((entry.wpm * entry.accuracy) / 100)}
                        </TableCell>
                        <TableCell>{entry.accuracy}%</TableCell>
                        <TableCell>{entry.consistency}%</TableCell>
                        <TableCell>
                           {entry.correctChar}/{entry.incorrectChar}/
                           {entry.missedChar}/{entry.extraChar}
                        </TableCell>
                        <TableCell>
                           {entry.mode}{" "}
                           {entry.mode === "words"
                              ? `${entry.testWords}`
                              : `${entry.testTime}`}
                        </TableCell>
                        <TableCell>
                           <FaChartLine size={16} />
                        </TableCell>
                        <TableCell className="rounded-br-lg rounded-tr-lg">
                           <div>
                              {new Date(
                                 entry.timestamp.seconds * 1000
                              ).toLocaleDateString("en-GB", {
                                 day: "2-digit",
                                 month: "short",
                                 year: "numeric",
                              })}
                           </div>
                           <div>
                              {new Date(
                                 entry.timestamp.seconds * 1000
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
               className="loadMoreButton bg-dark-100/40 p-2 rounded-lg mt-4 cursor-pointer hover:bg-fade hover:text-dark-100 transition-colors text-center"
               onClick={loadMore}
            >
               load more
            </div>
         )}
      </>
   );
}

export default HistoryTable;
