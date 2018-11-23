module.exports.bar = (that) => {

  that.canvasBar.drawImage(
    that.paint.img.bar, //image source
    0, //clip from X in original image
    0, //clip from Y in original image
    1100, //sourceWidth (constant)
    100, //sourceHeight (constant)
    0, //paint to X in canvas
    0, //paint to Y in canvas
    1100, //destWidth (constant)
    100, //destHeight (constant)
  );

};
