import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBrA9nWF9qR0_cpURhAcZ5HnyhyGMVVjrY",
  authDomain: "alohaparty-ig.firebaseapp.com",
  projectId: "alohaparty-ig",
  storageBucket: "alohaparty-ig.firebasestorage.app",
  messagingSenderId: "997053959987",
  appId: "1:997053959987:web:37974caeec53c7b0273846",
  measurementId: "G-YMWYE44559"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
