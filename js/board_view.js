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
  let commentName = row["commentName"];
  let commentText = row["commentText"];
  let coDate = row["date"];
  let num = row["num"];
  let when = row["when"];
  let commentNum = row["commentNum"];
  let commentPw = row["commentPw"];
  let id = eachdoc.id;
  let which;

  if (num === que) {
    which = id;
    let append_comment = `
    <div id="result" class="resultMsg">
      <span id="resultName">${commentName}
      <span id="new" style = 'display : none'>🆕</span>
      </span>
      <span id="resultContent">${commentText}</span>
      
      <div class="resultBottom">
      <div id="resultTime">${when}</div>
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

  })
});


// 게시글 DB불러오기
docs.forEach((eachDoc) => {
  let row = eachDoc.data();
  let writeTitle = row["writeTitle"];
  let writeName = row["writeName"];
  let when = row["when"];
  let writeText = row["writeText"];
  let num = row["num"];
  let id = eachDoc.id;
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
  //데이터 수정
  $("#modify").click(function (e) {
    e.preventDefault();
    window.location.href = `board_modify.html?ID=" +${que}`;
  });
  // console.log(which);

  //게시글 삭제
  $("#deleteContent").click(async function (e) {
    e.preventDefault();
    console.log(id);
    console.log(which);
    if (id === which) {
      if (confirm("정말 삭제 하시겠습니까?")) {
        await deleteDoc(doc(db, "board", which));
        window.location.href = "./board_list.html";
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
  var commentID = function () {
    return Math.random().toString(24).substr(2, 10);
  };

  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let date = now.getDate();
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
  if (data.commentName.length <= 0 || data.commentText.length <= 0) {
    return alert("내용을 입력해주세요.");
  } else if ($("#pwd1").val().length <= 0 || $("#pwd2").val().length <= 0) {
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
$(function () {
  $("#pwd1").keyup(function () {
    $("#chkNotice").html("");
  });

  $("#pwd2").keyup(function () {
    if ($("#pwd1").val() != $("#pwd2").val()) {
      $("#chkNotice").html("비밀번호 일치하지 않음<br><br>");
      $("#chkNotice").attr("color", "#f82a2aa3");
    } else {
      $("#chkNotice").html("비밀번호 일치함<br><br>");
      $("#chkNotice").attr("color", "#199894b3");
    }
  });
});
