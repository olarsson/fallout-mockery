module.exports.enemyBox = (that, idx, BOXSIZE) => {

  that.canvas.fillStyle = '#ffdd00';
  that.canvas.fillRect(
    that.targets.enemies[idx].PX.x,
    that.targets.enemies[idx].PX.y,
    BOXSIZE,BOXSIZE
  );

};
