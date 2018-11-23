module.exports.playerGunFiring = (that, BOXSIZE) => {

  if (!(that.player.state === 2)) return;

  if ((Date.now() - that.player.animation.startTime) > 100) {
    that.player.animation.startTime = Date.now();
    if (!that.player.haveBeenRun) that.player.temp.attackStep++;
    if (that.player.temp.attackStep >= 5) {
      that.player.haveBeenRun = true;
      that.player.temp.attackStep = 0;
    }
  }

  let imgIndex = that.CONSTANTS.cordPrioritiesListSmall.indexOf(
    that.positions.playerPos.FACING.x +
    that.positions.playerPos.FACING.y
  );

/*  if (imgIndex === -1) {
    imgIndex = that.positions.playerPos.previousImgStep;
  } else {
    that.positions.playerPos.previousImgStep = imgIndex;
  }*/

  console.log(that.player.temp.attackStep);

  that.canvas.drawImage(
    that.paint.img.charGunFiring, //image source
    64 * that.player.temp.attackStep, //clip from X in original image 44
    imgIndex * 79, //clip from Y in original image 68
    64, //sourceWidth (constant)
    79, //sourceHeight (constant)
    that.positions.playerPos.PX.x, //paint to X in canvas
    that.positions.playerPos.PX.y - 50, //paint to Y in canvas
    64, //destWidth (constant)
    79, //destHeight (constant)
  );

};
