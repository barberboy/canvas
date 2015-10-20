var lineWidth = 75;

function storeState() {
  var el = document.getElementsByTagName("canvas")[0];
  //localStorage.canvasData = el.toDataURL();
  console.log("storing " + localStorage.canvasData);
}

function restoreState() {
  if (localStorage.canvasData) {
    var el = document.getElementsByTagName("canvas")[0];
    var img = document.createElement('img');
    var ctx = el.getContext("2d");
    //   img.src =localStorage.canvasData; 
    //    ctx.drawImage(img,0,0);
    //    console.log("restoring " + localStorage.canvasData);
  }
}

function startup() {
  var el = document.getElementsByTagName("canvas")[0];
  el.addEventListener("touchstart", handleStart, false);
  el.addEventListener("touchend", handleEnd, false);
  el.addEventListener("touchcancel", handleCancel, false);
  el.addEventListener("touchmove", handleMove, false);

  restoreState();
  log("initialized.");
}

var ongoingTouches = new Array();

function handleStart(evt) {
  evt.preventDefault();
  log("touchstart.");
  var el = document.getElementsByTagName("canvas")[0];
  var ctx = el.getContext("2d");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    log("touchstart:" + i + "...");
    ongoingTouches.push(copyTouch(touches[i]));

    var color = colorForTouch(touches[i]);
    ctx.beginPath();
    ctx.arc(touches[i].pageX - (lineWidth / 4), touches[i].pageY - (lineWidth / 4), lineWidth / 2, 0, 2 * Math.PI, false); // a circle at the start
    ctx.fillStyle = color;
    ctx.fill();
    log(touches[i].pageX + " " + touches[i].pageY)
    log("touchstart:" + i + ".");
  }
}

function handleMove(evt) {
  evt.preventDefault();
  var el = document.getElementsByTagName("canvas")[0];
  var ctx = el.getContext("2d");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var color = colorForTouch(touches[i]);
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      log("continuing touch " + idx);
      ctx.beginPath();
      ctx.arc(ongoingTouches[i].pageX - (lineWidth / 4), ongoingTouches[i].pageY - (lineWidth / 4), lineWidth / 2, 0, 2 * Math.PI, false);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.fill();
      ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
      log(".");
    }
    else {
      log("can't figure out which touch to continue");
    }
  }
}

function handleEnd(evt) {
  evt.preventDefault();
  log("touchend");
  var el = document.getElementsByTagName("canvas")[0];
  var ctx = el.getContext("2d");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var color = colorForTouch(touches[i]);
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      ctx.lineWidth = lineWidth;
      ctx.fillStyle = color;
      ctx.beginPath();
      //ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      //ctx.lineTo(touches[i].pageX, touches[i].pageY);
      //ctx.fillRect(touches[i].pageX - lineWidth, touches[i].pageY - lineWidth, 8, 8);  // and a square at the end
      ongoingTouches.splice(idx, 1); // remove it; we're done
    }
    else {
      log("can't figure out which touch to end");
    }
  }
  storeState();
}

function handleCancel(evt) {
  evt.preventDefault();
  log("touchcancel.");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    ongoingTouches.splice(i, 1); // remove it; we're done
  }
}

function randBetween(x) {
  return Math.floor(Math.random() * x);
}

function colorForTouch(touch) {
  var r = touch.identifier % 16;
  var g = Math.floor(touch.identifier / 3) % 16;
  var b = Math.floor(touch.identifier / 6) % 16;
  r = r.toString(16); // make it a hex digit
  g = g.toString(16); // make it a hex digit
  b = b.toString(16); // make it a hex digit
  var color = "#" + r + g + b;
  log("color for touch with identifier " + touch.identifier + " = " + color);
  return color;
}

function copyTouch(touch) {
  return {
    identifier: touch.identifier,
    pageX: touch.pageX,
    pageY: touch.pageY
  };
}

function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;

    if (id == idToFind) {
      return i;
    }
  }
  return -1; // not found
}


var log = console.log.bind(console);

startup()