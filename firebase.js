// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBtJ_tvpZJ23X9DcKELEK3t_N2guUKrzzU",
  authDomain: "inventory-management-809b1.firebaseapp.com",
  projectId: "inventory-management-809b1",
  storageBucket: "inventory-management-809b1.appspot.com",
  messagingSenderId: "824208941517",
  appId: "1:824208941517:web:d7fe1d524ec503b6006484",
  measurementId: "G-D0VLB2W2Q5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}
