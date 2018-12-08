module.exports.enemyDeath = (that, BOXSIZE) => {

  that.enemies.list.map(enemy => {

    if (enemy.state === -1) {

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
        if (enemy.temp.tempStep >= _anim.death.totalFrames) {
          enemy.temp.haveBeenRun = true;
          enemy.temp.tempStep = 0;
        }
      }

      that.canvas.drawImage(
        that.paint.img.scorpionDeath, //image source
        _anim.death.clipX * enemy.temp.tempStep, //clip from X in original image 44
        imgIndex * _anim.death.clipY, //clip from Y in original image 68
        _anim.death.width, //sourceWidth (constant)
        _anim.death.height, //sourceHeight (constant)
        enemyTile.x - _anim.death.offsetX, //paint to X in canvas
        enemyTile.y - _anim.death.offsetY, //paint to Y in canvas
        _anim.death.width, //destWidth (constant)
        _anim.death.height, //destHeight (constant)
      );

    }

  });

};
