import { FiUserPlus } from "react-icons/fi";
import { useState } from "react";
import { FaCheck, FaGithub, FaGoogle, FaSignInAlt } from "react-icons/fa";
import {
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   signInWithPopup,
   GoogleAuthProvider,
} from "firebase/auth";
import { Bounce, toast } from "react-toastify";
import InputAndIndicator from "../components/ui/InputAndIndicator";
import IconButton from "../components/ui/IconButton";
import { auth } from "../firebaseConfig";
import CustomToast from "../components/ui/CustomToast";
import errorMapping from "../utils/errorMapping";

const Login = () => {
   const [username, setUsername] = useState("");
   const [email, setEmail] = useState("");
   const [verifyEmail, setVerifyEmail] = useState("");
   const [password, setPassword] = useState("");
   const [verifyPassword, setVerifyPassword] = useState("");
   const [rememberMe, setRememberMe] = useState(true);

   // Login form state
   const [loginEmail, setLoginEmail] = useState("");
   const [loginPassword, setLoginPassword] = useState("");

   const validateUsername = (value: string) => {
      if (value.length < 6) {
         return {
            valid: false,
            error: "username must be at least 6 characters",
         };
      }
      return { valid: true };
   };

   const validateEmail = (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
         return { valid: false, error: "invalid email" };
      }
      return { valid: true };
   };

   const validateVerifyEmail = (value: string) => {
      if (value !== email) {
         return { valid: false, error: "emails do not match" };
      }
      return { valid: true };
   };

   const validatePassword = (value: string) => {
      if (value.length < 8) {
         return {
            valid: false,
            error: "password must be at least 8 characters",
         };
      }
      if (!/[A-Z]/.test(value)) {
         return {
            valid: false,
            error: "password must contain at least 1 capital letter",
         };
      }
      if (!/[0-9]/.test(value)) {
         return {
            valid: false,
            error: "password must contain at least 1 number",
         };
      }
      if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
         return {
            valid: false,
            error: "password must contain at least 1 special character",
         };
      }
      return { valid: true };
   };

   const validateVerifyPassword = (value: string) => {
      if (value !== password) {
         return { valid: false, error: "passwords do not match" };
      }
      return { valid: true };
   };

   // Check if all fields are valid for registration
   const isRegisterFormValid = () => {
      return (
         validateUsername(username).valid &&
         validateEmail(email).valid &&
         validateVerifyEmail(verifyEmail).valid &&
         validatePassword(password).valid &&
         validateVerifyPassword(verifyPassword).valid
      );
   };

   const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!isRegisterFormValid()) return;

      createUserWithEmailAndPassword(auth, email, password)
         .then((userCredential) => {
            const user = userCredential.user;
            // todo: also send the verification email

            toast(
               <CustomToast
                  type="success"
                  title="Success"
                  message="Account created"
               />,
               {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: false,
                  transition: Bounce,
               }
            );
            console.log("Registered user:", user);
         })
         .catch((error) => {
            toast(
               <CustomToast
                  type="error"
                  title="Error"
                  message={
                     errorMapping[error.code] || "An unexpected error occurred."
                  }
               />,
               {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: false,
                  transition: Bounce,
               }
            );
            console.error("Registration error:", error.code, error.message);
         });
   };

   const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!loginEmail || !loginPassword) {
         toast(
            <CustomToast
               type="info"
               title="Notice"
               message="Please fill all the fields"
            />,
            {
               position: "top-right",
               autoClose: 5000,
               hideProgressBar: true,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: false,
               transition: Bounce,
            }
         );
         return;
      }

      signInWithEmailAndPassword(auth, loginEmail, loginPassword)
         .then((userCredential) => {
            const user = userCredential.user;
            toast(
               <CustomToast
                  type="success"
                  title="Success"
                  message="Login successful!"
               />,
               {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: false,
                  transition: Bounce,
               }
            );
            console.log("Logged in user:", user);
         })
         .catch((error) => {
            toast(
               <CustomToast
                  type="error"
                  title="Error"
                  message={
                     errorMapping[error.code] || "An unexpected error occurred."
                  }
               />,
               {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: false,
                  transition: Bounce,
               }
            );
            console.error("Login error:", error.code, error.message);
         });
   };

   const googleProvider = new GoogleAuthProvider();
   const handleGoogleSignIn = () => {
      signInWithPopup(auth, googleProvider)
         .then((result) => {
            const user = result.user;
            toast(
               <CustomToast
                  type="success"
                  title="Success"
                  message="Logged in with Google!"
               />,
               {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: false,
                  transition: Bounce,
               }
            );
            console.log("Google Sign-In user:", user);
         })
         .catch((error) => {
            toast(
               <CustomToast
                  type="error"
                  title="Error"
                  message={
                     errorMapping[error.code] || "An unexpected error occurred."
                  }
               />,
               {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: false,
                  transition: Bounce,
               }
            );
            console.error("Google Sign-In error:", error.code, error.message);
         });
   };

   // Todo: GitHub sign-in handler

   return (
      <>
         <div className="max-w-full h-full flex justify-around items-center">
            <div className="register-side w-72">
               <div className="title flex items-center">
                  <div className="icon w-9 h-9 flex items-center justify-center p-2">
                     <FiUserPlus size={22} />
                  </div>
                  <h2 className="text">register</h2>
               </div>

               <form
                  onSubmit={handleRegisterSubmit}
                  className="w-full gap-2 grid"
               >
                  <InputAndIndicator
                     type="text"
                     name="username"
                     placeholder="username"
                     value={username}
                     onChange={setUsername}
                     validator={validateUsername}
                  />
                  <InputAndIndicator
                     type="email"
                     name="email"
                     placeholder="email"
                     value={email}
                     onChange={setEmail}
                     validator={validateEmail}
                  />
                  <InputAndIndicator
                     type="email"
                     name="verify-email"
                     placeholder="verify email"
                     value={verifyEmail}
                     onChange={setVerifyEmail}
                     validator={validateVerifyEmail}
                  />
                  <InputAndIndicator
                     type="password"
                     name="password"
                     placeholder="password"
                     value={password}
                     onChange={setPassword}
                     validator={validatePassword}
                  />
                  <InputAndIndicator
                     type="password"
                     name="verify-password"
                     placeholder="verify password"
                     value={verifyPassword}
                     onChange={setVerifyPassword}
                     validator={validateVerifyPassword}
                  />
                  <IconButton
                     type="submit"
                     icon={<FiUserPlus size={20} />}
                     text="sign up"
                     disabled={!isRegisterFormValid()}
                  />
               </form>
            </div>
            <div className="login-side w-72 ">
               <div className="title flex items-center">
                  <div className="icon w-9 h-9 flex items-center justify-center p-2">
                     <FaSignInAlt size={22} />
                  </div>
                  <h2 className="text">login</h2>
               </div>

               <div className="providers flex gap-4 mb-2">
                  <IconButton
                     icon={<FaGoogle size={16} className="signInWithGoogle" />}
                     onClick={handleGoogleSignIn}
                  />
                  <IconButton
                     icon={<FaGithub size={16} className="signInWithGithub" />}
                  />
               </div>

               <form onSubmit={handleLoginSubmit} className="w-full gap-2 grid">
                  <div className="orWithLine flex items-center gap-5">
                     <div className="line h-1 w-full bg-dark-100/40 rounded-[0.5rem]" />
                     <div className="text text-glow">or</div>
                     <div className="line h-1 w-full bg-dark-100/40 rounded-[0.5rem]" />
                  </div>
                  <InputAndIndicator
                     type="email"
                     name="login-email"
                     placeholder="email"
                     value={loginEmail}
                     onChange={setLoginEmail}
                  />
                  <InputAndIndicator
                     type="password"
                     name="login-password"
                     placeholder="password"
                     value={loginPassword}
                     onChange={setLoginPassword}
                  />
                  <div
                     className="flex gap-2 items-center h-6 cursor-pointer"
                     onClick={() => setRememberMe(!rememberMe)}
                  >
                     <div className="w-5 h-5 rounded-sm bg-dark-100/40 border-[1.5px] border-transparent flex items-center justify-center">
                        {rememberMe && (
                           <FaCheck size={14} className="text-active" />
                        )}
                     </div>
                     <span className="text-sm">remember me</span>
                  </div>
                  <IconButton
                     type="submit"
                     icon={<FaSignInAlt size={20} />}
                     text="log in"
                  />
               </form>
               <button className="text-[0.75rem] w-full p-1.5 flex items-center justify-end text-glow-100/40 hover:text-glow-100 transition-colors cursor-pointer">
                  forget password?
               </button>
            </div>
         </div>
      </>
   );
};
export default Login;
