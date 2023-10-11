import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

import { db } from "./firebase.js";

//데이터베이스 연결
const board = collection(db, "board");

//데이터를 정렬한 쿼리를 넣어줌
const d = await query(board, orderBy("nowDate", "desc"));

//
const docs = await getDocs(d);

// 글 번호
//데이터 풀어서 새로운 배열형식의 객체 만들고 싶을때
let bigDocs = [];
//전체 데이터 사이즈
let a = docs.size;
docs.forEach((data) => {
  // console.log(...data.data());
  let dat = {
    //[{}, {}, {}]  =>
    //데이터 하나하나 가져오는데 {} 해제
    //데이터 풀어서 새로운 배열형식의 객체 만들고 싶을때
    ...data.data(),
    //글번호
    index: a,
    //아이디
    ID: data.id,
  };
  console.log(dat);
  console.log(dat["ID"]); //RMslxOXxZWAnJcAxmi1n
  //글번호 전체 데이터 숫자에서 하나씩 숫자 빼면서 새로운 키 벨류 넣어줌
  bigDocs.push(dat);

  //다음 데이터 에는 지금 값에서 -1 되도록 반복문 안에서 -- 연산자 사용
  a--;
});

console.log("bigDocs", bigDocs);

// 페이징

//보여줄 값들만 가지고 있는 배열(페이지에 보여줄 데이터 개수많큼 끊어서 넣어줄 예정)
let viewArr = [];

// 전체 data 배열
let dataArr = [];

//id값 추가된 데이터들 전체 데이터 배열에 넣어주기.
bigDocs.forEach((ds) => {
  dataArr.push(ds);
});
console.log("dataArr", dataArr);

//각페이지 당 보여줄 데이터 묶음들
let pageArr = [];
console.log(pageArr);

function pageFun() {
  //데이터가 쌓이지 않도록 한번 비워줌
  viewArr = [];
  pageArr = [];

  //페이지 개수 구하기.
  for (let i = 0; i < dataArr.length; i += 5) {
    // 빈 배열에 특정 길이만큼 분리된 배열 추가
    pageArr.push(dataArr.slice(i, i + 5));
  }
  console.log("pageArr =>", pageArr);

  //페이지 숫자들 안쌓이도록 지워준다.
  $(".pages").empty();
  // empty :  선택된 요소의 하위요소들만 제거
  // remove : 선택된요소를 포함, 하위요소들을 제거

  // 있는 게시글 만큼 페이지 숫자 append
  let pageNumHtml = `<span  class="active" id="page1">1</span>`;
  $(".pages").append(pageNumHtml);

  //1페이지는 항상 존재하니까 2부터 페이지 번호 추가.
  for (let i = 2; i <= pageArr.length; i++) {
    let pageNumHtml = `
    <span id="page${i}">${i}</span>
    `;
    $(".pages").append(pageNumHtml);
  }

  // 전체 데이터를 5개씩 잘라놨던 pageArr을 요소 하나하나 totalPageNumArr 넣어줌
  let totalPageNumArr = [];
  for (let i = 1; i <= pageArr.length; i++) {
    // console.log(p);
    totalPageNumArr.push(i);
  }
  console.log("totalPageNumArr =>", totalPageNumArr); // [1, 2, 3, 4]

  //페이지 넘에 따른 데이터 붙이기
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

      //데이터 계속 비워줘야, 아래로 계속 생기지 않음
      viewArr = [];
      $("#listCard").empty();
      // console.log(page);

      //내가 누른 페이지 번호와,
      if (slicePageNum === page_num) {
        //페이지마다 보여줄 데이터를 담은 애들을 요소를 지정하는데, slicePageNum -1을 가져옴
        //왜 -1 하냐면 데이터들을 페이지 숫자를 가져온거기 떄문에, 요소값들 맞게 가져오려면 배열은 0부터 시작함으로 -1 해야함
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

  viewArr.forEach((eachDoc) => {
    // console.log(dataArr.length);
    for (let i = 0; i < eachDoc.length; i++) {
      // console.log(eachDoc.id);
      console.log(eachDoc[i]);
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
        <span id="new" class = "new">🆕</span>
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
          // console.log("번호");

          // //조회수 데이터 수정하기
          let newHowMany = howMany + 1;
          console.log("새로운 howMany =>", newHowMany);

          //조건에 맞는 ID값 가진 데이터에 접근 할 예정
          let b = doc(db, "board", ID);
          //그 데이터에 접근해서 데이터 수정해줘
          await updateDoc(b, { howMany: newHowMany });
          // alert('과연'); //페이지 넘어가기 전에 콘솔 확인하려고 만들었어요
          // //클릭한 게시물 보여주도록
          window.location.href = `board_view.html?ID=" +${num}`;
        }
      });
    }
  });
}
// // 전체 글의 nowDate값 배열
//글 작성 시간 가져오기
let nDateArr = [];
for (let data of dataArr) {
  //데이터 각각의 요소의 nowDate 가져와서 새로운 배열에 넣어줌.
  let setData = data.nowDate;
  nDateArr.push(setData);
  // console.log(typeof data.when);
}

console.log("nDateArr", nDateArr);

// // 현재 시간 가져오기
let newDate = new Date().getTime();
console.log("newdate", newDate);

//글이 작성된 시간 가져오기
let btArr = [];

nDateArr.forEach((nDate) => {
  console.log(nDate);
  console.log(newDate);
  // 30분 전
  // 1000이면 초로 나눠지고 /60 은 분으로 나눠짐. 결과를 보면 ~~분이 나옴.
  // 원래 밀리 세컨 단위로 나오는데 1970년 부터 밀리세컨 이 나오기 때문에 이렇게 함.

  let betweenTime = Math.floor((newDate - nDate) / 1000 / 60);
  console.log("betweenTime", betweenTime);
  if (betweenTime < 30) {
    btArr.push(nDate);
    console.log("new");
  } else {
    $("#new").css("display", "none");
  }
  console.log("btArr", btArr);
});

// pagination
// 누르는 페이지 마다 class=active; 추가, 색상 변경
$(".paging").click(async function (e) {
  $(".active").removeClass("active");
  $(e.target).addClass("active");
});

//검색 기능
//클릭하면 검색되게
$("#searchBtn").on("click", function (e) {
  // e.preventDefault();
  searchFun();
});
//엔터치면 검색되게
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
    //검색값이 타이틀이 포함하는가? 아니면 검색값이 닉네임에 포함하는가?
    return data.writeTitle.includes(search) || data.writeName.includes(search);
  });

  //페이지 네이션
  //게시글 번호 + 데이터 붙여넣기
  let sameLength = same.length;

  if (sameLength > 0) {
    //처음에 썻던 페이지 네이션 활용
    $(".pages").empty();
    $("#listCard").empty();
    dataArr = [];
    viewArr = [];
    pageArr = [];
    // let totalPageNumArr = [];
    console.log("same =>", same);

    //검색값에 해당하는 데이터들을  dataArr을 비워주고 새로 넣음
    same.forEach((data) => {
      dataArr.push(data);
    });
    console.log(dataArr);
    pageFun();
  } else {
    console.log(sameLength);
    console.log("입력값 없음");
    //게시판에 있는 표 지워줘
    $("tr").hide();
    $("#listCard").append(`<tr><td>검색 결과가 없습니다.</td><tr>`);
    $(".pages").empty();
    let pageNumHtml = `
        <span id="page1" class = "active">1</span>
      `;
    $(".pages").append(pageNumHtml);
  }
}
