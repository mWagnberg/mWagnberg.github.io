var playerImage = document.getElementById('avatar');
var right = 39
var left = 37
var up = 38
var down = 40
var speedUp = 85
var speedDown = 68
var valueToMoveBy = 15;

window.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case down:
      playerImage.style.top = parseInt(playerImage.style.top, 10) + valueToMoveBy + 'px';
      break;
    case up:
      playerImage.style.top = parseInt(playerImage.style.top, 10) - valueToMoveBy + 'px';
      break;
    case left:
      playerImage.style.left = parseInt(playerImage.style.left, 10) - valueToMoveBy + 'px';
      break;
    case right:
      playerImage.style.left = parseInt(playerImage.style.left, 10) + valueToMoveBy + 'px';
      break;
    case speedUp:
      valueToMoveBy += 10
      break;
    case speedDown:
      valueToMoveBy -= 10
      break;
    default:
      return;
  }
});
// var canvas;
// var context;
// var rectX = 10
// var rectY = 10
// var speed = 15
// var right = 39
// var left = 37
// var up = 38
// var down = 40
// var speedUp = 85
// var speedDown = 68

// window.onload = function() {
//   canvas = document.getElementById("myCanvas");
//   context = canvas.getContext("2d");
//   fillRect()
// }

// function fillRect() {
//   context.beginPath();
//   context.fillStyle = "black";
//   context.fillRect(0, 0, canvas.width, canvas.height);

//   context.beginPath();
//   context.fillStyle = "#666666";

//   if (rectX < 0) {
//     rectX = 1870;
//   }
//   else if (rectX > 1890) {
//     rectX = 0;
//   }
//   if (rectY < 0) {
//     rectY = 670;
//   }
//   else if (rectY > 690) {
//     rectY = 0;
//   }
//   context.fillRect(rectX, rectY, 50, 50);
// }

// function onkeydown(e) {
//   if (e.keyCode == right) { 
//     rectX += speed;
//   } //right arrow
//   else if (e.keyCode == left) {
//     rectX -= speed;
//   } //left arrow
//   else if (e.keyCode == up) {
//     rectY -= speed;
//   } //up arrow
//   else if (e.keyCode == down) {
//     rectY += speed;
//   } //down arrow
//   else if (e.keyCode == speedUp) {
//     speed += 10
//   }
//   else if (e.keyCode == speedDown) {
//     speed -= 10
//   }
//   fillRect();
// }
// window.addEventListener("keydown", onkeydown);
