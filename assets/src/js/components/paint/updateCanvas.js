module.exports.updateCanvas = (that, BOXSIZE) => {

  that.paint.clearScreen(that);
  that.paint.background(that);
  that.paint.grid(that);
  that.paint.mousePointerHover(that);
  that.paint.restrictedAreas(that);

  for (let i = 0; i < that.enemies.list.length; i++) {
    that.paint.enemyBox(that,i,BOXSIZE);
  }

  that.paint.playerBox(that, BOXSIZE);
  that.paint.playerStillFacing(that, BOXSIZE);
  that.paint.playerMoving(that,BOXSIZE);
  that.paint.playerAttacking(that,BOXSIZE);

  that.paint.enemyStillFacing(that, BOXSIZE);

  that.paint.mouseCursor(that);

  that.paint.bar(that);

  //status paints
  that.paint.combatStatus(that);

};
