module.exports.playerBox = (that, BOXSIZE) => {

  that.hexagon.grid.drawHexAtColRow(
    that.positions.playerPos.HEX.CORD.x,
    that.positions.playerPos.HEX.CORD.y,
    "blue"
  );

  that.canvas.fillStyle = '#ffddff';
  that.canvas.font="14px monospace";
  that.canvas.fillText(
    that.player.health,
    project.canvas.positions.playerPos.HEX.PX.x - 20,
    project.canvas.positions.playerPos.HEX.PX.y
  );

};
