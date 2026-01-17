const errorMapping: { [key: string]: string } = {
   // Login errors
   "auth/invalid-credential": "Email or password is incorrect.",
   "auth/invalid-email": "The email address is not valid.",
   "auth/user-disabled": "This account has been disabled.",
   "auth/user-not-found": "No user found with this email.",
   "auth/wrong-password": "The password is incorrect.",

   // Registration errors
   "auth/email-already-exists": "This email is already registered.",
   "auth/email-already-in-use": "This email is already in use.",
   "auth/weak-password": "The password is too weak.",
   "auth/operation-not-allowed": "Email/password accounts are not enabled.",

   // General errors
   "auth/too-many-requests": "Too many attempts. Please try again later.",
   "auth/network-request-failed":
      "Network error. Please check your connection.",
   "auth/internal-error": "An internal error occurred. Please try again.",
   "auth/invalid-api-key": "Invalid API key.",
};

export default errorMapping;
