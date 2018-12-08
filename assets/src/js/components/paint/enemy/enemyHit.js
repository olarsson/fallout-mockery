module.exports.enemyHit = (that, BOXSIZE) => {

  that.enemies.list.map(enemy => {

    if (enemy.state === 3) {

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
        if (enemy.temp.tempStep >= _anim.hit.totalFrames) {
          enemy.temp.haveBeenRun = true;
          enemy.temp.tempStep = 0;
        }
      }

      that.canvas.drawImage(
        that.paint.img.scorpionHit, //image source
        _anim.hit.clipX * enemy.temp.tempStep, //clip from X in original image 44
        imgIndex * _anim.hit.clipY, //clip from Y in original image 68
        _anim.hit.width, //sourceWidth (constant)
        _anim.hit.height, //sourceHeight (constant)
        enemyTile.x - _anim.hit.offsetX, //paint to X in canvas
        enemyTile.y - _anim.hit.offsetY, //paint to Y in canvas
        _anim.hit.width, //destWidth (constant)
        _anim.hit.height, //destHeight (constant)
      );

    }

  });

};
