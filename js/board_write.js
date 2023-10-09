import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

import { db } from "./firebase.js";

$("#writeFrm").submit(async function (e) {
  e.preventDefault();

  if (document.getElementById("writeTitle").value == "") {
    alert("제목을 입력하세요");
    return false;
  }

  if (document.getElementById("writeName").value == "") {
    alert("닉네임을 입력하세요");
    return false;
  }

  if (document.getElementById("writeText").value == "") {
    alert("내용을 입력하세요");
    return false;
  }

  //저장한 시간 가져오기.

  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let date = now.getDate();
  let hours = String(now.getHours()).padStart(2, "0");
  let minutes = String(now.getMinutes()).padStart(2, "0");
  let second = String(now.getSeconds()).padStart(2, "0");
  let time = now.getTime();

  console.log(time);

  let when = `${year}.${month}.${date} ${hours}:${minutes}`;
  console.log(when, second);

  let writeTitle = $("#writeTitle").val();
  let writeText = $("#writeText").val();
  let writeName = $("#writeName").val();

  var newID = function () {
    return Math.random().toString(36).substr(2, 16);
  };

  // console.log(writeTitle, writeName, writeText);
  // const boardData = await query(board);
  // const boardDataGet = await getDocs(d);
  // bocs[-1]
  let docs;
  docs = {
    writeTitle: writeTitle,
    writeText: writeText,
    writeName: writeName,
    when: when,
    num: newID(),
    howMany: 0,
    nowDate: time,
  };
  // const num = docs.num.toString();
  console.log(docs);
  let add = addDoc(collection(db, "board"), docs);
  //데이터 저장하고 해당 아이디값 출력해 봤어요
  await add.then((ID) => console.log(ID.id));
  alert("저장 완료!");
  // const num = docs.num

  window.location.href = `board_view.html?ID=" +${docs.num}`;
  // window.location.href = 'board_view.html?ID =${newID()}';
});
