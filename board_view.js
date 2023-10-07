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
  orderBy,
  query,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  // apiKey: "AIzaSyCcYRfJBHpKg9mG3EJp6urawO5OlhPHoIs",
  // authDomain: "soo-test-15c67.firebaseapp.com",
  // projectId: "soo-test-15c67",
  // storageBucket: "soo-test-15c67.appspot.com",
  // messagingSenderId: "239246841609",
  // appId: "1:239246841609:web:0ade4f7652e36060eba5d8",
  // measurementId: "G-7BLCRSRLW5"
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


//데이터 보여주기
let docs = await getDocs(collection(db, "board"));
// let comment = await getDocs(collection(db, "comments"));
const comments = collection(db,'comments');
const d = await query(comments, orderBy("date", "asc"));
const docsd = await getDocs(d);
let que = window.location.search.substr(11);

// 댓글 DB불러오기
docsd.forEach((eachdoc) => {
  let row = eachdoc.data();
  let commentName = row["commentName"];
  let commentText = row["commentText"];
  let date = row["date"];
  let num = row["num"];
  let id = eachdoc.id
  let which;

  if (num === que) {
    console.log("같음");
    console.log(row);
    which = id;
    let append_comment = `
      <span id="resultName">${commentName}</span>
      <span id="resultContent">${commentText}</span>
      <div id="resultTime">${date}</div>
    `;
    $("#result").append(append_comment);
  }
})

// 게시글 DB불러오기
docs.forEach((eachDoc) => {
  let row = eachDoc.data();
  let writeTitle = row["writeTitle"];
  let writeName = row["writeName"];
  let when = row["when"];
  let writeText = row["writeText"];
  let num = row["num"];
  let id = eachDoc.id
  let which;
  // console.log(writeTitle, writeText, writeName, when)
  // console.log(docs);
  if (num === query) {
    console.log("같으");
    console.log(row);
    which = id;
    const append_html = `
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
      </div>
    `;
    $("#viewFrm").append(append_html);
    
  }

  // console.log(which);

  //데이터 삭제
  $("#delete").click(async function (e) {
    e.preventDefault();
    console.log(id);
    if (id === which) {
      if (confirm("정말 삭제 하시겠습니까?")) {
        await deleteDoc(doc(db, 'board', which));
        window.location.href = './board_list.html';
      } else {
        return false;
      }
    }
    //삭제 예시
    // const desertRef = doc(db, [컬렉션명], [도큐멘트명], [하위컬렉션명], [삭제할 도큐멘트명]);
    // await deleteDoc(desertRef);

  });

});


// 댓글 기능 추가
$("#commentBtn").click(async function (e) {
  e.preventDefault();

  let query = window.location.search.substr(11);

  const data = {
    commentName: $("#commentName").val(), // 댓글 닉네임 input value
    commentText: $("#commentText").val(), // 댓글 내용 input value
    date: new Date().getTime(), // 현재 시간 밀리세컨드
    num: query // num id값
  };

  if (data.commentName.length <= 0 || data.commentText.length <= 0) {
    return alert('내용을 입력해주세요.');
  } else {
    await addDoc(collection(db, "comments"), data);
    console.log(data)
    window.location.reload()
  }
})

