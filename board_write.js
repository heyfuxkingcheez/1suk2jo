import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

import { db } from "./firebase.js";

let docs;
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
  let date = String(now.getDate()).padStart(2, "0");
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
  let commentPWF = $("#pwF").val();
  let commentPWS = $("#pwS").val();

  var newID = function () {
    return Math.random().toString(36).substr(2, 16);
  };

  var commentID = function () {
    return Math.random().toString(36).substr(2, 16);
  };

  docs = {
    writeTitle: writeTitle,
    writeText: writeText,
    writeName: writeName,
    when: when,
    num: newID(),
    howMany: 0,
    nowDate: time,
    // commentNum: commentID(),
    commentPWF: commentPWF,
    commentPWS: commentPWS,
  };
  console.log("commentPw=>", commentPWF);
  if (commentPWF === "" || commentPWS === "") {
    alert("비밀번호를 입력해 주세요");
  } else if (commentPWF != "" || commentPWS != "") {
    console.log(docs);
    let add = addDoc(collection(db, "board"), docs);
    //데이터 저장하고 해당 아이디값 출력해 봤어요
    await add.then((ID) => console.log(ID.id));
    alert("저장 완료!");
    // const num = docs.num

    window.location.href = `board_view.html?ID=" +${docs.num}`;
  }
});

// 댓글 비밀번호 일치 확인
$("#pwF").on("input", function () {
  console.log("keyup");
  $("#chkNotice").html("");
});

$("#pwS").on("input", function () {
  //첫번째 비번 입력 값이 없을때, 비번알림창 안보이게
  if ($("#pwF").val() === "") {
    $("#chkNotice").css("display", "none");
  }
  //첫번째 비번값 과 두번째 비번값 다르면 비번 일치하지 않는다 알려주기
  else if ($("#pwF").val() !== $("#pwS").val()) {
    $("#chkNotice")
      .css("display", "block")
      .css("background-color", "red")
      .css("color", "white");
    $("#chkNotice").html("비밀번호 일치하지 않음");
  } else if ($("#pwF").val() === $("#pwS").val()) {
    $("#chkNotice")
      .css("display", "block")
      .css("background-color", "transparent")
      .css("color", "white");
    $("#chkNotice").html("비밀번호 일치함<br><br>");
  }
});
