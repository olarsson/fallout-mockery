module.exports.updateCanvas = (that, BOXSIZE) => {

  that.paint.clearScreen(that);
  that.paint.background(that);
  that.paint.grid(that);
  that.paint.restrictedAreas(that);

  for (let i = 0; i < that.targets.enemies.length; i++) {
    that.paint.enemyBox(that,i,BOXSIZE);
  }

  that.paint.playerBox(that, BOXSIZE);
  that.paint.playerStillFacing(that, BOXSIZE);
  that.paint.playerMoving(that,BOXSIZE);

  that.paint.mousePointer(that);

};
