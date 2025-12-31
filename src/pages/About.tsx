import {
   FaCode,
   FaGithub,
   FaHeart,
   FaKeyboard,
   FaLightbulb,
   FaRocket,
   FaBug,
   FaHandsHelping,
   FaPlay,
   FaUserCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const About = () => {
   return (
      <>
         <div className="pageAbout flex flex-col gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="section">
               <h1 className="text-3xl md:text-4xl text-active mb-4 font-semibold lowercase">
                  about typifyy
               </h1>
               <p className="text-base md:text-lg text-fade-100 leading-relaxed">
                  A minimalistic typing test to measure and improve your typing
                  speed... Inspired by{" "}
                  <a
                     href="https://monkeytype.com"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-active hover:text-glow-100 underline transition-colors"
                  >
                     Monkeytype
                  </a>
                  , built with a focus on simplicity and essential features...
               </p>
            </div>

            {/* Inspiration & Purpose */}
            <div className="section">
               <div className="flex items-center gap-2 mb-3">
                  <FaLightbulb className="text-active" size={20} />
                  <h2 className="text-xl md:text-2xl text-glow-100 lowercase">
                     why typifyy?
                  </h2>
               </div>
               <p className="text-sm md:text-base text-fade-100 leading-relaxed">
                  This project started as a way to sharpen my React and
                  TypeScript skills while building something fun and useful...
                  Monkeytype set the bar for typing tests, and Typifyy is my
                  take on creating a clean, focused typing experience...
               </p>
            </div>

            {/* Features */}
            <div className="section">
               <div className="flex items-center gap-2 mb-3">
                  <FaKeyboard className="text-active" size={20} />
                  <h2 className="text-xl md:text-2xl text-glow-100 lowercase">
                     features
                  </h2>
               </div>
               <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm md:text-base text-fade-100">
                  <li className="flex items-start gap-2">
                     <span className="text-active mt-1">•</span>
                     <span>Time-based & word-count test modes</span>
                  </li>
                  <li className="flex items-start gap-2">
                     <span className="text-active mt-1">•</span>
                     <span>Real-time WPM, accuracy & consistency</span>
                  </li>
                  <li className="flex items-start gap-2">
                     <span className="text-active mt-1">•</span>
                     <span>Live performance graphs</span>
                  </li>
                  <li className="flex items-start gap-2">
                     <span className="text-active mt-1">•</span>
                     <span>User accounts with Google sign-in</span>
                  </li>
                  <li className="flex items-start gap-2">
                     <span className="text-active mt-1">•</span>
                     <span>Personal best tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                     <span className="text-active mt-1">•</span>
                     <span>Activity heatmap visualization</span>
                  </li>
                  <li className="flex items-start gap-2">
                     <span className="text-active mt-1">•</span>
                     <span>Customizable settings & sounds</span>
                  </li>
                  <li className="flex items-start gap-2">
                     <span className="text-active mt-1">•</span>
                     <span>Keyboard shortcuts (tab + enter)</span>
                  </li>
               </ul>
            </div>

            {/* Tech Stack */}
            <div className="section">
               <div className="flex items-center gap-2 mb-3">
                  <FaCode className="text-active" size={20} />
                  <h2 className="text-xl md:text-2xl text-glow-100 lowercase">
                     built with
                  </h2>
               </div>
               <p className="text-sm md:text-base text-fade-100">
                  React 19 • TypeScript • Vite • Firebase • Tailwind CSS •
                  Chart.js
               </p>
            </div>

            {/* About Developer */}
            <div className="section">
               <div className="flex items-center gap-2 mb-3">
                  <FaHeart className="text-active" size={20} />
                  <h2 className="text-xl md:text-2xl text-glow-100 lowercase">
                     made by
                  </h2>
               </div>
               <p className="text-sm md:text-base text-fade-100 leading-relaxed">
                  Built by <span className="text-active">Shivraj Roy</span> as a
                  portfolio project... I'm a developer passionate about creating
                  clean, functional web experiences. This project helped me dive
                  deeper into React patterns, Firebase integration, and building
                  real-time interactive apps...
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <a
                     href="https://github.com/shivraj-roy/typifyy"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="cursor-pointer px-3.5 py-3.5 md:py-6 rounded-lg text-center text-sm md:text-2xl bg-dark-100/40 hover:bg-glow-100 hover:text-dark-100 transition-colors flex items-center justify-center gap-2"
                  >
                     <FaGithub size={20} />
                     GitHub
                  </a>
                  <a
                     href="https://github.com/shivraj-roy"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="cursor-pointer px-3.5 py-3.5 md:py-6 rounded-lg text-center text-sm md:text-2xl bg-dark-100/40 hover:bg-glow-100 hover:text-dark-100 transition-colors flex items-center justify-center gap-2"
                  >
                     <FaUserCircle size={20} />
                     Portfolio
                  </a>
               </div>
            </div>

            {/* Future Plans */}
            <div className="section">
               <div className="flex items-center gap-2 mb-3">
                  <FaRocket className="text-active" size={20} />
                  <h2 className="text-xl md:text-2xl text-glow-100 lowercase">
                     what's next?
                  </h2>
               </div>
               <p className="text-sm md:text-base text-fade-100 leading-relaxed mb-3">
                  Typifyy is a work in progress... Here are some exciting ideas
                  on the roadmap:
               </p>
               <ul className="list-none space-y-2 mb-4 text-sm md:text-base text-fade-100">
                  <li className="flex items-start gap-2">
                     <span className="text-active mt-1">•</span>
                     <span>
                        Error mapping in graph - visualize mistakes over time
                        like Monkeytype
                     </span>
                  </li>
                  <li className="flex items-start gap-2">
                     <span className="text-active mt-1">•</span>
                     <span>
                        Custom themes - personalize your typing experience
                     </span>
                  </li>
                  <li className="flex items-start gap-2">
                     <span className="text-active mt-1">•</span>
                     <span>
                        Music mode - integrate Spotify and visualize your typing
                        as soundwaves (experimental!)
                     </span>
                  </li>
                  <li className="flex items-start gap-2">
                     <span className="text-active mt-1">•</span>
                     <span>More settings & customization options</span>
                  </li>
                  <li className="flex items-start gap-2">
                     <span className="text-active mt-1">•</span>
                     <span>And many more features...</span>
                  </li>
               </ul>
               <p className="text-sm md:text-base text-fade-100 leading-relaxed mb-3">
                  If you have suggestions or find bugs, I'd love to hear from
                  you..!
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <a
                     href="https://github.com/shivraj-roy/typifyy/issues"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="cursor-pointer px-3.5 py-3.5 md:py-6 rounded-lg text-center text-sm md:text-2xl bg-dark-100/40 hover:bg-glow-100 hover:text-dark-100 transition-colors flex items-center justify-center gap-2"
                  >
                     <FaBug size={20} />
                     Report an Issue
                  </a>
                  <a
                     href="https://github.com/shivraj-roy/typifyy"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="cursor-pointer px-3.5 py-3.5 md:py-6 rounded-lg text-center text-sm md:text-2xl bg-dark-100/40 hover:bg-glow-100 hover:text-dark-100 transition-colors flex items-center justify-center gap-2"
                  >
                     <FaHandsHelping size={20} />
                     Contribute
                  </a>
                  <Link
                     to="/"
                     className="cursor-pointer px-3.5 py-3.5 md:py-6 rounded-lg text-center text-sm md:text-2xl activeBtn hover:bg-glow-100 transition-colors flex items-center justify-center gap-2 sm:col-span-2 lg:col-span-1"
                  >
                     <FaPlay size={20} />
                     Start Typing
                  </Link>
               </div>
            </div>

            {/* Footer Note */}
            <div className="section border-t border-fade/20 pt-6">
               <p className="text-xs md:text-sm text-fade text-center">
                  Special thanks to the{" "}
                  <a
                     href="https://monkeytype.com"
                     target="_blank"
                     rel="noopener noreferrer"
                     className="text-active hover:text-glow-100 underline transition-colors"
                  >
                     Monkeytype
                  </a>{" "}
                  for the inspiration and to the open-source community for
                  making projects like this possible...
               </p>
            </div>
         </div>
      </>
   );
};

export default About;
