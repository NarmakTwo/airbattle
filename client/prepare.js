var debug = document.getElementById("debug");
var ctx = document.getElementById("main").getContext("2d");
ctx.translate(400,300);
var canvas = document.getElementById("main");
canvas.style.display = "block";
var gameSpeed = 1;

function rndInt(min,max) {
  return Math.floor( Math.random() * (max + 1 - min) ) + min;
}

let fps = 60;
let dataForCheckFPS = {
  "old":performance.now(),
  "new":performance.now()
}
function checkFPS() {
  dataForCheckFPS.old = dataForCheckFPS.new;
  dataForCheckFPS.new = performance.now();
  fps = Math.round(1000/(dataForCheckFPS.new - dataForCheckFPS.old));
  gameSpeed = 60/fps;
  requestAnimationFrame(checkFPS);
}
checkFPS();