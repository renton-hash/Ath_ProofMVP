// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6Xii4utOOWWSAEFIbDo5Xb7vFPa3qSVk",
  authDomain: "athproof-5d02f.firebaseapp.com",
  projectId: "athproof-5d02f",
  storageBucket: "athproof-5d02f.firebasestorage.app",
  messagingSenderId: "440163062635",
  appId: "1:440163062635:web:7e7ec6069f7fd1689bf22e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);

// FORCE BROWSER PERSISTENCE
// This ensures that when an admin logs in, they stay logged in even if they refresh the page.
setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error("Auth persistence error:", error);
  });