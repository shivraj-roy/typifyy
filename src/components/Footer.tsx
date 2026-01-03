import {
   FaCode,
   FaCodeBranch,
   FaDonate,
   FaEnvelope,
   FaPaintBrush,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import TextButton from "./ui/TextButton";
import packageJson from "../../package.json";

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
         <div
            className={`keyTips text-[0.7em] text-secondary mb-4 lg:mt-4 transition-opacity duration-300 ${
               testInProgress ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
         >
            <kbd className="text-bg bg-secondary py-0.5 px-1.5 rounded-sm">
               tab
            </kbd>{" "}
            +{" "}
            <kbd className="text-bg bg-secondary py-0.5 px-1.5 rounded-sm">
               enter
            </kbd>{" "}
            - restart test
         </div>
         <div
            className={`grid grid-cols-[1fr_max-content] gap-4 md:gap-8 transition-opacity duration-300 ${
               testInProgress ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
         >
            <div className="left grid grid-flow-row md:grid-flow-col gap-1 md:gap-4 text-left justify-start">
               <TextButton
                  icon={<FaEnvelope size={15} />}
                  text="contact"
                  href="https://www.linkedin.com/in/shivraj-roy10/"
                  target="_blank"
                  rel="noopener noreferrer"
               />
               {/* <TextButton icon={<FaDonate size={15} />} text="support" /> */}
               <TextButton
                  icon={<FaCode size={15} />}
                  text="github"
                  href="https://github.com/shivraj-roy/typifyy"
                  target="_blank"
                  rel="noopener noreferrer"
               />
            </div>
            <div className="right grid grid-flow-row md:grid-flow-col gap-1 md:gap-4 justify-end text-right">
               <TextButton
                  icon={<FaPaintBrush size={15} />}
                  text="made by shivraj"
               />
               <TextButton
                  icon={<FaCodeBranch size={15} />}
                  text={`v${packageJson.version}`}
                  className="justify-end"
               />
            </div>
         </div>
      </>
   );
};
export default Footer;
