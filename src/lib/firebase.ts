import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDbSd9XRZ2hxx2rH1M94WdRNM5qkLmAqPY",
  authDomain: "higrow-db.firebaseapp.com",
  projectId: "higrow-db",
  storageBucket: "higrow-db.appspot.com",
  messagingSenderId: "642811327936",
  appId: "1:642811327936:web:89d2c18051248f2e8e0425",
  measurementId: "G-9QZ79FKM3W",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
