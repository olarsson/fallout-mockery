module.exports.animations = (that) => {

  return {

    player: {

      gunFireBasic: {
        sprite: 'assets/src/img/char_gun_firing.png',
        totalFrames: 5,
        countX: 5,
        countY: 6,
        width: 64,
        height: 79,
        clipX: 64,
        clipY: 79,
        offsetX: 10,
        offsetY: 58,
        init() {
          that.paint.img.playerAttacking.src = that.animations.player.gunFireBasic.sprite;
        }
      },

      stillBasic: {
        sprite: 'assets/src/img/char_36_419.gif',
        countX: 8,
        countY: 6,
        width: 36,
        height: 70,
        clipX: 0,
        clipY: 70,
        offsetX: 0,
        offsetY: 50,
        init() {
          that.paint.img.playerStill.src = that.animations.player.stillBasic.sprite;
        }
      },

      movingBasic: {
        sprite: 'assets/src/img/complete_movement.gif',
        totalFrames: 8,
        countX: 8,
        countY: 6,
        width: 44,
        height: 68,
        clipX: 44,
        clipY: 68,
        offsetX: 0,
        offsetY: 50,
        init() {
          that.paint.img.playerMoving.src = that.animations.player.movingBasic.sprite;
        }
      }

    }

  }

};
