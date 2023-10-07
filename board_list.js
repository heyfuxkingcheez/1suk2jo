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
  startAt,
  endAt,
  startAfter,
  deleteDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
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
const board = collection(db, "board");
let lastVisibleDoc = null; //이전 페이지의 마지막 문서

const d = await query(board, orderBy("when", "desc"));

const dArr = [];
// const d = query(
//   collection(db, "board"),
//   orderBy("nowDate"),
//   startAfter(1696614628387),
//   limit(5)
// );

const docs = await getDocs(d);
console.log(docs);
// docs.forEach((ds) => {
//   dArr.push(ds.data());
// });
// console.log("디알알", dArr);

// 페이징

let viewArr = [];
// 전체 data 배열
let dataArr = [];
//id값 같이 넣기
docs.forEach((ds) => {
  dataArr.push([ds.data(), ds.id]);
});


//forEach 문에 파라미터 eachDoc 으로 바꿨어요 __ 바꾸니까 데이터 수정기능 동작하더라구요
docs.forEach((eachDoc) => {
  //데이터의 문서id 값 출력해 봤어요
  // console.log(eachDoc.id);
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
  let limitLength = 20;
  if (writeTitle.length > limitLength) {
    writeTitle = writeTitle.substr(0, limitLength - 2) + "...";
  }  
  console.log(dataArr);
})
let pageArr = [];
for (let i = 0; i < dataArr.length; i += 5) {
  // 빈 배열에 특정 길이만큼 분리된 배열 추가
  pageArr.push(dataArr.slice(i, i + 5));
}
console.log(pageArr.length);

// 있는 게시글 만큼 페이지 숫자 append
for (let i = 2; i <= pageArr.length; i++) {
  if (pageArr.length <= 1) {
    console.log("data 5개 이하 1페이지만 존재");
  } else {
    let pageNumHtml = `
    <span id="page${i}">${i}</span>
  `;
    $(".pages").append(pageNumHtml);
  }
}

let totalPageNumArr = [];
for (let i = 1; i <= pageArr.length; i++) {
  totalPageNumArr.push(i);
}
// console.log(totalPageNumArr); // [1, 2, 3, 4]

for (let page_num of totalPageNumArr) {
  if (page_num === 1) {
    viewArr.push(pageArr[0]);
    viewFunc();

  }
  $(`#page${page_num}`).click((e) => {
    let slicePageNum = Number(e.target.id.slice(-1)); // "1"
    viewArr = [];
    $("#listCard").empty();
    // console.log(page);

    if (slicePageNum === page_num) {
      viewArr.push(pageArr[slicePageNum - 1]);
      viewFunc();
    } else {
      console.log("mm");
    }
    console.log(viewArr);
  });
}

function viewFunc() {
  viewArr.forEach((eachDoc) => {
    // console.log(dataArr.length);
    for (let i = 0; i < eachDoc.length; i++) {
      console.log(eachDoc[i]);
      let writeTitle = eachDoc[i][0].writeTitle;
      let writeName = eachDoc[i][0].writeName;
      let when = eachDoc[i][0].when;
      let num = eachDoc[i][0].num;
      // console.log();
      console.log(num);
      let howMany = eachDoc[i].howMany;
      // let id = eachDoc[i][1];
      // console.log(id)
      // console.log(writeTitle, writeName, when, num, howMany, id);
      // 제목 너무 길면 줄이고 말줄임(...) 처리,
      // css로 하니 다 깨져서 css는 삭제했슴당
      let limitLength = 35;
      console.log(writeTitle)
      if (writeTitle.length > limitLength) {
        writeTitle = writeTitle.substr(0, limitLength - 2) + "...";
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

      $("#listCard").click(async function (e) {
        e.preventDefault();
        let clickNum = parseInt(e.target.previousElementSibling.innerText);
        console.log(typeof clickNum)
        if (clickNum === num) {
          //조회수 데이터 수정하기
          let newHowMany = howMany + 1;
          // console.log(newHowMany );
          let b = doc(db, "board", id);
          await updateDoc(b, { howMany: newHowMany });
          // console.log(row['howMany']);
          // alert('과연'); //페이지 넘어가기 전에 콘솔 확인하려고 만들었어요.
          //클릭한 게시물 보여주도록
      
          window.location.href = `board_view.html?ID=" +${num}`;
        } else if (clickNum !== num) {
          // alert('존재하지 않는 게시글을 눌렀습니다.');
        }
      });
    }

    // console.log(writeTitle, writeName);
    // console.log(typeof writeTitle, typeof writeName);

    // let row = eachDocObj.data();
    // console.log(row);
  });
}

const countAll = await getCountFromServer(d);
// console.log(countAll.data().count);
var listNum = countAll.data().count + 1;

//forEach 문에 파라미터 eachDoc 으로 바꿨어요 __ 바꾸니까 데이터 수정기능 동작하더라구요



// pagination
// 누르는 페이지 마다 class=active; 추가, 색상 변경
$(".paging").click(async function (e) {
  $(".active").removeClass("active");
  $(e.target).addClass("active");
});

// jquery 에서 searchContent 값으로 DB값과 비교
$(document).ready(function () {
  $("#searchBtn").click(function (e) {
    let k = $(searchInput).val(); //searchInput 값 지정
    // console.log(k)
    $("tr").hide(); // tr 요소를 숨김
    let temp = $("tr:contains('" + k + "')"); // tr요소 중 contains()의 값과 비교해서 지정
    if (temp.length == 0) {
      $("#listCard").append(`<tr><td>검색 결과가 없습니다.</td></tr>`); // 결과가 없을때
    } else {
      $(temp).show(); // 결과가 있을때 지정된 temp를 보여줌
    }
  });

  // 엔터 눌렀을때 검색 되는 코드
  $("#searchInput").keyup(function (event) {
    let keyCode = event.keyCode ? event.keyCode : event.which;
    if (keyCode == 13) {
      let k = $(searchInput).val(); //searchInput 값 지정
      // console.log(k)
      $("tr").hide(); // tr 요소를 숨김
      let temp = $("tr:contains('" + k + "')"); // tr요소 중 contains()의 값과 비교해서 지정
      if (temp.length == 0) {
        $("#listCard").append(`<tr><td>검색 결과가 없습니다.</td></tr>`); // 결과가 없을때
      } else {
        $(temp).show(); // 결과가 있을때 지정된 temp를 보여줌
      }
    } else {
      return false;
    }
  });
});
