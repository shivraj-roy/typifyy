import { useState } from "react";
import { TypeZone } from "../components";

const Home = () => {
   const [testStart, setTestStart] = useState(false);

   return <TypeZone setTestStart={setTestStart} testStart={testStart} />;
};

export default Home;
