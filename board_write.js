//파이어베이스 사용하기 위해 설정하기. scrip 타입은 module 로 설정. 
// Firebase SDK 라이브러리 가져오기
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhz3oCrk5Nc_j8BRiKrJ3f3ZQLwMOVfxw",
  authDomain: "sparta-639cc.firebaseapp.com",
  projectId: "sparta-639cc",
  storageBucket: "sparta-639cc.appspot.com",
  messagingSenderId: "801151721424",
  appId: "1:801151721424:web:48b10274ed3aa304f663d5",
  measurementId: "G-WBS5D55PCX"
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



// const writeFrm = document.querySelector('#writeFrm');
// writeFrm.addEventListener('submit', function(e){
//   e.preventDefault();
//   const subject = e.target.subject.value;
//   const content = e.target.content.value;
//   console.log(subject);
//   console.log(content);
// });

$('#submit').click(async function(){
  console.log('kkk')
  let write_title = $('#write_title').val();
  let write_text = $('#write_text').val();

  let doc = {'오' : 34443};
  // let doc = {
  //   'write_title' : write_title,
  //   'write_text' : write_text
  // }
  console.log('ekek');
  await addDoc(collection(db, "all"), doc);
  window.location.reload()
})


