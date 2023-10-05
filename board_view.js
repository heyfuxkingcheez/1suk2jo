import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  doc,
  updateDoc,
  deleteField,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyBv1pzj-eVAsCap6_XVd3WpTydkWuEsZOY",
  authDomain: "ejoo-a1fd7.firebaseapp.com",
  projectId: "ejoo-a1fd7",
  storageBucket: "ejoo-a1fd7.appspot.com",
  messagingSenderId: "982632789909",
  appId: "1:982632789909:web:40149b8fa66ce19b1c289c"
};
// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//데이터 삭제
$("#delete").click(async function (e) {
  e.preventDefault();

  console.log("gt");

  //삭제 예시
  // const desertRef = doc(db, [컬렉션명], [도큐멘트명], [하위컬렉션명], [삭제할 도큐멘트명]);
  // await deleteDoc(desertRef);

  // let dodo = doc(db, 'eatJoo', '5');
  // await deleteDoc(dodo);
  window.location.href = './board_list.html';
});

//데이터 보여주기
let docs = await getDocs(collection(db, "board"));
console.log(docs)
docs.forEach((doc) => {
  let row = doc.data();
  let writeTitle = row["writeTitle"];
  let writeName = row["writeName"];
  let when = row["when"];
  let writeText = row['writeText'];
  // let id = row[]
  console.log(row)
  // console.log(writeTitle, writeText, writeName, when)
  // console.log(docs);
  let append_html = `
    <div id="subject">
      <span>제목 : ${writeTitle}</span>
    </div>
    <div id="wirter">
      <span>작성자 : ${writeName}</span>  
    </div>
    <div id="date">
      <span>작성일 : ${when}</span>  
    </div>
    <div id="content">
      <span>내용 : ${writeText}</span>  
    </div>`

  $("#listCard").append(append_html);
});