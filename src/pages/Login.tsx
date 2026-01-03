import { FiUserPlus } from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaGoogle, FaRedo, FaSignInAlt } from "react-icons/fa";
import {
   createUserWithEmailAndPassword,
   signInWithEmailAndPassword,
   signInWithPopup,
   GoogleAuthProvider,
   updateProfile,
   sendPasswordResetEmail,
} from "firebase/auth";
import { Bounce, toast } from "react-toastify";
import InputAndIndicator from "../components/ui/InputAndIndicator";
import IconButton from "../components/ui/IconButton";
import Modal from "../components/ui/Modal";
import { auth } from "../firebaseConfig";
import CustomToast from "../components/ui/CustomToast";
import errorMapping from "../utils/errorMapping";
import useDocumentTitle from "../hooks/useDocumentTitle";

const Login = () => {
   useDocumentTitle("Login");
   const navigate = useNavigate();
   const [username, setUsername] = useState("");
   const [email, setEmail] = useState("");
   const [verifyEmail, setVerifyEmail] = useState("");
   const [password, setPassword] = useState("");
   const [verifyPassword, setVerifyPassword] = useState("");
   const [rememberMe, setRememberMe] = useState(true);

   // Login form state
   const [loginEmail, setLoginEmail] = useState("");
   const [loginPassword, setLoginPassword] = useState("");

   // Forgot password modal state
   const [showForgotPasswordModal, setShowForgotPasswordModal] =
      useState(false);
   const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

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

   // Check if forgot password email is valid
   const isForgotPasswordEmailValid = () => {
      return validateEmail(forgotPasswordEmail).valid;
   };

   const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!isRegisterFormValid()) return;

      try {
         const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password,
         );
         const user = userCredential.user;

         // Set the username as displayName
         await updateProfile(user, {
            displayName: username,
         });

         // Reload user to ensure updated profile is reflected in auth state
         await user.reload();

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
            },
         );
         console.log("Registered user:", user);
         navigate("/account");
      } catch (error: unknown) {
         const firebaseError = error as { code?: string; message?: string };
         toast(
            <CustomToast
               type="error"
               title="Error"
               message={
                  errorMapping[firebaseError.code || ""] ||
                  "An unexpected error occurred."
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
            },
         );
         console.error(
            "Registration error:",
            firebaseError.code,
            firebaseError.message,
         );
      }
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
            },
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
               },
            );
            console.log("Logged in user:", user);
            navigate("/account");
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
               },
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
               },
            );
            console.log("Google Sign-In user:", user);
            navigate("/account");
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
               },
            );
            console.error("Google Sign-In error:", error.code, error.message);
         });
   };

   // Todo: GitHub sign-in handler

   const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Client-side rate limiting (1 request per 2 minutes per device)
      const COOLDOWN_MS = 120000; // 2 minutes
      const lastResetTime = localStorage.getItem("lastPasswordResetTime");

      if (lastResetTime) {
         const timeSinceLastReset = Date.now() - parseInt(lastResetTime);
         if (timeSinceLastReset < COOLDOWN_MS) {
            toast(
               <CustomToast
                  type="error"
                  title="Too Many Requests"
                  message="You're doing that too fast. Please wait a moment before trying again."
               />,
               {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: true,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: false,
                  transition: Bounce,
               },
            );
            setShowForgotPasswordModal(false);
            setForgotPasswordEmail("");
            return;
         }
      }

      if (!forgotPasswordEmail || !validateEmail(forgotPasswordEmail).valid) {
         toast(
            <CustomToast
               type="error"
               title="Error"
               message="Please enter a valid email"
            />,
            {
               position: "top-right",
               autoClose: 5000,
               hideProgressBar: true,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: false,
               transition: Bounce,
            },
         );
         return;
      }

      try {
         await sendPasswordResetEmail(auth, forgotPasswordEmail);

         // Store timestamp to enforce client-side rate limiting
         localStorage.setItem("lastPasswordResetTime", Date.now().toString());

         toast(
            <CustomToast
               type="success"
               title="Request Received"
               message="Password reset request received. If the email is valid, a reset link has been sent."
            />,
            {
               position: "top-right",
               autoClose: 5000,
               hideProgressBar: true,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: false,
               transition: Bounce,
            },
         );
         setShowForgotPasswordModal(false);
         setForgotPasswordEmail("");
      } catch (error: unknown) {
         const firebaseError = error as { code?: string; message?: string };

         // Handle rate limiting specifically
         let errorMessage: string;
         if (firebaseError.code === "auth/too-many-requests") {
            errorMessage = "Request limit reached. Please try again later.";
         } else {
            errorMessage =
               errorMapping[firebaseError.code || ""] ||
               "Failed to send password reset email. Please try again.";
         }

         toast(
            <CustomToast type="error" title="Error" message={errorMessage} />,
            {
               position: "top-right",
               autoClose: 5000,
               hideProgressBar: true,
               closeOnClick: true,
               pauseOnHover: true,
               draggable: false,
               transition: Bounce,
            },
         );
         setShowForgotPasswordModal(false);
         setForgotPasswordEmail("");
         console.error(
            "Password reset error:",
            firebaseError.code,
            firebaseError.message,
         );
      }
   };

   return (
      <>
         <div className="w-full h-full flex flex-col md:flex-row justify-around items-center gap-12 md:gap-0">
            <div className="register-side w-full max-w-xs md:w-72">
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
            <div className="login-side w-full max-w-xs md:w-72">
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
                  {/* <IconButton
                     icon={<FaGithub size={16} className="signInWithGithub" />}
                  /> */}
               </div>

               <form onSubmit={handleLoginSubmit} className="w-full gap-2 grid">
                  <div className="orWithLine flex items-center gap-5">
                     <div className="line h-1 w-full bg-alt-bg rounded-[0.5rem]" />
                     <div className="text text-primary">or</div>
                     <div className="line h-1 w-full bg-alt-bg rounded-[0.5rem]" />
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
                     <div className="w-5 h-5 rounded-sm bg-alt-bg border-[1.5px] border-transparent flex items-center justify-center">
                        {rememberMe && (
                           <FaCheck size={14} className="text-accent" />
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
               <button
                  type="button"
                  onClick={() => setShowForgotPasswordModal(true)}
                  className="text-[0.75rem] w-full p-1.5 flex items-center justify-end text-secondary hover:text-primary transition-colors cursor-pointer"
               >
                  forget password?
               </button>
            </div>
         </div>

         {/* Forgot Password Modal */}
         <Modal
            isOpen={showForgotPasswordModal}
            onClose={() => setShowForgotPasswordModal(false)}
         >
            <div className="bg-bg rounded-lg p-8 max-w-[400px] w-full">
               <h2 className="text-2xl text-secondary mb-6 text-left">
                  Forgot password
               </h2>
               <form
                  onSubmit={handleForgotPassword}
                  className="w-full gap-4 grid"
               >
                  <InputAndIndicator
                     type="email"
                     name="forgot-password-email"
                     placeholder="email"
                     value={forgotPasswordEmail}
                     onChange={setForgotPasswordEmail}
                     validator={validateEmail}
                  />
                  <IconButton
                     type="submit"
                     icon={<FaRedo size={18} />}
                     text="submit"
                     disabled={!isForgotPasswordEmailValid()}
                  />
               </form>
            </div>
         </Modal>
      </>
   );
};
export default Login;
