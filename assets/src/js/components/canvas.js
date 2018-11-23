//cordinates functions
import {getCords} from './cords/getCords.js';
import {getNextCord} from './cords/getNextCord.js';
import {typeOfCord} from './cords/typeOfCord.js';
import {getEnemyByCords} from './cords/getEnemyByCords.js';

//math functions
import {getRandomNumberInRange} from './math/getRandomNumberInRange.js';

//path calculations
import {calculatePathDirection} from './paths/calculatePathDirection.js';
import {getStraightPathBetweenCords} from './paths/getStraightPathBetweenCords.js';

//restricted areas functions
import {isCordRestricted} from './restricted/isCordRestricted.js';
import {isCordSameAsNow} from './restricted/isCordSameAsNow.js';

//paint actions
import {bar} from './paint/bar/bar.js';
import {grid} from './paint/grid.js';
import {mouseCursor} from './paint/mouseCursor.js';
import {restrictedAreas} from './paint/restrictedAreas.js';
import {background} from './paint/background.js';

import {playerBox} from './paint/player/playerBox.js';
import {playerStillFacing} from './paint/player/playerStillFacing.js';
import {playerMoving} from './paint/player/playerMoving.js';
import {playerGunFiring} from './paint/player/playerGunFiring.js';

import {enemyBox} from './paint/enemy/enemyBox.js';

import {clearScreen} from './paint/clearScreen.js';
import {updateCanvas} from './paint/updateCanvas.js';

//update actions
import {areaViewportPosition} from './update/areaViewportPosition.js';
import {mousePointerPosition} from './update/mousePointerPosition.js';
import {clickPosition} from './update/clickPosition.js';
import {playerBoxPosition} from './update/playerBoxPosition.js';
import {playerFacing} from './update/playerFacing.js';

//utilities
import {fixCanvasSize} from './utils/fixCanvasSize.js';
import {createRandomRestrictedArea} from './utils/createRandomRestrictedArea.js';

const BOXSIZE = 25 / 1;
const BOXWIDTH = 700;
const BOXHEIGHT = 425;

