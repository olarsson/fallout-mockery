module.exports.mouseCursor = (that) => {

  that.canvas.drawImage(
    that.paint.img.cursorCurrent, //image source
    0, //clip from X in original image
    0, //clip from Y in original image
    28, //sourceWidth (constant)
    23, //sourceHeight (constant)
    that.positions.mousePointer.PX.x, //paint to X in canvas
    that.positions.mousePointer.PX.y, //paint to Y in canvas
    28, //destWidth (constant)
    23, //destHeight (constant)
  );

};
