import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { collection, addDoc } from "@firebase/firestore";

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

// Initialize with a unique name
const app = initializeApp(firebaseConfig, 'comments-app');
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage, collection, addDoc };