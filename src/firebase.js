import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCr1tELHgab98Q8MJA8cgJZGHpq9gHT7JY",
  authDomain: "miki-portofilio.firebaseapp.com",
  databaseURL: "https://miki-portofilio-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "miki-portofilio",
  storageBucket: "miki-portofilio.firebasestorage.app",
  messagingSenderId: "67331128231",
  appId: "1:67331128231:web:a809947822783d07035482",
  measurementId: "G-X3GPEB0FDK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);