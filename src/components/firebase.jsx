// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  doc
} from "firebase/firestore";


console.log("Project ID:", import.meta.env.VITE_FIREBASE_PROJECT_ID);

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// ✅ Now set persistence AFTER auth is defined
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Firebase auth persistence enabled.");
  })
  .catch((error) => {
    console.error("Failed to enable persistence:", error);
  });

// Export everything needed
export {
  auth,
  db,
  createUserWithEmailAndPassword,
  signOut,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  doc
};