var that = {

  imports() {
    this.cords.getCords = getCords(that);
    this.cords.getNextCord = getNextCord;
    this.cords.typeOfCord = typeOfCord;
    this.cords.getEnemyByCords = getEnemyByCords;

    this.math.getRandomNumberInRange = getRandomNumberInRange;

    this.paths.calculatePathDirection = calculatePathDirection;
    this.paths.getStraightPathBetweenCords = getStraightPathBetweenCords;

    this.restricted.isCordRestricted = isCordRestricted;
    that.restricted.isCordSameAsNow = isCordSameAsNow;

    this.paint.bar = bar;
    this.paint.grid = grid;
    this.paint.mouseCursor = mouseCursor;
    this.paint.restrictedAreas = restrictedAreas;
    this.paint.background = background;

    this.paint.playerBox = playerBox;
    this.paint.playerStillFacing = playerStillFacing;
    this.paint.playerMoving = playerMoving;
    this.paint.playerGunFiring = playerGunFiring;

    this.paint.enemyBox = enemyBox;

    this.paint.clearScreen = clearScreen;
    this.paint.updateCanvas = updateCanvas;

    this.update.areaViewportPosition = areaViewportPosition;
    this.update.mousePointerPosition = mousePointerPosition;
    this.update.clickPosition = clickPosition;
    this.update.playerBoxPosition = playerBoxPosition;
    this.update.playerFacing = playerFacing;

    this.utils.fixCanvasSize = fixCanvasSize;
    this.utils.createRandomRestrictedArea = createRandomRestrictedArea;
  },

  CONSTANTS: {

    positionsXsmallTotal: BOXWIDTH / BOXSIZE,
    positionsYsmallTotal: BOXHEIGHT / BOXSIZE,
    longestPath: BOXWIDTH / BOXSIZE,

    area: {
      widthPX: BOXWIDTH,
      heightPX: BOXHEIGHT,
      x: null,
      y: null
    },

    mouseBox: {
      width: BOXSIZE,
      height: BOXSIZE,
      halfWidth: BOXSIZE / 2,
      halfHeight: BOXSIZE / 2
    },

    cordPrioritiesList: [
      '+-','+/','++','/+','-+','-/','--','/-'
    ],

    cordPrioritiesListSmall: [
      '+-','+/','++','-+','-/','--'
    ]

  },

  elem: {
    area: o('#canvas', 1),
  },

  math: {},

  canvas: document.getElementById('canvas').getContext('2d'),
  canvasBar: document.getElementById('canvasBar').getContext('2d'),

  weapons: {

    gun: {
      melee: false,
      range: 5,
      damage: [2,6],
      actionPoints: 4
    },

    rifle: {
      melee: false,
      range: 8,
      damage: [7,12],
      actionPoints: 4
    },

    knife: {
      melee: true,
      range: null,
      damage: [4,6],
      actionPoints: 2
    }

  },

  targets: {

    createEnemy() {

      let enemy = {
        CORD: {
          x: 12,
          y: 9
        },
        PX: {
          x: 12 * BOXSIZE,
          y: 9 * BOXSIZE
        },
        alive: true,
        health: 2000,
        engaged: false,
        aggroRange: 5,
        weapon: {}
      };

      Object.assign(enemy.weapon, that.weapons.rifle);

      that.targets.enemies.push(enemy);

    },

    enemies: [],

  },

  combat: {

    DEFAULTS: {
      actionPoints: 8,
    },

    weapon: {},
    inCombat: false,
    queue: [],

    enterCombat() {
      console.log('enter combat');
      that.combat.inCombat = true;
      that.combat.actionPoints = that.combat.DEFAULTS.actionPoints;
    },

    populateQueue() {

    },

    tryToLeaveCombat() {
      //check if targets.enemies are engaged
      console.log('tryToLeaveCombat');
    },

    attackEnemy(targetIdx) {

      let enemy = that.targets.enemies[targetIdx],
      damage = that.math.getRandomNumberInRange(that,
        enemy.weapon.damage[0],
        enemy.weapon.damage[1]
      );

      //that.update.playerFacing(that,previousSteps[i].pathDirection);
      that.player.animation.gunFireAnimation.start();

      let i = 0, attackTimer = setInterval(() => {
        i++;
        if (i === 4) {
          console.log('mid shooting action');
        } else
        if (i === 7) {
          clearInterval(attackTimer);
          that.player.animation.gunFireAnimation.stop();
        }
      }, 100);


      enemy.health -= damage;

      console.log(enemy.health);

      if (enemy.health <= 0) { //enemy was killed
        enemy.alive = false;
        enemy.engaged = false;
      }

    },

    tryCombat(from,to) {

      //get enemy by cords
      let enemy = that.cords.getEnemyByCords(that,to);
      //get straight path between cords, with range
      let pathToEnemy = that.paths.getStraightPathBetweenCords(that,from,to);

      if (pathToEnemy.pathLength <= that.combat.weapon.range) { //attack possible, attack

        if (!that.combat.inCombat) that.combat.enterCombat();

        that.targets.enemies[enemy.idx].engaged = true;
        console.log('in range, engage! attack with weapon');

        that.combat.attackEnemy(enemy.idx);

      } else { //not in range

        console.log('no in range');

/*            if (that.combat.inCombat) {
        } else {
          that.combat.enterCombat();
        }*/

      }


    }

  },

  player: {

    //state: integer
    //0 = still
    //1 = moving
    //2 = firing
    state: 0,

    combat: false,

    temp: {
      attackStep: 0,
      haveBeenRun: false,
    },

    animation: {

      startTime: null,

      init(state) {
        that.player.haveBeenRun = false;
        that.player.temp.attackStep = 0;
        that.player.animation.startTime = Date.now();
        that.player.state = state;
      },

      finished() {
        that.player.state = 0;
      },

      movementAnimation: {

        start() {
          that.player.animation.init(1);
        },

        stop() {
          that.player.animation.finished();
        }

      },

      gunFireAnimation: {

        start() {
          that.player.animation.init(2);
        },

        stop() {
          that.player.animation.finished();
        }

      }

    }

  },

/*  positions: {

    mousePointer:{
      "PX":{
        "x":49,"y":419}
      },

      clickPos:{
        "PX":{
          "x":253,"y":174
        },"CORD":{
          "x":10,"y":6
        }
      },
      playerPos:{
        "previousImgStep":1,
        "moveCounter":0,
        "FACING":{
          "x":"+","y":"/"
        },
        "PX":{
          "x":250,"y":150
        },
        "CORD":{
          "x":10,"y":6
        }
      }

  },*/

  positions: {

    mousePointer: {
      PX: {
        x: 0,
        y: 0
      },
      CORD: {
        x: 0,
        y: 0
      }
    },

    clickPos: {
      PX: {
        x: 0,
        y: 0
      },
      CORD: {
        x: 0,
        y: 0
      }
    },

    playerPos: {
      previousImgStep: 0,
      moveCounter: 0,
      FACING: {
        x: '+',
        y: '/'
      },
      PX: {
        x: 0,
        y: 0
      },
      CORD: {
        x: 0,
        y: 0
      }
    }

  },

  restricted: {

    dynamic: false,

    dynamicCords: [],

    cords: [
      {x:1,y:1},
      {x:1,y:2},
      {x:1,y:3},
      {x:3,y:3},
      {x:4,y:3},
      {x:4,y:4},
      {x:4,y:5},
      {x:4,y:6},
      {x:3,y:6},
      {x:2,y:6}
    ]

  },

  utils: {},

  paths: {},

  update: {},

  paint: {

    img: {

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

      charStill: new Image(),
      charStillInit() {
        that.paint.img.charStill.src = 'assets/src/img/char_36_419.gif';
      },

      charMovementAll: new Image(),
      charMovementAllInit() {
        that.paint.img.charMovementAll.src = 'assets/src/img/complete_movement.gif';
      },

      charGunFiring: new Image(),
      charGunFiringInit() {
        that.paint.img.charGunFiring.src = 'assets/src/img/char_gun_firing.png';
      },

      bgDesert: new Image(),
      bgDesertInit() {
        that.paint.img.bgDesert.src = 'assets/src/img/bg_desert.gif';
      }

    }

  },

  cords: {},

  movement: {

    movePlayerFromStartToEnd(from,to,MAXSTEPS=20) {

      if (that.player.state !== 0) return;

      that.restricted.dynamic = true;
      that.restricted.dynamicCords = that.restricted.cords.slice(0, that.restricted.cords.length);

      let previousSteps = [], i, nextCords, moveTimer, previousDestination = from, pathDirection;

      for (i = 0; i < MAXSTEPS; i++) {

        that.restricted.dynamicCords.push(previousDestination);

        pathDirection = that.paths.calculatePathDirection(that,previousDestination,to);

        nextCords = that.cords.getNextCord(that,
          previousDestination.x,previousDestination.y,
          pathDirection.directionX,
          pathDirection.directionY
        );

        previousDestination = nextCords.newCords;

        previousSteps.push({
          nextCords: nextCords.newCords,
          pathDirection: pathDirection
        });

        if (nextCords.newCords.x == to.x && nextCords.newCords.y == to.y) {
          break;
        }

      }

      i = 0;

      that.player.animation.movementAnimation.start();

      moveTimer = setInterval(() => {

        that.update.playerBoxPosition(that,
          previousSteps[i].nextCords.x,
          previousSteps[i].nextCords.y
        );

        that.update.playerFacing(that,previousSteps[i].pathDirection);

        if (i === previousSteps.length - 1) {
          clearInterval(moveTimer);
          that.player.animation.movementAnimation.stop();
          that.restricted.dynamic = false;
        }

        i++;

      }, 150);

    }

  },

  events: {

    updateInterface() {
      setInterval(() => {
        requestAnimationFrame(() => {
          that.paint.updateCanvas(that, BOXSIZE);
        });
      }, 16); //60~ fps

/*      setInterval(() => {
        requestAnimationFrame(() => {
          that.paint.updateCanvas(that, BOXSIZE);
        });
      }, 50); //20~ fps*/

    },

    updateMousePointerPosition() {
      that.elem.area.addEventListener('mousemove', function(e) {
        requestAnimationFrame(() => {
          that.update.mousePointerPosition(that,
            e.clientX - that.CONSTANTS.area.x,
            e.clientY - that.CONSTANTS.area.y
          );
        });
      });
    },

    click() {

      that.elem.area.addEventListener('click', function(e) {

        let originalPos, allowed, sameCordAsBefore, cordType, from, to;

        //current/original click position
        originalPos = JSON.parse(JSON.stringify({
          x: that.positions.clickPos.CORD.x,
          y: that.positions.clickPos.CORD.y
        }));

        //set new cords for the click position
        that.update.clickPosition(that,
          e.clientX - that.CONSTANTS.area.x,
          e.clientY - that.CONSTANTS.area.y
        );

        //check if the new cords are the same as the old
        sameCordAsBefore = that.restricted.isCordSameAsNow(
          that, that.positions.clickPos.CORD, originalPos
        );

        from = {
          x: that.positions.playerPos.CORD.x,
          y: that.positions.playerPos.CORD.y
        };

        to = {
          x: that.positions.clickPos.CORD.x,
          y: that.positions.clickPos.CORD.y
        };

        //determines if the cords is an enemy, a structure, etc..
        cordType = that.cords.typeOfCord(that,that.positions.clickPos.CORD);

        //MOVE = cord is nothing special, and cord is different than before
        if (cordType.type === 0 && !sameCordAsBefore) {
          that.movement.movePlayerFromStartToEnd(from, to);
        } else
        ///////////////////////////////////////

        //DONT MOVE = cord is non-interactive area
        if (cordType.type === 1) {
        } else
        ///////////////////////////////////////

        //ENGAGE ENEMY =
        if (cordType.type === 2) {
          that.combat.tryCombat(from,to);
        } else
        ///////////////////////////////////////

        //DEAD ENEMY, loot if in range
        if (cordType.type === 3) {
          console.log('dead enemy! loot?');
        }

      });

    },

    init() {
      that.events.updateInterface();
      that.events.updateMousePointerPosition();
      that.events.click();
    }

  },

  init() {
    this.imports();
    this.utils.fixCanvasSize();

    //assign default weapon (gun) to player
    Object.assign(this.combat.weapon, that.weapons.gun);

    this.paint.img.barInit();
    this.paint.img.bgDesertInit();

    this.paint.img.cursorStandardInit();
    this.paint.img.cursorCurrentInit();
    this.paint.img.cursorEnemyInit();
    this.paint.img.cursorRestrictedInit();
    this.paint.img.cursorTouchInit();

    this.paint.img.charStillInit();
    this.paint.img.charGunFiringInit();
    this.paint.img.charMovementAllInit();

    this.targets.createEnemy();

    this.events.init();
    this.update.areaViewportPosition(that);
    //this.utils.createRandomRestrictedArea(that);
  }

};

module.exports.canvas = that;
