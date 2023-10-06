import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getCountFromServer,
  getDocs,
  orderBy,
  query,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
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

const board = collection(db, "board");
const que = await query(board, orderBy("when", "desc"));
const countAll = await getCountFromServer(que);
// console.log(countAll.data().count);

let listNum = countAll.data().count + 1;
// list
let docs = await getDocs(que);

//forEach 문에 파라미터 eachDoc 으로 바꿨어요 __ 바꾸니까 데이터 수정기능 동작하더라구요
docs.forEach((eachDoc) => {
  //데이터의 문서id 값 출력해 봤어요
  console.log(eachDoc.id);

  listNum--;
  let row = eachDoc.data();
  let writeTitle = row["writeTitle"];
  let writeName = row["writeName"];
  let when = row["when"];
  let num = row["num"].toString();
  var howMany = row["howMany"];

  let id = eachDoc.id;

  // 제목 너무 길면 줄이고 말줄임(...) 처리,
  // css로 하니 다 깨져서 css는 삭제했슴당
  let limitLength = 35;
  if (writeTitle.length > limitLength) {
    writeTitle = writeTitle.substr(0, limitLength - 2) + "...";
  } else {
    return writeTitle;
  }

  let append_html = `
  <tr>
      <td class="listNum">${listNum}</td>
      <td style = 'display : none'>${num}</td>
      <td class="listTitle">
        ${writeTitle}
      </td>
      <td class="listAutor">${writeName}</td>
      <td class="listDate">${when}</td>
      <td class="listViews">${howMany}</td>
  </tr>`;

  $("#listCard").append(append_html);

  // console.log(writeTitle, writeName);
  // console.log(typeof writeTitle, typeof writeName);

  $(document).click(async function (e) {
    e.preventDefault();
    let clickNum = e.target.previousElementSibling.innerText;

    if (clickNum === num) {
      //조회수 데이터 수정하기
      let newHowMany = howMany + 1;
      // console.log(newHowMany );
      let b = doc(db, "board", id);
      await updateDoc(b, { howMany: newHowMany });
      // console.log(row['howMany']);

      alert("과연"); //페이지 넘어가기 전에 콘솔 확인하려고 만들었어요.

      //클릭한 게시물 보여주도록
      window.location.href = `board_view.html?ID=" +${num}`;
    } else if (clickNum !== num) {
      // alert('존재하지 않는 게시글을 눌렀습니다.');
    }
  });
});
