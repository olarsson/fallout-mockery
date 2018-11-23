module.exports.playerMoving = (that, BOXSIZE) => {

  if (!(that.player.state === 1)) return;

  if ((Date.now() - that.player.animation.startTime) > 70) {
    that.player.animation.startTime = Date.now();
    that.positions.playerPos.moveCounter++;
    if (that.positions.playerPos.moveCounter === 8) that.positions.playerPos.moveCounter = 0;
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
    that.paint.img.charMovementAll, //image source
    44 * that.positions.playerPos.moveCounter, //clip from X in original image 44
    imgIndex * 68, //clip from Y in original image 68
    44, //sourceWidth (constant)
    68, //sourceHeight (constant)
    that.positions.playerPos.PX.x, //paint to X in canvas
    that.positions.playerPos.PX.y - 50, //paint to Y in canvas
    44, //destWidth (constant)
    68, //destHeight (constant)
  );


/*  that.canvas.drawImage(
    that.paint.img.charMovementDownRight, //image source
    44 * that.positions.playerPos.moveCounter, //clip from X in original image 44
    0, //clip from Y in original image 68
    44, //sourceWidth (constant)
    68, //sourceHeight (constant)
    that.positions.playerPos.PX.x, //paint to X in canvas
    that.positions.playerPos.PX.y - 50, //paint to Y in canvas
    44, //destWidth (constant)
    68, //destHeight (constant)
  );*/

};
