module.exports.playerStillFacing = (that, BOXSIZE) => {

  if (!(that.player.state === 0)) return;

  let _anim = that.player.animations;

  let imgIndex = that.CONSTANTS.cordPrioritiesListSmall.indexOf(
    that.positions.playerPos.FACING.x +
    that.positions.playerPos.FACING.y
  );

  let clipY = imgIndex;

  that.canvas.drawImage(
    that.paint.img.playerStill, //image source
    _anim.still.clipX, //clip from X in original image
    clipY * _anim.still.height, //clip from Y in original image
    _anim.still.width, //sourceWidth (constant)
    _anim.still.height, //sourceHeight (constant)
    that.positions.playerPos.PX.x - _anim.still.offsetX, //paint to X in canvas
    that.positions.playerPos.PX.y - _anim.still.offsetY, //paint to Y in canvas
    _anim.still.width, //destWidth (constant)
    _anim.still.height, //destHeight (constant)
  );

};
