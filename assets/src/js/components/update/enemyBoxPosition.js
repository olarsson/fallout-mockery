module.exports.enemyBoxPosition = (that,enemy,column,row) => {

  let colRowToPX = that.hexagon.grid.getPXAtColRow(column,row);

  Object.assign(enemy, {
    HEX: {
      PX: {
        x: colRowToPX.x,
        y: colRowToPX.y
      },
      CORD: {
        x: column,
        y: row
      }
    }
  });

};
