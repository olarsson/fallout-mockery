module.exports.enemyMoving = (that, BOXSIZE) => {

  that.enemies.list.map(enemy => {

    if (enemy.state === 1) {

      let imgIndex = that.CONSTANTS.cordPrioritiesList.indexOf(
        enemy.FACING.x +
        enemy.FACING.y
      );

      let enemyTile = that.hexagon.grid.getPXAtColRow(
        enemy.HEX.CORD.x, enemy.HEX.CORD.y
      );

      let _anim = enemy.animations;

      if ((Date.now() - enemy.animation.startTime) > 100) {
        enemy.animation.startTime = Date.now();
        if (!enemy.temp.haveBeenRun) enemy.temp.tempStep++;
        if (enemy.temp.tempStep >= _anim.moving.totalFrames) {
          enemy.temp.haveBeenRun = true;
          enemy.temp.tempStep = 0;
        }
      }

      that.canvas.drawImage(
        that.paint.img.scorpionMoving, //image source
        _anim.moving.clipX * enemy.temp.tempStep, //clip from X in original image 44
        imgIndex * _anim.moving.clipY, //clip from Y in original image 68
        _anim.moving.width, //sourceWidth (constant)
        _anim.moving.height, //sourceHeight (constant)
        enemyTile.x - _anim.moving.offsetX, //paint to X in canvas
        enemyTile.y - _anim.moving.offsetY, //paint to Y in canvas
        _anim.moving.width, //destWidth (constant)
        _anim.moving.height, //destHeight (constant)
      );

    }

  });

};
