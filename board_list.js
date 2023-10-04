// 게시판 제목 특정 길이 넘으면 줄여주기
let str = document.querySelector(".tdTitle").innerHTML;
let cutStr = str.substring(0, 60) + " ...";

document.querySelector(".tdTitle").innerHTML = cutStr;
