import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  collection,
  addDoc,
  getCountFromServer,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import {
  orderBy,
  query,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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

const board = collection(db, "board");
const que = await query(board, orderBy("when", "desc"));
const countAll = await getCountFromServer(que);
// console.log(countAll.data().count);

let listNum = countAll.data().count + 1;
// list
let docs = await getDocs(que);
docs.forEach((eachDoc) => {
  //데이터의 문서id 값 출력해 봤어요
  console.log(eachDoc.id);

  listNum--;
  let row = eachDoc.data();
  let writeTitle = row["writeTitle"];
  let writeName = row["writeName"];
  let when = row["when"];
  let num = row['num'].toString();
  var howMany = row['howMany'];

  let id = eachDoc.id;

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

  $(document).click(async function (e) {
    e.preventDefault();    
    let clickNum = e.target.previousElementSibling.innerText;
    console.log(clickNum);
    console.log(writeTitle)

    if(clickNum === num){
      let newHowMany = howMany+ 1;
      // let numHowMany = Number(newHowMany)+1
      console.log(newHowMany )
      let b = doc(db, 'board', id);
      await updateDoc(b, {howMany : newHowMany});

      console.log(row['howMany']);
      alert('과연');
      window.location.href = `board_view.html?ID=" +${num}`;
    }else if(clickNum !== num){
      // alert('존재하지 않는 게시글을 눌렀습니다.');
    }
  })
});
