module.exports.updateCanvas = (that, BOXSIZE) => {
  that.paint.clearScreen(that);
  that.paint.grid(that);
  that.paint.restrictedAreas(that);
  that.paint.playerBox(that, BOXSIZE);
  that.paint.mousePointer(that);
};
