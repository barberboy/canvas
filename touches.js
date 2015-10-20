function init() {
  var body = document.body;
  var canvas = document.getElementById('canvas');

  // Force canvas full screen
  canvas.width = body.offsetWidth;
  canvas.height = body.offsetHeight;

  // Register touch listeners
  canvas.addEventListener("touchstart", handleTouch, false);
  canvas.addEventListener("touchmove", handleTouch, false);
  //canvas.addEventListener("touchend", handleTouch, false);

  // Register click listeners.
  body.addEventListener('mousedown', mousedown);
  body.addEventListener('mouseup', mouseup);
  canvas.addEventListener('mousemove', mousemove)
}

function handleTouch(evt) {
  //console.log("Touch");
  evt.preventDefault();
  var touches = evt.changedTouches;
  for (var i = 0; i < touches.length; i++) {
    var touch = touches[i];
    drawCircle(touch.pageX, touch.pageY, colorForId(touch.identifier));
  }
}

var mouseIsDown = 0;
var clickIdentifier = Math.floor(Math.random() * 100);

function mousedown(evt) {
  //console.log("Mousedown");
  evt.preventDefault();
  ++mouseIsDown;
  ++clickIdentifier;

  var coords = coordinates(evt);
  drawCircle(coords.x, coords.y, colorForId(clickIdentifier));
}

function mouseup(evt) {
  //console.log("Mouseup");
  evt.preventDefault();
  --mouseIsDown;
}

function mousemove(evt) {
  //console.log("Move");
  evt.preventDefault();
  if (mouseIsDown) {
    var coords = coordinates(evt);
    //console.log(coords);
    drawCircle(coords.x, coords.y, colorForId(clickIdentifier));
  }
}

function drawCircle(x, y, color) {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext("2d");
  var lineWidth = 75;

  ctx.beginPath();
  ctx.arc(x - (lineWidth / 4), y - (lineWidth / 4), lineWidth / 2, 0, 2 * Math.PI, false); // a circle at the start
  ctx.fillStyle = color;
  ctx.fill();
}

function randBetween(l, h) {
  return Math.floor(Math.random() * (h - l)) + l;
}

var saturation = randBetween(30, 100);
var lightness = randBetween(30, 90);

function colorForId(identifier) {
  var hue = (identifier % 18) * 20;
  var color = "hsl(" + hue + "," + saturation + "%," + lightness + "%)";
  //console.log(color);
  return color;
}

function coordinates(evt) {
  var canvas = document.getElementById('canvas');
  return {
    x: evt.clientX - canvas.offsetLeft,
    y: evt.clientY - canvas.offsetTop
  }
}

init();

function rgbColor(identifier) {
  var r = identifier % 16;
  var g = Math.floor(identifier / 3) % 16;
  var b = Math.floor(identifier / 6) % 16;
  r = r.toString(16); // make it a hex digit
  g = g.toString(16); // make it a hex digit
  b = b.toString(16); // make it a hex digit
  var color = "#" + r + g + b;
  return color;
}
