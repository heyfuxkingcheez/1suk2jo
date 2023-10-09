function donation() {
  alert("카카오뱅크 3333-05-9350021 예금주 김영우");
}

function openDiv() {
  if (document.getElementById("leftInner2").style.display === "none") {
    document.getElementById("leftInner2").style.display = "block";
    document.getElementById("arrow").style.transform = "rotate(-135deg)";
  } else {
    document.getElementById("leftInner2").style.display = "none";
    document.getElementById("arrow").style.transform = "rotate(45deg)";
  }
}
