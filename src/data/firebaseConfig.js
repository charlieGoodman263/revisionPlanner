// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyConbYhZ-pS3QZ0O8_skLge45DGzc7u3CY",
  authDomain: "revisionplanner-9b779.firebaseapp.com",
  projectId: "revisionplanner-9b779",
  storageBucket: "revisionplanner-9b779.firebasestorage.app",
  messagingSenderId: "896575139149",
  appId: "1:896575139149:web:4d2d7101214e4d1a439b04"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };