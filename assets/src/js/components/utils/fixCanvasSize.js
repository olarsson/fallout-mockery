module.exports.fixCanvasSize = () => {
  var canvases = document.getElementsByTagName("canvas");
  for (var i=0; i<canvases.length; i++) {
    let canvas = canvases[i];
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    console.log(canvas.offsetWidth);
  }
};
