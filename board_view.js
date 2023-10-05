import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {doc, updateDoc, deleteField, deleteDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  //값 입력
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);




//데이터 삭제.
$('#delete').click(async function(e){
  e.preventDefault();
  console.log('gt');
  //삭제 예시
  // const desertRef = doc(db, [컬렉션명], [도큐멘트명], [하위컬렉션명], [삭제할 도큐멘트명]);
  // await deleteDoc(desertRef);
  let dodo = doc(db, 'eatJoo', 'one');
  await deleteDoc(dodo);
})