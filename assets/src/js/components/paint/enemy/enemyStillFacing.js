module.exports.enemyStillFacing = (that, BOXSIZE) => {

  let enemy, imgIndex;

  for (let i = 0; i < that.enemies.list.length; i++) {

    enemy = that.enemies.list[i];

    if (enemy.state === 0) {

      imgIndex = that.CONSTANTS.cordPrioritiesList.indexOf(
        enemy.FACING.x +
        enemy.FACING.y
      );

      let enemyTile = that.hexagon.grid.getPXAtColRow(
        enemy.HEX.CORD.x, enemy.HEX.CORD.y
      );

      if (enemy.alive) {

        that.canvas.drawImage(
          that.paint.img.scorpionStill, //image source
          0, //clip from X in original image
          imgIndex * 49, //clip from Y in original image
          59, //sourceWidth (constant)
          49, //sourceHeight (constant)
          enemyTile.x - 5,
          enemyTile.y - 15,
          59, //destWidth (constant)
          49, //destHeight (constant)
        );

      } else {

        that.canvas.drawImage(
          that.paint.img.scorpionDead, //image source
          enemy.animations.dead.clipX, //clip from X in original image 44
          imgIndex * enemy.animations.dead.clipY, //clip from Y in original image 68
          enemy.animations.dead.width, //sourceWidth (constant)
          enemy.animations.dead.height, //sourceHeight (constant)
          enemyTile.x - enemy.animations.dead.offsetX, //paint to X in canvas
          enemyTile.y - enemy.animations.dead.offsetY, //paint to Y in canvas
          enemy.animations.dead.width, //destWidth (constant)
          enemy.animations.dead.height, //destHeight (constant)
        );

      }

    }

  }

};
