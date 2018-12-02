module.exports.enemyStillFacing = (that, BOXSIZE) => {

  let enemy, imgIndex;

  for (let i = 0; i < that.enemies.list.length; i++) {

    enemy = that.enemies.list[i];

    imgIndex = that.CONSTANTS.cordPrioritiesList.indexOf(
      enemy.FACING.x +
      enemy.FACING.y
    );

    let enemyTile = that.hexagon.grid.getPXAtColRow(
      enemy.HEX.CORD.x, enemy.HEX.CORD.y
    );

    that.canvas.drawImage(
      that.paint.img.enemyStill, //image source
      0, //clip from X in original image
      imgIndex * 49, //clip from Y in original image
      59, //sourceWidth (constant)
      49, //sourceHeight (constant)
      enemyTile.x - 5,
      enemyTile.y - 15,
      //enemy.HEX.PX.x - 15, //paint to X in canvas
      //enemy.HEX.PX.y - 25, //paint to Y in canvas
      59, //destWidth (constant)
      49, //destHeight (constant)
    );

  }

};
