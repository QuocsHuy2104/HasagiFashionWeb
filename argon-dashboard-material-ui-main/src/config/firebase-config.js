// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCAnqFvW40Cu8k5NO3efXla4lQH5oLWE9Q",
    authDomain: "crud-app-js-4f2e0.firebaseapp.com",
    projectId: "crud-app-js-4f2e0",
    storageBucket: "crud-app-js-4f2e0.appspot.com",
    messagingSenderId: "1033943853265",
    appId: "1:1033943853265:web:bdedbd3f600d3681fcfdf0",
    measurementId: "G-R80SG9GLN8"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
