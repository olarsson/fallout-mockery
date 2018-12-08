module.exports.playerAttacking = (that, BOXSIZE) => {

  if (!(that.player.state === 2)) return;

  let _anim = that.player.animations;

  if ((Date.now() - that.player.animation.startTime) > 100) {
    that.player.animation.startTime = Date.now();
    if (!that.player.temp.haveBeenRun) that.player.temp.attackStep++;
    if (that.player.temp.attackStep >= _anim.attack.totalFrames) {
      that.player.temp.haveBeenRun = true;
      that.player.temp.attackStep = 0;
    }
  }

  let imgIndex = that.CONSTANTS.cordPrioritiesList.indexOf(
    that.positions.playerPos.FACING.x +
    that.positions.playerPos.FACING.y
  );

  that.canvas.drawImage(
    that.paint.img.playerAttacking, //image source
    _anim.attack.clipX * that.player.temp.attackStep, //clip from X in original image 44
    imgIndex * _anim.attack.clipY, //clip from Y in original image 68
    _anim.attack.width, //sourceWidth (constant)
    _anim.attack.height, //sourceHeight (constant)
    that.positions.playerPos.HEX.PX.x - _anim.attack.offsetX, //paint to X in canvas
    that.positions.playerPos.HEX.PX.y - _anim.attack.offsetY, //paint to Y in canvas
    _anim.attack.width, //destWidth (constant)
    _anim.attack.height, //destHeight (constant)
  );

};
