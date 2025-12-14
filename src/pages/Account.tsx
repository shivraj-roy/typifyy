import { useEffect, useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { User } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import HistoryTable from "../components/HistoryTable";

function Account() {
   const [data, setData] = useState<any[] | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

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
               const resultsData = querySnapshot.docs.map((doc) => doc.data());
               if (resultsData.length > 0) {
                  console.log("Documents data:", resultsData);
                  setData(resultsData);
               } else {
                  console.log("No documents found for this user!");
                  setError("No data found for this user.");
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

   return (
      <>
         <div>Account</div>
         {data && <HistoryTable data={data} />}
      </>
   );
}
export default Account;
