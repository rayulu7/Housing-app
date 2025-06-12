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

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBG9wVS6U2umtf3GysqWXAsuHDir2_UkIw",
  authDomain: "housing-2244c.firebaseapp.com",
  projectId: "housing-2244c",
  storageBucket: "housing-2244c.firebasestorage.app",
  messagingSenderId: "435662766238",
  appId: "1:435662766238:web:ff3219de830b317b3b3b8f"
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