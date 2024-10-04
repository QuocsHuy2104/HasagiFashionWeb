// src/firebase.js
import firebase from 'firebase/app';
import 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyAD2gTt9GJhxsqO2g5YaShJdHnwnW2T74w",
    authDomain: "hasagifashion.firebaseapp.com",
    projectId: "hasagifashion",
    storageBucket: "hasagifashion.appspot.com",
    messagingSenderId: "707373139806",
    appId: "1:707373139806:web:164bc4be85171511caf1cf",
    measurementId: "G-XMRS7VPFD2"
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
