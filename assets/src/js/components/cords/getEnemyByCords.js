module.exports.getEnemyByCords = (that,cords) => {

  let index, enemy = that.enemies.list.find((obj, idx) => {
    //console.log(obj.CORD.x, obj.CORD.y,cords.x,cords.y);

    console.log(obj);

    if (obj.HEX.CORD.x === cords.x && obj.HEX.CORD.y === cords.y) {

      index = idx;

      return {
        HEX:{
          CORD: {
            x: cords.x,
            y: cords.y
          }
        }
      }
    }

  });

  if (enemy === undefined) return;

  return Object.assign(enemy, {
    idx: index
  });

};
