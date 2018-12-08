module.exports.enemyAttacking = (that, BOXSIZE) => {

  that.enemies.list.map(enemy => {

    if (enemy.state === 2) {

      let imgIndex = that.CONSTANTS.cordPrioritiesList.indexOf(
        enemy.FACING.x +
        enemy.FACING.y
      );

      let enemyTile = that.hexagon.grid.getPXAtColRow(
        enemy.HEX.CORD.x, enemy.HEX.CORD.y
      );

      console.log('attacking');

      let _anim = enemy.animations;

      if ((Date.now() - enemy.animation.startTime) > 100) {
        enemy.animation.startTime = Date.now();
        if (!enemy.temp.haveBeenRun) enemy.temp.tempStep++;
        if (enemy.temp.tempStep >= _anim.attack.totalFrames) {
          enemy.temp.haveBeenRun = true;
          enemy.temp.tempStep = 0;
        }
      }

      that.canvas.drawImage(
        that.paint.img.scorpionAttacking, //image source
        _anim.attack.clipX * enemy.temp.tempStep, //clip from X in original image 44
        imgIndex * _anim.attack.clipY, //clip from Y in original image 68
        _anim.attack.width, //sourceWidth (constant)
        _anim.attack.height, //sourceHeight (constant)
        enemyTile.x - _anim.attack.offsetX, //paint to X in canvas
        enemyTile.y - _anim.attack.offsetY, //paint to Y in canvas
        _anim.attack.width, //destWidth (constant)
        _anim.attack.height, //destHeight (constant)
      );

    }

  });

};
