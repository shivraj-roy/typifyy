import { useMemo, useState, useRef, useEffect } from "react";
import { IoChevronUp, IoChevronDown } from "react-icons/io5";

interface TestResult {
   timestamp: { seconds: number };
}

interface ActivityHeatMapProps {
   data: TestResult[];
}

interface DayData {
   date: Date;
   count: number;
   dateKey: string;
}

interface WeekData {
   days: (DayData | null)[];
   weekIndex: number;
}

type TimeFilter = "last12months" | number; // number represents a year

function ActivityHeatMap({ data }: ActivityHeatMapProps) {
   const [tooltipContent, setTooltipContent] = useState<string | null>(null);
   const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
   const [selectedFilter, setSelectedFilter] =
      useState<TimeFilter>("last12months");
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

   // Close dropdown when clicking outside
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
         ) {
            setIsDropdownOpen(false);
         }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
         document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   // Get available years from data
   const availableYears = useMemo(() => {
      const years = new Set<number>();
      data.forEach((result) => {
         const year = new Date(result.timestamp.seconds * 1000).getFullYear();
         years.add(year);
      });
      return Array.from(years).sort((a, b) => b - a); // Sort descending
   }, [data]);

   // Build count map from data
   const countMap = useMemo(() => {
      const map = new Map<string, number>();
      data.forEach((result) => {
         const date = new Date(result.timestamp.seconds * 1000);
         const dateKey = `${date.getFullYear()}-${String(
            date.getMonth() + 1
         ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
         map.set(dateKey, (map.get(dateKey) || 0) + 1);
      });
      return map;
   }, [data]);

   // Generate weeks data based on selected filter
   const { weeks, monthLabels } = useMemo(() => {
      const today = new Date();
      let startDate: Date;
      let endDate: Date;

      if (selectedFilter === "last12months") {
         endDate = today;
         startDate = new Date(today);
         startDate.setFullYear(startDate.getFullYear() - 1);
      } else {
         // Specific year
         startDate = new Date(selectedFilter, 0, 1);
         endDate = new Date(selectedFilter, 11, 31);
         if (endDate > today) endDate = today;
      }

      // Adjust start to the beginning of the week (Sunday)
      const dayOfWeek = startDate.getDay();
      startDate.setDate(startDate.getDate() - dayOfWeek);

      const weeksArr: WeekData[] = [];
      const monthLabelsArr: { month: string; weekIndex: number }[] = [];

      const currentDate = new Date(startDate);
      let weekIndex = 0;
      let lastMonth = -1;

      while (currentDate <= endDate || weeksArr.length < 53) {
         const week: (DayData | null)[] = [];

         for (let day = 0; day < 7; day++) {
            const dateKey = `${currentDate.getFullYear()}-${String(
               currentDate.getMonth() + 1
            ).padStart(2, "0")}-${String(currentDate.getDate()).padStart(
               2,
               "0"
            )}`;

            const isInRange =
               currentDate >= startDate && currentDate <= endDate;

            if (isInRange) {
               week.push({
                  date: new Date(currentDate),
                  count: countMap.get(dateKey) || 0,
                  dateKey,
               });
            } else {
               week.push(null);
            }

            if (currentDate.getMonth() !== lastMonth && isInRange) {
               const monthNames = [
                  "jan",
                  "feb",
                  "mar",
                  "apr",
                  "may",
                  "jun",
                  "jul",
                  "aug",
                  "sep",
                  "oct",
                  "nov",
                  "dec",
               ];
               monthLabelsArr.push({
                  month: monthNames[currentDate.getMonth()],
                  weekIndex,
               });
               lastMonth = currentDate.getMonth();
            }

            currentDate.setDate(currentDate.getDate() + 1);
         }

         weeksArr.push({ days: week, weekIndex });
         weekIndex++;

         if (currentDate > endDate && weeksArr.length >= 53) break;
      }

      return { weeks: weeksArr, monthLabels: monthLabelsArr };
   }, [countMap, selectedFilter]);

   // Calculate total tests for the selected period
   const totalTests = useMemo(() => {
      let total = 0;
      weeks.forEach((week) => {
         week.days.forEach((day) => {
            if (day) total += day.count;
         });
      });
      return total;
   }, [weeks]);

   const getColor = (count: number): string => {
      if (count === 0) return "rgba(183, 171, 152, 0.08)";
      if (count <= 2) return "rgba(235, 89, 57, 0.25)";
      if (count <= 5) return "rgba(235, 89, 57, 0.5)";
      if (count <= 10) return "rgba(235, 89, 57, 0.75)";
      return "rgba(235, 89, 57, 1)";
   };

   const legendColors = [
      "rgba(183, 171, 152, 0.08)",
      "rgba(235, 89, 57, 0.25)",
      "rgba(235, 89, 57, 0.5)",
      "rgba(235, 89, 57, 0.75)",
      "rgba(235, 89, 57, 1)",
   ];

   const formatTooltipDate = (date: Date): string => {
      const weekday = date.toLocaleDateString("en-US", { weekday: "long" });
      const day = String(date.getDate()).padStart(2, "0");
      const month = date.toLocaleDateString("en-US", { month: "short" });
      const year = date.getFullYear();
      return `${weekday} ${day} ${month} ${year}`;
   };

   const getFilterLabel = (filter: TimeFilter): string => {
      if (filter === "last12months") return "last 12 months";
      return String(filter);
   };

   const weekLabels = ["", "monday", "", "wednesday", "", "friday", ""];

   return (
      <div className="w-full bg-dark-100/40 rounded-lg p-6 mt-6">
         <div className="flex justify-center">
            <div className="wrapper w-full max-w-full">
               {/* Header */}
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                     {/* Custom Dropdown */}
                     <div className="relative" ref={dropdownRef}>
                        <button
                           onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                           className="flex items-center justify-between gap-4 bg-dark-100/10 border border-fade/30 text-fade-100 px-4 py-2 rounded-md text-[1rem] cursor-pointer hover:border-fade/50 transition-colors w-52"
                        >
                           <span>{getFilterLabel(selectedFilter)}</span>
                           {isDropdownOpen ? (
                              <IoChevronUp className="text-fade" />
                           ) : (
                              <IoChevronDown className="text-fade" />
                           )}
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                           <div className="absolute top-full left-0 mt-1 w-full bg-dark-100 rounded-md overflow-hidden z-50 shadow-lg">
                              <button
                                 onClick={() => {
                                    setSelectedFilter("last12months");
                                    setIsDropdownOpen(false);
                                 }}
                                 className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                    selectedFilter === "last12months"
                                       ? "bg-active text-dark font-medium"
                                       : "text-fade hover:bg-glow-100 hover:text-dark-100"
                                 }`}
                              >
                                 last 12 months
                              </button>
                              {availableYears.map((year) => (
                                 <button
                                    key={year}
                                    onClick={() => {
                                       setSelectedFilter(year);
                                       setIsDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                       selectedFilter === year
                                          ? "bg-active text-dark font-medium"
                                          : "text-fade hover:bg-glow-100 hover:text-dark-100"
                                    }`}
                                 >
                                    {year}
                                 </button>
                              ))}
                           </div>
                        )}
                     </div>

                     <span className="text-fade-100 text-[1rem]">
                        {totalTests} tests
                     </span>
                  </div>
                  <div className="flex items-center gap-2 text-[1rem] text-fade-100">
                     <span>less</span>
                     <div className="flex gap-[3px]">
                        {legendColors.map((color, index) => (
                           <div
                              key={index}
                              className="w-[16px] h-[16px] rounded-[3px]"
                              style={{ backgroundColor: color }}
                           />
                        ))}
                     </div>
                     <span>more</span>
                  </div>
               </div>

               {/* Heatmap Grid */}
               <div className="flex gap-2">
                  {/* Week labels */}
                  <div
                     className="flex flex-col justify-between pr-3"
                     style={{ height: `${7 * 18 + 6 * 4}px` }}
                  >
                     {weekLabels.map((label, index) => (
                        <span
                           key={index}
                           className="text-fade-100 text-[1rem] leading-4"
                           style={{ height: "18px" }}
                        >
                           {label}
                        </span>
                     ))}
                  </div>
                  {/* // Todo: Make this responsive */}
                  {/* Grid container */}
                  <div className="flex-1 overflow-x-auto">
                     <div className="flex flex-col min-w-fit">
                        {/* Weeks grid */}
                        <div className="flex gap-[4px]">
                           {weeks.map((week) => (
                              <div
                                 key={week.weekIndex}
                                 className="flex flex-col gap-[4px]"
                              >
                                 {week.days.map((day, dayIndex) => (
                                    <div
                                       key={dayIndex}
                                       className="w-[18px] h-[18px] rounded-[3px] cursor-pointer border-[1.5px] border-transparent hover:border-glow-100 transition-colors"
                                       style={{
                                          backgroundColor: day
                                             ? getColor(day.count)
                                             : "transparent",
                                       }}
                                       onMouseEnter={(e) => {
                                          if (day) {
                                             const rect =
                                                e.currentTarget.getBoundingClientRect();
                                             const tooltipText =
                                                day.count === 0
                                                   ? `No tests on ${formatTooltipDate(
                                                        day.date
                                                     )}`
                                                   : `${day.count} ${
                                                        day.count === 1
                                                           ? "test"
                                                           : "tests"
                                                     } on ${formatTooltipDate(
                                                        day.date
                                                     )}`;
                                             setTooltipContent(tooltipText);
                                             setTooltipPosition({
                                                x: rect.left + rect.width / 2,
                                                y: rect.top - 10,
                                             });
                                          }
                                       }}
                                       onMouseLeave={() =>
                                          setTooltipContent(null)
                                       }
                                    />
                                 ))}
                              </div>
                           ))}
                        </div>

                        {/* Month labels */}
                        <div className="relative h-6 mt-2 min-w-fit w-full">
                           {monthLabels.map((label, index) => (
                              <span
                                 key={index}
                                 className="absolute text-fade-100 text-[1rem] leading-4"
                                 style={{
                                    left: `${
                                       (label.weekIndex / weeks.length) * 100
                                    }%`,
                                 }}
                              >
                                 {label.month}
                              </span>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>

               {/* Note */}
               <p className="text-center text-fade-100/60 text-xs mt-4">
                  Note: All activity data is using UTC time.
               </p>

               {/* Tooltip */}
               {tooltipContent && (
                  <div
                     className="fixed z-50 px-3 py-2 text-xs text-glow bg-dark border border-fade/30 rounded-md shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full whitespace-nowrap"
                     style={{
                        left: tooltipPosition.x,
                        top: tooltipPosition.y,
                     }}
                  >
                     {tooltipContent}
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}

export default ActivityHeatMap;
