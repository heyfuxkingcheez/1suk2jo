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
  apiKey: "AIzaSyBv1pzj-eVAsCap6_XVd3WpTydkWuEsZOY",
  authDomain: "ejoo-a1fd7.firebaseapp.com",
  projectId: "ejoo-a1fd7",
  storageBucket: "ejoo-a1fd7.appspot.com",
  messagingSenderId: "982632789909",
  appId: "1:982632789909:web:acc8b044fd5f40be1c289c"
};

// Firebase 인스턴스 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const board = collection(db, "board");
let lastVisibleDoc = null; //이전 페이지의 마지막 문서

const d = await query(board, orderBy("when", "desc"));

const dArr = [];
const docs = await getDocs(d);
console.log(docs);

let bigDocs = [];
let a = docs.size;
docs.forEach((data)=>{
  let dat =  {
    ...data.data(),
    index : a,
    ID : data.id
  } 
  bigDocs.push(dat)
  a--
})

console.log(bigDocs)

// 페이징
let viewArr = [];
// 전체 data 배열
let dataArr = [];
//id값 같이 넣기
bigDocs.forEach((ds) => {
  dataArr.push(ds);
});
console.log(dataArr)

let pageArr = [];

//페이지 개수 구하기.
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
      let writeTitle = eachDoc[i].writeTitle;
      let writeName = eachDoc[i].writeName;
      let when = eachDoc[i].when;
      let num = eachDoc[i].num;
      console.log(num);
      let howMany = eachDoc[i].howMany;
      let index = eachDoc[i].index;
      console.log(index)
      let ID = eachDoc[i].ID;
      console.log(ID)
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
        <td class="listNum">${index}</td>
        <td style = 'display : none'>${num}</td>
        <td class="listTitle">
        ${writeTitle}
        </td>
        <td class="listAutor">${writeName}</td>
        <td class="listDate">${when}</td>
        <td class="listViews">${howMany}</td>
        </tr>`;

      $("#listCard").append(append_html);

    //조회수 기능
      $("#listCard").click(async function (e) {
        e.preventDefault();
        let clickNum = e.target.previousElementSibling.innerText;
        console.log('clickNum => ', clickNum)
        console.log('num =>', num)
        if (clickNum === num) {
          console.log('조회수')
          console.log('기존 howMany =>', howMany)
          // //조회수 데이터 수정하기
          let newHowMany = howMany + 1;
          console.log('새로운 howMany =>', newHowMany)
          let b = doc(db, "board", ID);
          await updateDoc(b, { howMany: newHowMany });
          // // console.log(row['howMany']);
          alert('과연'); //페이지 넘어가기 전에 콘솔 확인하려고 만들었어요.
          // //클릭한 게시물 보여주도록

          window.location.href = `board_view.html?ID=" +${num}`;
        } else if (clickNum !== num) {
          // alert('존재하지 않는 게시글을 눌렀습니다.');
        }
      });

    }
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
