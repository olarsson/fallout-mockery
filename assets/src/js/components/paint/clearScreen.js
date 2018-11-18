module.exports.clearScreen = (that) => {
  that.canvas.clearRect(0, 0, that.CONSTANTS.area.widthPX, that.CONSTANTS.area.heightPX);
};
