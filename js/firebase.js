import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYSaHmi8i4rAmiGvzul3EbIKvN5U8w-dk",
  authDomain: "muckgohajoo.firebaseapp.com",
  projectId: "muckgohajoo",
  storageBucket: "muckgohajoo.appspot.com",
  messagingSenderId: "371059776509",
  appId: "1:371059776509:web:8c70fb4cdde3e8657e9794",
  measurementId: "G-Q4PWG9P9CD",
};

// Firebase 인스턴스 초기화
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
