module.exports.fixCanvasSize = () => {

  var canvas = document.getElementById("canvas");
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

};
