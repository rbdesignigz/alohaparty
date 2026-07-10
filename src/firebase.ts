import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

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
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);

export { app, db, auth, googleProvider, storage };
