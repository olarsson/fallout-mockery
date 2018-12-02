module.exports.enemyBox = (that, idx, BOXSIZE) => {

/*  that.canvas.fillStyle = '#ffdd00';
  that.canvas.fillRect(
    that.enemies.list[idx].PX.x,
    that.enemies.list[idx].PX.y,
    BOXSIZE,BOXSIZE
  );*/

/*  let tile = that.hexagon.grid.getSelectedTile(
    that.enemies.list[idx].HEX.PX.x,
    that.enemies.list[idx].HEX.PX.x
  );*/

  that.hexagon.grid.drawHexAtColRow(
    that.enemies.list[idx].HEX.CORD.x,
    that.enemies.list[idx].HEX.CORD.y,
    "yellow"
  );
/*  that.hexagon.grid.drawHex(
    that.enemies.list[idx].HEX.PX.x,
    that.enemies.list[idx].HEX.PX.x,
    "yellow",
    false
  );*/

  let px = that.hexagon.grid.getPXAtColRow(
    that.enemies.list[idx].HEX.CORD.x,
    that.enemies.list[idx].HEX.CORD.y
  );

  that.canvas.font="14px monospace";
  that.canvas.fillText(
    that.enemies.list[idx].health,
    px.x - 20,
    px.y
/*    that.enemies.list[idx].HEX.PX.x - 20,
    that.enemies.list[idx].HEX.PX.y*/
  );

};
