import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDIjkNCh3R7HB-nKIITqAocS1VNL23alME",
  authDomain: "habittracker-bd954.firebaseapp.com",
  projectId: "habittracker-bd954",
  storageBucket: "habittracker-bd954.firebasestorage.app",
  messagingSenderId: "1076497103476",
  appId: "1:1076497103476:web:ade7588f48aaba72992f21",
  measurementId: "G-8WLH4PH3RL",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
