module.exports.imagesCollection = (that) => {

  return {

    playerAttacking: new Image(),
    playerStill: new Image(),
    playerMoving: new Image(),

    scorpionAttacking: new Image(),
    scorpionStill: new Image(),
    scorpionMoving: new Image(),
    scorpionHit: new Image(),
    scorpionDeath: new Image(),
    scorpionDead: new Image(),

    bar: new Image(),
    barInit() {
      that.paint.img.bar.src = 'assets/src/img/bar.png';
    },

    cursorCurrent: new Image(),
    cursorCurrentIdx: -1,
    cursorCurrentInit() {
      that.paint.img.cursorCurrent.src = '';
    },

    cursorTouch: new Image(),
    cursorTouchInit() {
      that.paint.img.cursorTouch.src = 'assets/src/img/cursor_touch.png';
    },

    cursorStandard: new Image(),
    cursorStandardInit() {
      that.paint.img.cursorStandard.src = 'assets/src/img/cursor_standard.png';
    },

    cursorRestricted: new Image(),
    cursorRestrictedInit() {
      that.paint.img.cursorRestricted.src = 'assets/src/img/cursor_restricted.png';
    },

    cursorEnemy: new Image(),
    cursorEnemyInit() {
      that.paint.img.cursorEnemy.src = 'assets/src/img/cursor_enemy.png';
    },

    bgDesert: new Image(),
    bgDesertInit() {
      that.paint.img.bgDesert.src = 'assets/src/img/bg_desert.gif';
    }

  }

};
