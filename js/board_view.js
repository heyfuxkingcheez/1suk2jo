import {
  collection,
  addDoc,
  getDocs,
  doc,
  orderBy,
  query,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

import { db } from "./firebase.js";

//데이터 보여주기
let docs = await getDocs(collection(db, "board"));
// let comment = await getDocs(collection(db, "comments"));
const comments = collection(db, "comments");
const d = await query(comments, orderBy("date", "asc"));
const docsd = await getDocs(d);
let que = window.location.search.substr(11);

// 댓글 DB불러오기
docsd.forEach((eachdoc) => {
  let row = eachdoc.data();
  let commentName = decodeURIComponent(row["commentName"]);
  let commentText = decodeURIComponent(row["commentText"]);
  let coDate = row["date"];
  let num = row["num"];
  let when = row["when"];
  let commentNum = row["commentNum"];
  let commentPw = row["commentPw"];
  let id = eachdoc.id;
  let which;
  console.log("when=>", when);

  when = when.substr(0, 10);
  console.log("when=>", when);

  if (num === que) {
    which = id;
    let append_comment = `
    <div id="result" class="resultMsg">
      <div class="resultBottom">
        <div id="resultName">${commentName} 
          <span id="new" style = 'display : none'>🆕</span>
        </div>
        <div id="resultTime">${when}</div>
        <div id="resultContent">${commentText}</div>
        <div id="DeleteBtn">
          <button class="" id="commentDelete">삭제
          <button style="display : none">${commentNum}</button>
        </div>
      </div> 
        
    </div>
    `;
    $("#result").append(append_comment);
  }
  // 댓글 삭제
  $("#commentField").click(async function (e) {
    e.preventDefault();
    let clickCoNum = e.target.nextElementSibling.innerText;
    //
    console.log("clickCoNum => ", clickCoNum);
    console.log("commentNum =>", commentNum);
    if (clickCoNum === commentNum) {
      const pw = prompt("삭제 비밀번호를 입력해주세요.");
      if (pw === commentPw) {
        await deleteDoc(doc(db, "comments", which));
        window.location.reload();
      } else {
        alert("비밀번호가 올바르지 않습니다..");
      }
    } else {
      return false;
    }
  });
});

//해당 게시글의 비밀번호 가져오기 위한 변수 선언;
let dataPW;

// 게시글 DB불러오기
docs.forEach((eachDoc) => {
  let row = eachDoc.data();
  let writeTitle = decodeURIComponent(row["writeTitle"]);
  let writeName = decodeURIComponent(row["writeName"]);
  let when = row["when"];
  let writeText = row["writeText"];
  let num = row["num"];
  let id = eachDoc.id;
  let commentPWF = row["commentPWF"];
  let which;
  // console.log(writeTitle, writeText, writeName, when)
  // console.log(row);
  console.log("num =>", num);
  console.log("que =>", que);
  if (num === que) {
    console.log("같으");
    console.log(row);
    which = id;
    const append_html = `
      <div id="subject">
        <span><span class = "bold">제 목 : </span>${writeTitle}</span>
      </div>
      <div id="wirter">
        <span><span class = "bold">작성자 : </span>${writeName}</span>  
      </div>
      <div id="date">
        <span><span class = "bold">작성일 : </span>${when}</span>  
      </div>
      <div id="content">
        <pre>${writeText}</pre>  
      </div>
    `;
    $("#viewFrm").append(append_html);
    dataPW = commentPWF;
  }
  console.log("commentPw=>", commentPWF);
  console.log("dataPW =>", dataPW);

  //게시글 삭제
  $("#deleteContent").click(async function (e) {
    e.preventDefault();
    console.log(id);
    console.log(which);
    if (id === which) {
      if (confirm("정말 삭제 하시겠습니까?")) {
        const pw = prompt("비밀번호를 입력해 주세요");
        if (pw === commentPWF) {
          await deleteDoc(doc(db, "board", which));
          window.location.href = "./board_list.html";
        } else {
          alert("비밀번호가 올바르지 않습니다");
        }
      } else {
        return false;
      }
    }
    //삭제 예시
    // const desertRef = doc(db, [컬렉션명], [도큐멘트명], [하위컬렉션명], [삭제할 도큐멘트명]);
    // await deleteDoc(desertRef);
  });
});

//데이터 수정
$("#modify").click(function (e) {
  e.preventDefault();
  const pw = prompt("비밀번호를 입력해 주세요");
  if (pw === null) {
    console.log("pw=>", pw);
    return false;
  } else if (pw !== null || pw !== "") {
    console.log(1);
    console.log("pw=>", pw);
    console.log("commentPWF=>", dataPW);
    if (pw === dataPW) {
      console.log("pw같니");
      alert("작성자 맞으시군요!");
      window.location.href = `board_modify.html?ID=" +${que}`;
    } else {
      console.log("pw달라");
      alert("비밀번호가 올바르지 않습니다");
      return false;
    }
    return false;
  }
  // return false;
});

// 댓글 기능 추가
$("#commentBtn").click(async function (e) {
  e.preventDefault();
  let query = window.location.search.substr(11);
  var commentID = function () {
    return Math.random().toString(24).substr(2, 10);
  };

  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let date = String(now.getDate()).padStart(2, "0");
  let hours = String(now.getHours()).padStart(2, "0");
  let minutes = String(now.getMinutes()).padStart(2, "0");
  let second = String(now.getSeconds()).padStart(2, "0");

  let when = `${year}.${month}.${date} ${hours}:${minutes}:${second}`;
  console.log(when);

  const data = {
    commentName: $("#commentName").val(), // 댓글 닉네임 input value
    commentText: $("#commentText").val(), // 댓글 내용 input value
    date: new Date().getTime(), // 현재 시간 밀리세컨드
    when: when,
    num: query, // num id값
    commentNum: commentID(),
    commentPw: $("#pwd1").val(),
  };
  // 댓글 폼 규칙
  if (data.commentName.trim() ==  "" || data.commentText.trim() ==  "") {
    return alert("내용을 입력해주세요.");
  } else if ($("#pwd1").val().trim() == "" || $("#pwd2").val().trim() == "") {
    return alert("비밀번호를 입력해주세요.");
  } else if ($("#pwd1").val() != $("#pwd2").val()) {
    return alert("비밀번호를 일치하도록 입력해주세요.");
  } else {
    await addDoc(collection(db, "comments"), data);
    console.log(data);
    window.location.reload();
  }
});

// 댓글 비밀번호 일치 확인

// $("#pwd1").keyup(function () {
//   $("#chkNoticeCo").html("");
// });

$("#pwd1").on("input", function () {
  if ($("#pwd1").val() !== $("#pwd2").val()) {
    $("#chkNoticeCo").css("display", "block").css("color", "red");
    $("#chkNoticeCo").html("비밀번호 일치하지 않음<br><br>");
  } else if ($("#pwd1").val() == $("#pwd2").val()) {
    $("#chkNoticeCo").css("display", "block").css("color", "blue");
    $("#chkNoticeCo").html("비밀번호 일치함<br><br>");
  }
});

// 첫번재 비번 입력 값이 없을 때, 비번 알림창 안보이게
$("#pwd2").on("input", function () {
  if ($("#pwd1").val() == "") {
    $("#chkNoticeCo").css("diplay", "none");
  } else if ($("#pwd1").val() !== $("#pwd2").val()) {
    $("#chkNoticeCo").css("display", "block").css("color", "red");
    $("#chkNoticeCo").html("비밀번호 일치하지 않음<br><br>");
  } else if ($("#pwd1").val() === $("#pwd2").val()) {
    $("#chkNoticeCo").css("display", "block").css("color", "blue");
    $("#chkNoticeCo").html("비밀번호 일치함<br><br>");
  }
});
