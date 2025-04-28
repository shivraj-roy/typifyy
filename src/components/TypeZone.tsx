import { generate } from "random-words";
import { useState } from "react";

const TypeZone = () => {
   const [words, setWords] = useState<string[]>(() => generate(50) as string[]);

   return (
      <>
         <div className="max-w-full mx-auto overflow-hidden">
            <div className="text-3xl flex flex-wrap">
               {words.map((word, wordIndex) => (
                  <span
                     key={`${wordIndex}-${word}`}
                     className="my-[0.3rem] mx-2"
                  >
                     {word.split("").map((letter, letterIndex) => (
                        <span key={`${letterIndex}-${wordIndex}`}>
                           {letter}
                        </span>
                     ))}
                  </span>
               ))}
            </div>
         </div>
      </>
   );
};
export default TypeZone;
