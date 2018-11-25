module.exports.playerMoving = (that, BOXSIZE) => {

  if (!(that.player.state === 1)) return;

  let _anim = that.player.animations;

  if ((Date.now() - that.player.animation.startTime) > 70) {
    that.player.animation.startTime = Date.now();
    that.positions.playerPos.moveCounter++;
    if (that.positions.playerPos.moveCounter === _anim.moving.totalFrames) that.positions.playerPos.moveCounter = 0;
  }

  let imgIndex = that.CONSTANTS.cordPrioritiesListSmall.indexOf(
    that.positions.playerPos.FACING.x +
    that.positions.playerPos.FACING.y
  );

  if (imgIndex === -1) {

    imgIndex = that.positions.playerPos.previousImgStep;

    console.log('NOT FOUND!',
      that.positions.playerPos.FACING.x +
      that.positions.playerPos.FACING.y
    );

  } else {
    that.positions.playerPos.previousImgStep = imgIndex;
  }

  that.canvas.drawImage(
    that.paint.img.playerMoving, //image source
    _anim.moving.clipX * that.positions.playerPos.moveCounter, //clip from X in original image 44
    imgIndex * _anim.moving.clipY, //clip from Y in original image 68
    _anim.moving.width, //sourceWidth (constant)
    _anim.moving.height, //sourceHeight (constant)
    that.positions.playerPos.PX.x - _anim.moving.offsetX, //paint to X in canvas
    that.positions.playerPos.PX.y - _anim.moving.offsetY, //paint to Y in canvas
    _anim.moving.width, //destWidth (constant)
    _anim.moving.height, //destHeight (constant)
  );

};
