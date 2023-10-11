import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_q8i0qvughfCUPhJKLVExuCSK8c9CH8o",
  authDomain: "ttttt-e12a5.firebaseapp.com",
  projectId: "ttttt-e12a5",
  storageBucket: "ttttt-e12a5.appspot.com",
  messagingSenderId: "641001285899",
  appId: "1:641001285899:web:d3c1066df810b2ce459a0e",
  measurementId: "G-NWYQMZ1ZE4",
};

// Firebase 인스턴스 초기화
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
