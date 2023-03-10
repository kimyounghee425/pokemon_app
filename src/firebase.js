// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD_ET3xjF-NLOpvnMFkxMcUnVfNCU_CDtE",
    authDomain: "react-poke-app-e92ad.firebaseapp.com",
    projectId: "react-poke-app-e92ad",
    storageBucket: "react-poke-app-e92ad.appspot.com",
    messagingSenderId: "729117616519",
    appId: "1:729117616519:web:fb38b8f3c89fdd46800b22"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;