module.exports.playerBox = (that, BOXSIZE) => {

  that.canvas.fillStyle = '#fff';
  that.canvas.fillRect(
    that.positions.playerPos.PX.x,
    that.positions.playerPos.PX.y,
    BOXSIZE,BOXSIZE
  );

};
