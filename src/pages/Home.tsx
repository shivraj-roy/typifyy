import { useState } from "react";
import { TypeZone } from "../components";
import useDocumentTitle from "../hooks/useDocumentTitle";

const Home = () => {
   useDocumentTitle(""); // Uses default: "Typifyy | Test Your Typing Speed"
   const [testStart, setTestStart] = useState(false);

   return <TypeZone setTestStart={setTestStart} testStart={testStart} />;
};

export default Home;
