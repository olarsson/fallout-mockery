module.exports.playerBox = (that, BOXSIZE) => {

/*  that.canvas.drawImage(
    that.paint.img.char,
    that.positions.playerPos.PX.x - 34,
    that.positions.playerPos.PX.y - 34,
    68,68
  );*/

  let clipY = 1;

  that.canvas.drawImage(
    that.paint.img.char, //image source
    0, //clip from X in original image
    clipY * 70, //clip from Y in original image
    36, //sourceWidth (constant)
    70, //sourceHeight (constant)
    that.positions.playerPos.PX.x, //paint to X in canvas
    that.positions.playerPos.PX.y - 50, //paint to Y in canvas
    36, //destWidth (constant)
    70, //destHeight (constant)
  );

  that.canvas.fillStyle = '#fff';
  that.canvas.fillRect(
    that.positions.playerPos.PX.x,
    that.positions.playerPos.PX.y,
    BOXSIZE,BOXSIZE
  );

};
