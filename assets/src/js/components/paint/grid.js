module.exports.grid = (that) => {
  that.canvas.beginPath();
  for (let i = 1; i <= that.CONSTANTS.positionsXsmallTotal; i++) {
    that.canvas.moveTo(i * that.CONSTANTS.mouseBox.width,0);
    that.canvas.lineTo(i * that.CONSTANTS.mouseBox.width,that.CONSTANTS.area.heightPX);
    that.canvas.strokeStyle="#ffd587";
    that.canvas.stroke();
    if (i <= that.CONSTANTS.positionsYsmallTotal) {
      that.canvas.moveTo(0, i * that.CONSTANTS.mouseBox.width);
      that.canvas.lineTo(that.CONSTANTS.area.widthPX, i * that.CONSTANTS.mouseBox.width);
      that.canvas.stroke();
    }
  }
}
