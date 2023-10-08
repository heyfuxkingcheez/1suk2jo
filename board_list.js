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

const dArr = [];1
const docs = await getDocs(d);
// console.log(docs);

// 글 번호
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

// console.log(bigDocs)

// 페이징
let viewArr = [];
// 전체 data 배열
let dataArr = [];
//id값 같이 넣기
bigDocs.forEach((ds) => {
  dataArr.push(ds);
});
console.log(dataArr)

//페이지 숫자 담아서 붙여줄 배열
let pageArr = [];

function page(){
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

}
page();
function viewFunc() {
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
        </td>
        <td class="listAutor">${writeName}</td>
        <td class="listDate">${when}</td>
        <td class="listViews">${howMany}</td>
        </tr>`;

      $("#listCard").append(append_html);

    }
  });
}


//조회수 기능
viewArr.forEach((eachDoc) => {
  for (let i = 0; i < eachDoc.length; i++) {
    let num = eachDoc[i].num;
    let howMany = eachDoc[i].howMany;
    let ID = eachDoc[i].ID;
    $("#listCard").click(async function (e) {
      e.preventDefault();
      let clickNum = e.target.previousElementSibling.innerText;
      if (clickNum === num) {
        console.log('번호')
        // //조회수 데이터 수정하기
        let newHowMany = howMany + 1;
        console.log('새로운 howMany =>', newHowMany)
        async function howManyFun(){
          let b = doc(db, "board", ID);
          await updateDoc(b, { howMany: newHowMany });
          // alert('과연'); //페이지 넘어가기 전에 콘솔 확인하려고 만들었어요
        }
        // //클릭한 게시물 보여주도록
        window.location.href = `board_view.html?ID=" +${num}`;
      }
    })
  }
});

//forEach 문에 파라미터 eachDoc 으로 바꿨어요 __ 바꾸니까 데이터 수정기능 동작하더라구요

// pagination
// 누르는 페이지 마다 class=active; 추가, 색상 변경
$(".paging").click(async function (e) {
  $(".active").removeClass("active");
  $(e.target).addClass("active");
});

//검색
// $(document).ready(function () {
//   $("#searchBtn").click(function (e) {
//     let k = $(searchInput).val(); //searchInput 값 지정
//     // console.log(k)
//     $("tr").hide(); // tr 요소를 숨김
//     let temp = $("tr:contains('" + k + "')"); // tr요소 중 contains()의 값과 비교해서 지정
//     if (temp.length == 0) {
//       $("#listCard").append(`<tr><td>검색 결과가 없습니다.</td></tr>`); // 결과가 없을때
//     } else {
//       $(temp).show(); // 결과가 있을때 지정된 temp를 보여줌
//     }
//   });

// });

//검색 기능
$("#searchBtn").on('click', function (e){
  e.preventDefault();
  searchFun();
});

$("#searchInput").on('keyup',function (e){
  e.preventDefault();
  if(e.keyCode == 13 || e.which ==13){
    searchFun();
  }
});

function searchFun (){
  let search = $("#searchInput").val();
  //입력값과 동일한 데이터만 가져오기
  let same = bigDocs.filter(function(data){
    return data.writeTitle.includes(search) || 
            data.writeName.includes(search)
  })
  
  //게시글 번호 + 데이터 붙여넣기
  let sameLength = same.length;

  if(sameLength>0){
    //페이지 번호, 목록 비워주고, 표 분류 보여주기
    $(".pages").empty();
    $("tr").show();
    $("#listCard").html('');
  
    //입력값과 동일한 데이터만 가져오기
    let same = bigDocs.filter(function(data){
      return data.writeTitle.includes(search) || 
              data.writeName.includes(search)
    })
    
    //게시글 번호 + 데이터 붙여넣기
    let sameLength = same.length;
    same.forEach((ed)=>{
      let num = ed.num;
      let howMany = ed.howMany;
      let ID = ed.ID;
      $("#listCard").append(`
        <tr>
          <td class="listNum">${sameLength}</td>
          <td style = 'display : none'>${num}</td>
          <td class="listTitle">${ed.writeTitle}</td>
          <td class="listAutor">${ed.writeName}</td>
          <td class="listDate">${ed.when}</td>
          <td class="listViews">${ed.howMany}</td>
        </tr> 
      `)
      sameLength--;

      // console.log('num=>',num)
      // console.log('howMany=>',howMany)
      // console.log('ID=>',ID)

      //조회수 기능 + 클릭하면 이동하는 기능
      $("#listCard").click(async function (e) {
        console.log(e.target.previousElementSibling)
        let clickNum = e.target.previousElementSibling.innerText;
        if (clickNum === num) {
          console.log('num=>',num)
          console.log('clickNum=>',clickNum)

          console.log('번호')
          // //조회수 데이터 수정하기
          let newHowMany = howMany + 1;
          console.log('새로운 howMany =>', newHowMany)
          async function howManyFun(){
            let b = doc(db, "board", ID);
            await updateDoc(b, { howMany: newHowMany });
            // alert('과연'); //페이지 넘어가기 전에 콘솔 확인하려고 만들었어요
          }
          // //클릭한 게시물 보여주도록
          window.location.href = `board_view.html?ID=" +${num}`;
        }
      })

    })
  }
  else{
    console.log(sameLength)
    console.log('입력값 없음');
    $("tr").hide()
    $("#listCard").append(`<tr><td>검색 결과가 없습니다.</td><tr>`);
    $(".pages").empty();
    let pageNumHtml = `
      <span id="page1">1</span>
    `;
    $(".pages").append(pageNumHtml);
  }
  //입력값이 있으면 

    /////페이지./////////////////
    //페이지 개수 구하기
    // pageArr = [];
    // for (let i = 0; i < sameLength; i += 5) {
    //   console.log(i)
    //   // 빈 배열에 특정 길이만큼 분리된 배열 추가
    //   let sameSlice = same.slice(i, i + 5)
    //   console.log(sameSlice);
    //   pageArr.push(sameSlice);
    // }
    // console.log(pageArr); 
    // console.log(same)
  
    // // 있는 게시글 만큼 페이지 숫자 append
    // for (let i =0; i < pageArr.length+1; i++) {
    //   if (pageArr.length <= 1) {
    //       console.log('페이지 1개')
    //       let pageNumHtml = `
    //         <span id="page1">1</span>
    //       `;
    //       $(".pages").append(pageNumHtml);
    //   } else {
    //     let pageNumHtml = `
    //       <span id="page${i}">${i}</span>
    //     `;
    //       $(".pages").append(pageNumHtml);
    //   }
    // }

};
