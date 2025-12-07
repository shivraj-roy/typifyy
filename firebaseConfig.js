import firebase from "firebase/app";
import "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's firebase configuration
const firebaseConfig = {
   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
   appId: import.meta.env.VITE_FIREBASE_APP_ID,
   measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// initialize firebase
const app = firebase.initializeApp(firebaseConfig);

// initialize service
const auth = firebase.auth();
const db = getFirestore(app);

export { auth, db };
