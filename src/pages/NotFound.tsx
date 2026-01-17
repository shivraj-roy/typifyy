import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import IconButton from "../components/ui/IconButton";
import useDocumentTitle from "../hooks/useDocumentTitle";

const NotFound = () => {
   useDocumentTitle("404 - Page Not Found");
   const navigate = useNavigate();

   const handleGoHome = () => {
      navigate("/");
   };

   return (
      <div className="flex items-center justify-center min-h-[60vh] px-4 py-8">
         <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 max-w-4xl">
            {/* Meme Image */}
            <div className="flex-shrink-0">
               <img
                  src="/assets/404-meme.jpeg"
                  alt="404 Not Found"
                  className="w-48 h-48 md:w-64 md:h-64 rounded-lg object-cover"
               />
            </div>

            {/* Text Content */}
            <div className="flex flex-col items-center md:items-start gap-6 text-center md:text-left">
               {/* 404 Text */}
               <h1 className="text-7xl md:text-8xl font-medium text-accent">
                  404
               </h1>

               {/* Description */}
               <p className="text-base md:text-lg text-primary max-w-sm">
                  Ooops! Looks like this page or resource doesn't exist.
               </p>

               {/* Go Home Button */}
               <div className="w-full md:w-auto md:min-w-[200px]">
                  <IconButton
                     icon={<FaHome size={18} />}
                     text="Go Home"
                     onClick={handleGoHome}
                  />
               </div>
            </div>
         </div>
      </div>
   );
};

export default NotFound;
