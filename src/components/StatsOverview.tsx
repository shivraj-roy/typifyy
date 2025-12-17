import { useMemo } from "react";

interface TestResult {
   wpm: number;
   raw?: number;
   accuracy: number;
   consistency: number;
   correctChar: number;
   incorrectChar: number;
   extraChar: number;
   mode: "time" | "words";
   testTime?: number;
   testWords?: number;
}

interface StatsOverviewProps {
   data: TestResult[];
}

interface StatCardProps {
   title: string;
   value: string | number;
   subtitle?: string;
}

function StatCard({ title, value, subtitle }: StatCardProps) {
   return (
      <div>
         <div className="title text-fade-100">{title}</div>
         <div className="value text-5xl leading-tight">{value}</div>
         {subtitle && <div className="mode">{subtitle}</div>}
      </div>
   );
}

interface HighestResult {
   value: number;
   mode: string;
}

function StatsOverview({ data }: StatsOverviewProps) {
   const stats = useMemo(() => {
      if (!data || data.length < 10) {
         return null;
      }

      // Use stored raw or calculate for older records without it
      const resultsWithRaw = data.map((result) => {
         if (result.raw !== undefined) {
            return { ...result, raw: result.raw };
         }
         // Fallback calculation for older records without stored raw
         let raw: number;
         if (result.mode === "time" && result.testTime) {
            raw =
               (result.correctChar + result.incorrectChar + result.extraChar) /
               5 /
               (result.testTime / 60);
         } else {
            const estimatedTimeMinutes = result.correctChar / 5 / result.wpm;
            raw =
               (result.correctChar + result.incorrectChar + result.extraChar) /
               5 /
               estimatedTimeMinutes;
         }
         return { ...result, raw: Math.round(raw) };
      });

      // Helper to get mode string
      const getModeString = (result: TestResult): string => {
         if (result.mode === "time") {
            return `time ${result.testTime}`;
         }
         return `words ${result.testWords}`;
      };

      // Find highest WPM with mode
      const highestWpmResult = resultsWithRaw.reduce(
         (max, result) => (result.wpm > max.wpm ? result : max),
         resultsWithRaw[0]
      );
      const highestWpm: HighestResult = {
         value: highestWpmResult.wpm,
         mode: getModeString(highestWpmResult),
      };

      // Find highest Raw with mode
      const highestRawResult = resultsWithRaw.reduce(
         (max, result) => (result.raw > max.raw ? result : max),
         resultsWithRaw[0]
      );
      const highestRaw: HighestResult = {
         value: highestRawResult.raw,
         mode: getModeString(highestRawResult),
      };

      // Find highest Accuracy with mode
      const highestAccuracyResult = resultsWithRaw.reduce(
         (max, result) => (result.accuracy > max.accuracy ? result : max),
         resultsWithRaw[0]
      );
      const highestAccuracy: HighestResult = {
         value: highestAccuracyResult.accuracy,
         mode: getModeString(highestAccuracyResult),
      };

      // Find highest Consistency with mode
      const highestConsistencyResult = resultsWithRaw.reduce(
         (max, result) => (result.consistency > max.consistency ? result : max),
         resultsWithRaw[0]
      );
      const highestConsistency: HighestResult = {
         value: highestConsistencyResult.consistency,
         mode: getModeString(highestConsistencyResult),
      };

      // Calculate averages (all time)
      const totalWpm = resultsWithRaw.reduce((sum, r) => sum + r.wpm, 0);
      const totalRaw = resultsWithRaw.reduce((sum, r) => sum + r.raw, 0);
      const totalAccuracy = resultsWithRaw.reduce(
         (sum, r) => sum + r.accuracy,
         0
      );
      const totalConsistency = resultsWithRaw.reduce(
         (sum, r) => sum + r.consistency,
         0
      );
      const count = resultsWithRaw.length;

      const avgWpm = Math.round(totalWpm / count);
      const avgRaw = Math.round(totalRaw / count);
      const avgAccuracy = Math.round(totalAccuracy / count);
      const avgConsistency = Math.round(totalConsistency / count);

      // Calculate averages (last 10 tests)
      const last10 = resultsWithRaw.slice(0, 10);
      const last10Count = last10.length;

      const last10Wpm = Math.round(
         last10.reduce((sum, r) => sum + r.wpm, 0) / last10Count
      );
      const last10Raw = Math.round(
         last10.reduce((sum, r) => sum + r.raw, 0) / last10Count
      );
      const last10Accuracy = Math.round(
         last10.reduce((sum, r) => sum + r.accuracy, 0) / last10Count
      );
      const last10Consistency = Math.round(
         last10.reduce((sum, r) => sum + r.consistency, 0) / last10Count
      );

      return {
         highestWpm,
         highestRaw,
         highestAccuracy,
         highestConsistency,
         avgWpm,
         avgRaw,
         avgAccuracy,
         avgConsistency,
         last10Wpm,
         last10Raw,
         last10Accuracy,
         last10Consistency,
      };
   }, [data]);

   // Only render if user has at least 10 tests
   if (!stats) {
      return null;
   }

   return (
      <div className="statsOverview grid grid-cols-3 gap-4 text-left mt-6">
         {/* WPM Stats */}
         <StatCard
            title="highest wpm"
            value={stats.highestWpm.value}
            subtitle={stats.highestWpm.mode}
         />
         <StatCard title="average wpm" value={stats.avgWpm} />
         <StatCard title="avg wpm (last 10 tests)" value={stats.last10Wpm} />

         {/* Raw Stats */}
         <StatCard
            title="highest raw"
            value={stats.highestRaw.value}
            // subtitle={stats.highestRaw.mode}
         />
         <StatCard title="average raw" value={stats.avgRaw} />
         <StatCard title="avg raw (last 10 tests)" value={stats.last10Raw} />

         {/* Accuracy Stats */}
         <StatCard
            title="highest accuracy"
            value={`${stats.highestAccuracy.value}%`}
            // subtitle={stats.highestAccuracy.mode}
         />
         <StatCard title="average accuracy" value={`${stats.avgAccuracy}%`} />
         <StatCard
            title="avg accuracy (last 10 tests)"
            value={`${stats.last10Accuracy}%`}
         />

         {/* Consistency Stats */}
         <StatCard
            title="highest consistency"
            value={`${stats.highestConsistency.value}%`}
            // subtitle={stats.highestConsistency.mode}
         />
         <StatCard
            title="average consistency"
            value={`${stats.avgConsistency}%`}
         />
         <StatCard
            title="avg consistency (last 10 tests)"
            value={`${stats.last10Consistency}%`}
         />
      </div>
   );
}

export default StatsOverview;
