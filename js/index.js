$(document).ready(function () {
  $('#header').load('header.html');
  $('#footer').load('footer.html');
});

function copy() {
  var clipboard = new ClipboardJS('#copy');
  clipboard.on('success', function (e) {
    console.log('Copy');
  });
  clipboard.on('error', function (e) {
    console.log('Copy Failed');
  });
}

// function openDiv() {
//   if (document.getElementById('leftInner2').style.display === 'none') {
//     document.getElementById('leftInner2').style.display = 'block';
//     document.getElementById('arrow').style.transform = 'rotate(-135deg)';
//   } else {
//     document.getElementById('leftInner2').style.display = 'none';
//     document.getElementById('arrow').style.transform = 'rotate(45deg)';
//   }
// }
