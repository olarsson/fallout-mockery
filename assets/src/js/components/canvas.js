//cordinates functions
import {getCords} from './cords/getCords.js';
import {getNextCord} from './cords/getNextCord.js';

//path calculations
import {calculatePathDirection} from './paths/calculatePathDirection.js';

//restricted areas functions
import {isCordAllowed} from './restricted/isCordAllowed.js';
import {isCordSameAsNow} from './restricted/isCordSameAsNow.js';

//paint actions
import {grid} from './paint/grid.js';
import {mousePointer} from './paint/mousePointer.js';
import {restrictedAreas} from './paint/restrictedAreas.js';
import {playerBox} from './paint/player/playerBox.js';
import {playerStillFacing} from './paint/player/playerStillFacing.js';
import {playerMoving} from './paint/player/playerMoving.js';
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
const BOXHEIGHT = 500;

var that = {

  imports() {
    this.cords.getCords = getCords(that);
    this.cords.getNextCord = getNextCord;

    this.paths.calculatePathDirection = calculatePathDirection;

    this.restricted.isCordAllowed = isCordAllowed;
    that.restricted.isCordSameAsNow = isCordSameAsNow;

    this.paint.grid = grid;
    this.paint.mousePointer = mousePointer;
    this.paint.restrictedAreas = restrictedAreas;
    this.paint.playerBox = playerBox;
    this.paint.playerStillFacing = playerStillFacing;
    this.paint.playerMoving = playerMoving;
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

  player: {
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
    //0 = still
    //1 = moving
  },

  positions: {

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
      charStill: new Image(),
      charStillInit() {
        that.paint.img.charStill.src = 'assets/src/img/char_36_419.gif';
      },
      charMovementAll: new Image(),
      charMovementAllInit() {
        that.paint.img.charMovementAll.src = 'assets/src/img/complete_movement.gif';
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

        let originalPos, allowed, sameCordAsBefore;

        originalPos = JSON.parse(JSON.stringify({
          x: that.positions.clickPos.CORD.x,
          y: that.positions.clickPos.CORD.y
        }));

        that.update.clickPosition(that,
          e.clientX - that.CONSTANTS.area.x,
          e.clientY - that.CONSTANTS.area.y
        );

        allowed = that.restricted.isCordAllowed(that,
          that.positions.clickPos.CORD.x,
          that.positions.clickPos.CORD.y
        );

        sameCordAsBefore = that.restricted.isCordSameAsNow(
          that, that.positions.clickPos.CORD, originalPos
        );

        if (allowed && !sameCordAsBefore) {

          let from = {
            x: that.positions.playerPos.CORD.x,
            y: that.positions.playerPos.CORD.y
          }, to = {
            x: that.positions.clickPos.CORD.x,
            y: that.positions.clickPos.CORD.y
          };

          that.movement.movePlayerFromStartToEnd(from, to);

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
    this.paint.img.charStillInit();
    this.paint.img.charMovementAllInit();
    this.events.init();
    this.update.areaViewportPosition(that);
    //this.utils.createRandomRestrictedArea();
    //this.paint.updateCanvas(that, BOXSIZE);
  }

};

module.exports.canvas = that;
