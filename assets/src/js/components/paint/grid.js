module.exports.grid = (that) => {

  var ctx = document.getElementById('canvas').getContext('2d');
  let switcher = false;
  for (let i = 0; i <= that.CONSTANTS.positionsXsmallTotal; i++) {
    switcher = !switcher;
    for (var j = 0; j <= that.CONSTANTS.positionsYsmallTotal; j++) {
      switcher = !switcher;
      ctx.fillStyle = 'rgba(255,255,255,'+ (switcher ? '0' : '0.05') +')';
      ctx.fillRect(
        i * that.CONSTANTS.mouseBox.width,
        j * that.CONSTANTS.mouseBox.height,
        that.CONSTANTS.mouseBox.width,
        that.CONSTANTS.mouseBox.height
      );
    }
  }

/*  that.canvas.beginPath();
  for (let i = 1; i <= that.CONSTANTS.positionsXsmallTotal; i++) {
    that.canvas.moveTo(i * that.CONSTANTS.mouseBox.width,0);
    that.canvas.lineTo(i * that.CONSTANTS.mouseBox.width,that.CONSTANTS.area.heightPX);
    that.canvas.strokeStyle="#b1b1b154";
    that.canvas.stroke();
    if (i <= that.CONSTANTS.positionsYsmallTotal) {
      that.canvas.moveTo(0, i * that.CONSTANTS.mouseBox.width);
      that.canvas.lineTo(that.CONSTANTS.area.widthPX, i * that.CONSTANTS.mouseBox.width);
      that.canvas.stroke();
    }
  }*/
}
