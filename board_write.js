import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

import {
  doc,
  setDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCcYRfJBHpKg9mG3EJp6urawO5OlhPHoIs",
  authDomain: "soo-test-15c67.firebaseapp.com",
  projectId: "soo-test-15c67",
  storageBucket: "soo-test-15c67.appspot.com",
  messagingSenderId: "239246841609",
  appId: "1:239246841609:web:0ade4f7652e36060eba5d8",
  measurementId: "G-7BLCRSRLW5",
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

$("#writeFrm").submit(async function (e) {
  e.preventDefault();
  //저장한 시간 가져오기.
  let now = new Date();

  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let date = now.getDate();
  let hours = String(now.getHours()).padStart(2, "0");
  let minutes = String(now.getMinutes()).padStart(2, "0");
  let second = String(now.getSeconds()).padStart(2, "0");


  let when = `${year}.${month}.${date}  ${hours}:${minutes}`;
  console.log(when);
  console.log(second);
  

  let writeTitle = $("#writeTitle").val();
  let writeText = $("#writeText").val();
  let writeName = $("#writeName").val();

  console.log(writeTitle, writeName, writeText);
  let docs = {
    writeTitle: writeTitle,
    writeText: writeText,
    writeName: writeName,
    when: when,
  };
  console.log(docs);
  await addDoc(collection(db, "board"), docs);
  alert("저장 완료!");

  window.location.reload();

});
