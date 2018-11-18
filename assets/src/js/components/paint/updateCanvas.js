module.exports.updateCanvas = (that, BOXSIZE) => {

  that.paint.clearScreen(that);
  that.paint.grid(that);
  that.paint.restrictedAreas(that);
  that.paint.playerBox(that, BOXSIZE);
  that.paint.playerStillFacing(that, BOXSIZE);
  that.paint.playerMoving(that,BOXSIZE);
  that.paint.mousePointer(that);

/*  if (FPS === 60) {
    //that.paint.clearScreen(that);
    that.paint.grid(that);
    that.paint.mousePointer(that);

  } else
  if (FPS === 20) {
    //that.paint.clearScreen(that);
    that.paint.restrictedAreas(that);
    that.paint.playerBox(that, BOXSIZE);
    //that.paint.playerStillFacing(that, BOXSIZE);
    that.paint.playerMoving(that,BOXSIZE);
  }*/

};
