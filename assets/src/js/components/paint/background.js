module.exports.background = (that) => {

  that.canvas.drawImage(
    that.paint.img.bgDesert, //image source
    0, //clip from X in original image
    0, //clip from Y in original image
    960, //sourceWidth (constant)
    440, //sourceHeight (constant)
    0, //paint to X in canvas
    0, //paint to Y in canvas
    960, //destWidth (constant)
    440, //destHeight (constant)
  );

};