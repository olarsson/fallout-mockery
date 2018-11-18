//cordinates functions
import {getCords} from './cords/getCords.js';
import {getNextCord} from './cords/getNextCord.js';
import {typeOfCord} from './cords/typeOfCord.js';
import {getEnemyByCords} from './cords/getEnemyByCords.js';

//path calculations
import {calculatePathDirection} from './paths/calculatePathDirection.js';

//restricted areas functions
import {isCordRestricted} from './restricted/isCordRestricted.js';
import {isCordSameAsNow} from './restricted/isCordSameAsNow.js';

//paint actions
import {grid} from './paint/grid.js';
import {mousePointer} from './paint/mousePointer.js';
import {restrictedAreas} from './paint/restrictedAreas.js';
import {background} from './paint/background.js';

import {playerBox} from './paint/player/playerBox.js';
import {playerStillFacing} from './paint/player/playerStillFacing.js';
import {playerMoving} from './paint/player/playerMoving.js';

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

    this.paths.calculatePathDirection = calculatePathDirection;

    this.restricted.isCordRestricted = isCordRestricted;
    that.restricted.isCordSameAsNow = isCordSameAsNow;

    this.paint.grid = grid;
    this.paint.mousePointer = mousePointer;
    this.paint.restrictedAreas = restrictedAreas;
    this.paint.background = background;

    this.paint.playerBox = playerBox;
    this.paint.playerStillFacing = playerStillFacing;
    this.paint.playerMoving = playerMoving;

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

  canvas: document.getElementById('canvas').getContext('2d'),

  targets: {

    createEnemy() {
      that.targets.enemies.push({
        CORD: {
          x: 12,
          y: 9
        },
        PX: {
          x: 12 * BOXSIZE,
          y: 9 * BOXSIZE
        },
        health: 100,
        engaged: false,
        aggroRange: 5
      });
    },

    enemies: [],

  },

  player: {

    //0 = still
    //1 = moving
    state: 0,

    animation: {

      startTime: null,

      startMoving() {
        that.player.state = 1;
        that.player.animation.startTime = Date.now();
      },

      stopMoving() {
        that.player.state = 0;
      }

    }

  },

  positions: {

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

  },

/*  positions: {

    mousePointer: {
      PX: {
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

  },*/

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

      cursorStandard: new Image(),
      cursorStandardInit() {
        that.paint.img.cursorStandard.src = 'assets/src/img/cursor_standard.png';
      },

      charStill: new Image(),
      charStillInit() {
        that.paint.img.charStill.src = 'assets/src/img/char_36_419.gif';
      },

      charMovementAll: new Image(),
      charMovementAllInit() {
        that.paint.img.charMovementAll.src = 'assets/src/img/complete_movement.gif';
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

        previousDestination = nextCords;

        previousSteps.push({
          nextCords: nextCords,
          pathDirection: pathDirection
        });

        if (nextCords.x == to.x && nextCords.y == to.y) {
          break;
        }

      }

      i = 0;

      that.player.animation.startMoving();

      moveTimer = setInterval(() => {

        that.update.playerBoxPosition(that,
          previousSteps[i].nextCords.x,
          previousSteps[i].nextCords.y
        );

        that.update.playerFacing(that,previousSteps[i].pathDirection);

        if (i === previousSteps.length - 1) {
          clearInterval(moveTimer);
          that.player.animation.stopMoving();
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

        originalPos = JSON.parse(JSON.stringify({
          x: that.positions.clickPos.CORD.x,
          y: that.positions.clickPos.CORD.y
        }));

        that.update.clickPosition(that,
          e.clientX - that.CONSTANTS.area.x,
          e.clientY - that.CONSTANTS.area.y
        );

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

        cordType = that.cords.typeOfCord(that,that.positions.clickPos.CORD);

        console.log(cordType);

        //nothing special, just move
        if (cordType.type === 0 && !sameCordAsBefore) {
          that.movement.movePlayerFromStartToEnd(from, to);
        } else

        //non-interactive area, dont move
        if (cordType.type === 1) {
        } else

        //enemy, engage
        if (cordType.type === 2) {

          //get enemy by cords
          let enemy = that.cords.getEnemyByCords(that,to);

          if (enemy.engaged) {
            //try to attack, if in range
          } else {
            //engage, then try to attack
            that.targets.enemies[enemy.idx].engaged = true;
          }

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

    this.paint.img.bgDesertInit();
    this.paint.img.cursorStandardInit();
    this.paint.img.charStillInit();
    this.paint.img.charMovementAllInit();

    this.targets.createEnemy();

    this.events.init();
    this.update.areaViewportPosition(that);
    //this.utils.createRandomRestrictedArea(that);
  }

};

module.exports.canvas = that;
