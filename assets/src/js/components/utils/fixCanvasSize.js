module.exports.fixCanvasSize = () => {

  [...document.querySelectorAll("canvas")].map(canvas => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  })

};
