module.exports.enemyBox = (that, idx, BOXSIZE) => {

  that.canvas.fillStyle = '#ffdd00';
  that.canvas.fillRect(
    that.enemies.list[idx].PX.x,
    that.enemies.list[idx].PX.y,
    BOXSIZE,BOXSIZE
  );

  that.canvas.font="14px monospace";
  that.canvas.fillText(
    that.enemies.list[idx].health,
    that.enemies.list[idx].PX.x - 20,
    that.enemies.list[idx].PX.y
  );

};
