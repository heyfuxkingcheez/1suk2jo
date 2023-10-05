import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

import {doc, setDoc, deleteDoc} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {

};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


$('#writeFrm').submit(async function(e){
  e.preventDefault();
  //저장한 시간 가져오기.
  let now = new Date();
  
  let year = now.getFullYear();
  let month = now.getMonth();
  let date = now.getDate();
  let hours = now.getHours();
  let minutes = now.getMinutes();

  let when = `${year}.${month}.${date}  ${hours}:${minutes}`;
  console.log(when);

  let writeTitle = $('#writeTitle').val();
  let writeText = $('#writeText').val();
  let writeName = $('#writeName').val();

  console.log(writeTitle, writeName, writeText);
  let docs = {
    'writeTitle' : writeTitle,
    'writeText' : writeText,
    'writeName' : writeName,
    'when' : when
  }
  console.log(docs)
  await setDoc(doc(db, "board", '5'), docs);
  alert("저장 완료!");
  window.location.reload()
});