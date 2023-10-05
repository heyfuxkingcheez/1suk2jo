import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
    collection,
    addDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { doc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBHruLjIXeoszzqiT2HSWT6nsIyKOEbeRU",
    authDomain: "sparta-e533a.firebaseapp.com",
    projectId: "sparta-e533a",
    storageBucket: "sparta-e533a.appspot.com",
    messagingSenderId: "176323692514",
    appId: "1:176323692514:web:bf9dc31cafca3ffbb29bbb",
    measurementId: "G-H5C27X8E9M"
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let docs = await getDocs(collection(db, "콜렉션이름"));
docs.forEach((doc) => {
    let row = doc.data();
    console.log(row);
}); 