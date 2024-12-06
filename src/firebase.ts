// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAd2E2w-Pk6AA4Wd0A6PiQ7FRc3R3xB0gs",
  authDomain: "pokemon-app0425.firebaseapp.com",
  projectId: "pokemon-app0425",
  storageBucket: "pokemon-app0425.firebasestorage.app",
  messagingSenderId: "1049462385999",
  appId: "1:1049462385999:web:a46822a1d68b117e91a93a",
  measurementId: "G-0NWQGJ669H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;