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
console.log(countAll.data().count);

let listNum = countAll.data().count + 1;

// list
let docs = await getDocs(que);
docs.forEach((doc) => {
  listNum--;
  let row = doc.data();
  let writeTitle = row["writeTitle"];
  let writeName = row["writeName"];
  let when = row["when"];
  console.log(docs);
  let append_html = `
  <tr>
      <td class="listNum">${listNum}</td>
      <td class="listTitle">
          <a href="board_view.html" id="tdTitle">
          ${writeTitle}
          </a>
      </td>
      <td class="listAutor">${writeName}</td>
      <td class="listDate">${when}</td>
      <td class="listViews">3</td>
  </tr>`;

  $("#listCard").append(append_html);
});
