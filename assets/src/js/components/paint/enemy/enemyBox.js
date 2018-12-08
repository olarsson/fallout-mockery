module.exports.enemyBox = (that, idx, BOXSIZE) => {

  that.hexagon.grid.drawHexAtColRow(
    that.enemies.list[idx].HEX.CORD.x,
    that.enemies.list[idx].HEX.CORD.y,
    "yellow"
  );

  let px = that.hexagon.grid.getPXAtColRow(
    that.enemies.list[idx].HEX.CORD.x,
    that.enemies.list[idx].HEX.CORD.y
  );

  that.canvas.font="14px monospace";
  that.canvas.fillText(
    that.enemies.list[idx].health,
    px.x - 20,
    px.y
  );

};
