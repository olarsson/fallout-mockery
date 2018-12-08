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

    },

    enemy: {

      scorpionStill: {
        sprite: 'assets/src/img/enemy_scorpion_still.png',
        countX: 1,
        countY: 6,
        width: 59,
        height: 49,
        clipX: 59,
        clipY: 49,
        offsetX: 0,
        offsetY: 50,
        init() {
          that.paint.img.scorpionStill.src = that.animations.enemy.scorpionStill.sprite;
        }
      },

      scorpionAttack: {
        sprite: 'assets/src/img/enemy_scorpion_attack.png',
        totalFrames: 11,
        countX: 11,
        countY: 6,
        width: 86,
        height: 68,
        clipX: 86,
        clipY: 68,
        offsetX: 10,
        offsetY: 40,
        init() {
          that.paint.img.scorpionAttacking.src = that.animations.enemy.scorpionAttack.sprite;
        }
      },

      scorpionMoving: {
        sprite: 'assets/src/img/enemy_scorpion_moving.png',
        totalFrames: 8,
        countX: 8,
        countY: 6,
        width: 59,
        height: 48,
        clipX: 59,
        clipY: 48,
        offsetX: 0,
        offsetY: 20,
        init() {
          that.paint.img.scorpionMoving.src = that.animations.enemy.scorpionMoving.sprite;
        }
      },

      scorpionHit: {
        sprite: 'assets/src/img/enemy_scorpion_hit.png',
        totalFrames: 6,
        countX: 6,
        countY: 6,
        width: 59,
        height: 48,
        clipX: 59,
        clipY: 48,
        offsetX: 0,
        offsetY: 20,
        init() {
          that.paint.img.scorpionHit.src = that.animations.enemy.scorpionHit.sprite;
        }
      },

      scorpionDeath: {
        sprite: 'assets/src/img/enemy_scorpion_death.png',
        totalFrames: 5,
        countX: 5,
        countY: 6,
        width: 53.8,
        height: 34.83,
        clipX: 53.8,
        clipY: 34.83,
        offsetX: 0,
        offsetY: 10,
        init() {
          that.paint.img.scorpionDeath.src = that.animations.enemy.scorpionDeath.sprite;
        }
      },

      scorpionDead: {
        sprite: 'assets/src/img/enemy_scorpion_dead.png',
        countX: 1,
        countY: 6,
        width: 53.8,
        height: 34.83,
        clipX: 0,
        clipY: 34.83,
        offsetX: 0,
        offsetY: 10,
        init() {
          that.paint.img.scorpionDead.src = that.animations.enemy.scorpionDead.sprite;
        }
      }

    }

  }

};
