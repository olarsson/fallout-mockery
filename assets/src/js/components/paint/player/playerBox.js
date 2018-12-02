module.exports.playerBox = (that, BOXSIZE) => {

  that.hexagon.grid.drawHexAtColRow(
    that.positions.playerPos.HEX.CORD.x,
    that.positions.playerPos.HEX.CORD.y,
    "blue"
  );

};
