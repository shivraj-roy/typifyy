import { useState } from "react";
import { Footer, Header, MenuBar, TypeZone } from "./components";

function App() {
   const [testStart, setTestStart] = useState(false);

   return (
      <>
         <div className="canvas">
            <Header />
            <MenuBar testStart={testStart} />
            <TypeZone setTestStart={setTestStart} testStart={testStart} />
            <Footer />
         </div>
      </>
   );
}

export default App;
