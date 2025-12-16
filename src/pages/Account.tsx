import { useEffect, useState, useMemo } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { User } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import HistoryTable from "../components/HistoryTable";
import PersonalBests from "../components/PersonalBests";
import { PersonalBestData } from "../types";

interface TestResult {
   wpm: number;
   accuracy: number;
   consistency: number;
   correctChar: number;
   incorrectChar: number;
   missedChar: number;
   extraChar: number;
   mode: "time" | "words";
   testTime?: number;
   testWords?: number;
   timestamp: { seconds: number };
}

type PersonalBests = {
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
};

function calculatePersonalBests(data: TestResult[]): PersonalBests {
   const personalBests: PersonalBests = {
      time: { 15: null, 30: null, 60: null },
      words: { 10: null, 25: null, 50: null },
   };

   for (const result of data) {
      if (result.mode === "time" && result.testTime) {
         const timeKey = result.testTime as 15 | 30 | 60;
         if (timeKey in personalBests.time) {
            const current = personalBests.time[timeKey];
            if (!current || result.wpm > current.wpm) {
               personalBests.time[timeKey] = {
                  wpm: result.wpm,
                  raw: Math.round(
                     ((result.correctChar + result.incorrectChar + result.extraChar) / 5) /
                        (result.testTime / 60)
                  ),
                  accuracy: result.accuracy,
                  consistency: result.consistency,
                  timestamp: new Date(result.timestamp.seconds * 1000),
               };
            }
         }
      } else if (result.mode === "words" && result.testWords) {
         const wordsKey = result.testWords as 10 | 25 | 50;
         if (wordsKey in personalBests.words) {
            const current = personalBests.words[wordsKey];
            if (!current || result.wpm > current.wpm) {
               // For words mode, we need to estimate time from the data
               // Since we don't store elapsed time for words mode, use correctChar count
               const estimatedTimeMinutes = (result.correctChar / 5) / result.wpm;
               personalBests.words[wordsKey] = {
                  wpm: result.wpm,
                  raw: Math.round(
                     ((result.correctChar + result.incorrectChar + result.extraChar) / 5) /
                        estimatedTimeMinutes
                  ),
                  accuracy: result.accuracy,
                  consistency: result.consistency,
                  timestamp: new Date(result.timestamp.seconds * 1000),
               };
            }
         }
      }
   }

   return personalBests;
}

function Account() {
   const [data, setData] = useState<TestResult[] | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   const personalBests = useMemo(() => {
      if (!data) return null;
      return calculatePersonalBests(data);
   }, [data]);

   useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
         if (user) {
            try {
               const q = query(
                  collection(db, "results"),
                  where("userId", "==", user.uid),
                  orderBy("timestamp", "desc")
               );
               const querySnapshot = await getDocs(q);
               const resultsData = querySnapshot.docs.map((doc) => doc.data() as TestResult);
               if (resultsData.length > 0) {
                  console.log("Documents data:", resultsData);
                  setData(resultsData);
               } else {
                  console.log("No documents found for this user!");
                  setData([]);
               }
            } catch (err) {
               console.error("Error fetching data:", err);
               setError("Failed to fetch data.");
            } finally {
               setLoading(false);
            }
         } else {
            console.log("No user is logged in.");
            setLoading(false);
            setError("You must be logged in to view account data.");
         }
      });

      return () => unsubscribe();
   }, []);

   if (loading) {
      return <div>Loading...</div>;
   }

   if (error) {
      return <div>Error: {error}</div>;
   }

   const defaultPersonalBests = {
      time: { 15: null, 30: null, 60: null },
      words: { 10: null, 25: null, 50: null },
   };

   return (
      <>
         <div>Account</div>
         <PersonalBests {...(personalBests ?? defaultPersonalBests)} />
         {data && data.length > 0 && <HistoryTable data={data} />}
      </>
   );
}
export default Account;
