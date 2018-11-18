module.exports.getEnemyByCords = (that,cords) => {

  let index;

  let enemy = that.targets.enemies.find((obj, idx) => {
    index = idx;
    return {
      'CORD': {
        x: 12,
        y: 9
      }
    }
  });

  return Object.assign(enemy, {
    idx: index
  });

};
