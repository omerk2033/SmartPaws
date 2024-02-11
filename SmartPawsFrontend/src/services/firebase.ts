import { initializeApp, getApp } from "firebase/app";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from "firebase/auth";

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

// Initialize Firebase

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);

