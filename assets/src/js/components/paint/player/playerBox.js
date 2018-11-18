module.exports.playerBox = (that, BOXSIZE) => {

  that.canvas.fillStyle = 'green';
  that.canvas.globalAlpha = '0.4'
  that.canvas.fillRect(
    that.positions.playerPos.PX.x,
    that.positions.playerPos.PX.y,
    BOXSIZE,BOXSIZE
  );
  that.canvas.globalAlpha = '1'

};
