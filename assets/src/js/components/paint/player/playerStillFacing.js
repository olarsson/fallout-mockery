module.exports.playerStillFacing = (that, BOXSIZE) => {

  if (!(that.player.state === 0)) return;

  let imgIndex = that.CONSTANTS.cordPrioritiesListSmall.indexOf(
    that.positions.playerPos.FACING.x +
    that.positions.playerPos.FACING.y
  );

  let clipY = imgIndex;

  that.canvas.drawImage(
    that.paint.img.charStill, //image source
    0, //clip from X in original image
    clipY * 70, //clip from Y in original image
    36, //sourceWidth (constant)
    70, //sourceHeight (constant)
    that.positions.playerPos.PX.x, //paint to X in canvas
    that.positions.playerPos.PX.y - 50, //paint to Y in canvas
    36, //destWidth (constant)
    70, //destHeight (constant)
  );

};
