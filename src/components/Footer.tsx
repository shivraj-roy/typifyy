import { FaCode, FaDonate, FaEnvelope, FaPaintBrush } from "react-icons/fa";
import { useEffect, useState } from "react";
import TextButton from "./ui/TextButton";

const Footer = () => {
   const [testInProgress, setTestInProgress] = useState(false);

   // Listen for test start/end events
   useEffect(() => {
      const handleTestStart = () => setTestInProgress(true);
      const handleTestEnd = () => setTestInProgress(false);

      window.addEventListener("testStartEvent", handleTestStart);
      window.addEventListener("testEndEvent", handleTestEnd);

      return () => {
         window.removeEventListener("testStartEvent", handleTestStart);
         window.removeEventListener("testEndEvent", handleTestEnd);
      };
   }, []);

   return (
      <>
         <div className={`keyTips text-[0.7em] text-fade-100 mb-4 lg:mt-4 transition-opacity duration-300 ${
            testInProgress ? "opacity-0 pointer-events-none" : "opacity-100"
         }`}>
            <kbd className="text-dark-100 bg-fade-100 py-0.5 px-1.5 rounded-sm">
               tab
            </kbd>{" "}
            +{" "}
            <kbd className="text-dark-100 bg-fade-100 py-0.5 px-1.5 rounded-sm">
               enter
            </kbd>{" "}
            - restart test
         </div>
         <div className={`grid grid-cols-[1fr_max-content] gap-4 md:gap-8 transition-opacity duration-300 ${
            testInProgress ? "opacity-0 pointer-events-none" : "opacity-100"
         }`}>
            <div className="left grid grid-flow-row md:grid-flow-col gap-1 md:gap-4 text-left justify-start">
               <TextButton icon={<FaEnvelope size={15} />} text="contact" />
               <TextButton icon={<FaDonate size={15} />} text="support" />
               <TextButton
                  icon={<FaCode size={15} />}
                  text="github"
                  href="https://github.com/shivrajroy/typifyy"
                  target="_blank"
                  rel="noopener noreferrer"
               />
            </div>
            <div className="right grid gap-4 justify-end text-right">
               <TextButton
                  icon={<FaPaintBrush size={15} />}
                  text="made by shroy"
               />
            </div>
         </div>
      </>
   );
};
export default Footer;
