function storeState() {
  var el = document.getElementsByTagName("canvas")[0];
  localStorage.canvasData = el.toDataURL();
  console.log("storing " + localStorage.canvasData);
}

function restoreState() {
  if (localStorage.canvasData) {
    var el = document.getElementsByTagName("canvas")[0];
    var img = document.createElement('img');
    var ctx = el.getContext("2d");
    img.src = localStorage.canvasData;
    ctx.drawImage(img, 0, 0);
    console.log("restoring " + localStorage.canvasData);
  }
}