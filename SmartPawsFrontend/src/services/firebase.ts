import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAH8qZDlMoBB9eXOAm8jTcVZ5nUSiiixiU",
    authDomain: "smartpaws-737b0.firebaseapp.com",
    projectId: "smartpaws-737b0",
    storageBucket: "smartpaws-737b0.appspot.com",
    messagingSenderId: "705125060479",
    appId: "1:705125060479:web:36cba5968e87222210544a",
    measurementId: "G-646F7VX1QG"
};

// Initialize Firebase app
let FIREBASE_APP;
if (getApps().length === 0) {
  FIREBASE_APP = initializeApp(firebaseConfig);
} else {
  FIREBASE_APP = getApp(); // If already initialized, use that instance
}

// Initialize Firebase services
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);

export default {
  FIREBASE_APP,
  FIREBASE_AUTH,
  FIRESTORE_DB,
  FIREBASE_STORAGE
};