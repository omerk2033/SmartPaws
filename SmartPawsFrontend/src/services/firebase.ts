import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};

// Initialize Firebase app
let FIREBASE_APP;
if (getApps().length === 0) {
  FIREBASE_APP = initializeApp(firebaseConfig);
  console.log(firebaseConfig.apiKey); // just printing
  console.log(firebaseConfig.authDomain); // just printing
} else {
  FIREBASE_APP = getApp(); // If already initialized, use that instance
  console.log("FIREBASE_APP: " + FIREBASE_APP);
  console.log(firebaseConfig.apiKey); // just printing
  console.log(firebaseConfig.authDomain); // just printing
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
