module.exports.getEnemyByCords = (that,cords) => {

  let index, enemy = project.canvas.targets.enemies.find((obj, idx) => {
    //console.log(obj.CORD.x, obj.CORD.y,cords.x,cords.y);

    if (obj.CORD.x === cords.x && obj.CORD.y === cords.y) {

      index = idx;

      return {

        CORD: {
          x: cords.x,
          y: cords.y
        }
      }
    }

  });

  if (enemy === undefined) return;

  return Object.assign(enemy, {
    idx: index
  });

};
