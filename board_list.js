import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

import { db } from "./firebase.js";

const board = collection(db, "board");
const d = await query(board, orderBy("when", "desc"));
const docs = await getDocs(d);

// 글 번호
let bigDocs = [];
let a = docs.size;
docs.forEach((data) => {
  let dat = {
    ...data.data(),
    index: a,
    ID: data.id,
  };
  bigDocs.push(dat);
  a--;
});

// console.log(bigDocs)

// 페이징
let viewArr = [];
// 전체 data 배열
let dataArr = [];
//id값 같이 넣기
bigDocs.forEach((ds) => {
  dataArr.push(ds);
});
console.log(dataArr);

//각페이지 당 보여줄 데이터 묶음들
let pageArr = [];
console.log(pageArr);

function pageFun() {
  viewArr = [];
  pageArr = [];
  //페이지 개수 구하기.
  for (let i = 0; i < dataArr.length; i += 5) {
    // 빈 배열에 특정 길이만큼 분리된 배열 추가
    pageArr.push(dataArr.slice(i, i + 5));
  }
  console.log("pageArr =>", pageArr);
  $(".pages").empty();
  // 있는 게시글 만큼 페이지 숫자 append

  let pageNumHtml = `<span  class="active" id="page1">1</span>`;
  $(".pages").append(pageNumHtml);

  for (let i = 2; i <= pageArr.length; i++) {
    let pageNumHtml = `
    <span id="page${i}">${i}</span>
    `;
    $(".pages").append(pageNumHtml);
  }

  //
  let totalPageNumArr = [];
  for (let i = 1; i <= pageArr.length; i++) {
    totalPageNumArr.push(i);
  }
  console.log("totalPageNumArr =>", totalPageNumArr); // [1, 2, 3, 4]

  for (let page_num of totalPageNumArr) {
    //첫번쨰 페이지 에는 그에 해당하는 데이터 보여줘.
    if (page_num === 1) {
      viewArr.push(pageArr[0]);
      viewFunc();
      console.log("viewArr=> ", viewArr);
    }

    //페이지 번호 클릭하면 각각의 것 보여줘.
    $(`#page${page_num}`).click((e) => {
      let slicePageNum = Number(e.target.id.slice(-1)); // "1"
      viewArr = [];
      $("#listCard").empty();
      // console.log(page);

      if (slicePageNum === page_num) {
        viewArr.push(pageArr[slicePageNum - 1]);
        console.log("viewArr=> ", viewArr);
        viewFunc();
      } else {
        console.log("mm");
      }
      console.log("viewArr=> ", viewArr);
    });
  }
}
pageFun();
function viewFunc() {
  // console.log(eachDoc)

  // 새 글 new 표시
  let arr = [];

  viewArr.forEach((eachDoc) => {
    // console.log(dataArr.length);
    for (let i = 0; i < eachDoc.length; i++) {
      // console.log(eachDoc[i]);
      let writeTitle = eachDoc[i].writeTitle;
      let writeName = eachDoc[i].writeName;
      let when = eachDoc[i].when;
      let num = eachDoc[i].num;
      // console.log(num);
      let howMany = eachDoc[i].howMany;
      let index = eachDoc[i].index;
      // console.log(index)
      let ID = eachDoc[i].ID;
      let date = eachDoc[i].nowDate;
      // console.log(ID)
      // console.log(writeTitle, writeName, when, num, howMany, id);
      console.log(date);
      arr.push(date);
      console.log(arr);

      // 제목 너무 길면 줄이고 말줄임(...) 처리,
      // css로 하니 다 깨져서 css는 삭제했슴당
      let limitLength = 35;
      if (writeTitle.length > limitLength) {
        writeTitle = writeTitle.substr(0, limitLength - 2) + "...";
      }
      let append_html = `
        <tr>
        <td class="listNum">${index}</td>
        <td style = 'display : none'>${num}</td>
        <td class="listTitle">
        ${writeTitle}
        <span id="new" style = 'display : none'>🆕</span>
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
        if (clickNum === num) {
          console.log("번호");
          // //조회수 데이터 수정하기
          let newHowMany = howMany + 1;
          console.log("새로운 howMany =>", newHowMany);
          let b = doc(db, "board", ID);
          await updateDoc(b, { howMany: newHowMany });
          // alert('과연'); //페이지 넘어가기 전에 콘솔 확인하려고 만들었어요
          // //클릭한 게시물 보여주도록
          window.location.href = `board_view.html?ID=" +${num}`;
        }
      });
    }
    // 새 글 new 표시
    let newDate = new Date().getTime();
    console.log(newDate);

    for (let i = 0; i < arr.length; i++) {
      console.log(newDate - `${arr[i]}`);
      if (newDate - `${arr[i]}` < 1800000) {
        $("#new").css("display", "block");
      }
    }
  });
}

// pagination
// 누르는 페이지 마다 class=active; 추가, 색상 변경
$(".paging").click(async function (e) {
  $(".active").removeClass("active");
  $(e.target).addClass("active");
});

//검색 기능
$("#searchBtn").on("click", function (e) {
  // e.preventDefault();
  searchFun();
});

$("#searchInput").on("keyup", function (e) {
  e.preventDefault();
  if (e.keyCode === 13 || e.which === 13) {
    searchFun();
  }
});

function searchFun() {
  let search = $("#searchInput").val();
  //입력값과 동일한 데이터만 가져오기
  let same = bigDocs.filter(function (data) {
    return data.writeTitle.includes(search) || data.writeName.includes(search);
  });

  //게시글 번호 + 데이터 붙여넣기
  let sameLength = same.length;

  if (sameLength > 0) {
    //처음에 썻던 페이지 네이션 활용
    $("#listCard").empty();
    dataArr = [];
    viewArr = [];
    pageArr = [];
    // let totalPageNumArr = [];
    console.log("same =>", same);
    same.forEach((data) => {
      dataArr.push(data);
    });
    console.log(dataArr);
    pageFun();
  } else {
    console.log(sameLength);
    console.log("입력값 없음");
    $("tr").hide();
  }
  $("#listCard").append(`<tr><td>검색 결과가 없습니다.</td><tr>`);
  $(".pages").empty();
  let pageNumHtml = `
      <span id="page1">1</span>
    `;
  $(".pages").append(pageNumHtml);
}
