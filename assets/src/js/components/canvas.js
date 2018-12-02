//import './hexCords/rawHex.js';
import {HexagonGrid,getSelectedTile} from './hexCords/Hexagon.js';

const BOXSIZE = 25 / 1;
const BOXWIDTH = 700;
const BOXHEIGHT = 425;

//json
import {weaponsJSON} from './json/weapons.js';

//animations
import {animations} from './animations/animations.js';

//cordinates functions
import {getCords} from './cords/getCords.js';
import {getNextCord} from './cords/getNextCord.js';
import {typeOfCord} from './cords/typeOfCord.js';
import {getEnemyByCords} from './cords/getEnemyByCords.js';

//math functions
import {getRandomNumberInRange} from './math/getRandomNumberInRange.js';
import {generateUniqueID} from './math/generateUniqueID.js';

//path calculations
import {calculatePathDirection} from './paths/calculatePathDirection.js';
import {getStraightPathBetweenCords} from './paths/getStraightPathBetweenCords.js';

//restricted areas functions
import {isCordRestricted} from './restricted/isCordRestricted.js';
import {isCordSameAsNow} from './restricted/isCordSameAsNow.js';

//paint actions
import {combatStatus} from './paint/status/combatStatus.js';

import {imagesCollection} from './paint/imagesCollection.js';
import {bar} from './paint/bar/bar.js';
import {grid} from './paint/grid.js';
import {mouseCursor} from './paint/mouseCursor.js';
import {restrictedAreas} from './paint/restrictedAreas.js';
import {background} from './paint/background.js';
import {mousePointerHover} from './paint/mousePointerHover.js';

import {playerBox} from './paint/player/playerBox.js';
import {playerStillFacing} from './paint/player/playerStillFacing.js';
import {playerMoving} from './paint/player/playerMoving.js';
import {playerAttacking} from './paint/player/playerAttacking.js';

import {enemyBox} from './paint/enemy/enemyBox.js';
import {enemyStillFacing} from './paint/enemy/enemyStillFacing.js';

import {clearScreen} from './paint/clearScreen.js';
import {updateCanvas} from './paint/updateCanvas.js';

//update actions
import {areaViewportPosition} from './update/areaViewportPosition.js';
import {mousePointerPosition} from './update/mousePointerPosition.js';
import {clickPosition} from './update/clickPosition.js';
import {playerBoxPosition} from './update/playerBoxPosition.js';
import {playerFacing} from './update/playerFacing.js';

import {enemyFacing} from './update/enemyFacing.js';

//utilities
import {fixCanvasSize} from './utils/fixCanvasSize.js';
import {createRandomRestrictedArea} from './utils/createRandomRestrictedArea.js';

var that = {

  imports() {
    this.weapons = weaponsJSON;

    this.animations = animations(that);

    this.cords.getCords = getCords(that);
    this.cords.getNextCord = getNextCord;
    this.cords.typeOfCord = typeOfCord;
    this.cords.getEnemyByCords = getEnemyByCords;

    this.math.getRandomNumberInRange = getRandomNumberInRange;
    this.math.generateUniqueID = generateUniqueID;

    this.paths.calculatePathDirection = calculatePathDirection;
    this.paths.getStraightPathBetweenCords = getStraightPathBetweenCords;

    this.restricted.isCordRestricted = isCordRestricted;
    that.restricted.isCordSameAsNow = isCordSameAsNow;

    this.paint.combatStatus = combatStatus;
    this.paint.img = imagesCollection(that);
    this.paint.bar = bar;
    this.paint.grid = grid;
    this.paint.mouseCursor = mouseCursor;
    this.paint.restrictedAreas = restrictedAreas;
    this.paint.background = background;
    that.paint.mousePointerHover = mousePointerHover;

    this.paint.playerBox = playerBox;
    this.paint.playerStillFacing = playerStillFacing;
    this.paint.playerMoving = playerMoving;
    this.paint.playerAttacking = playerAttacking;

    this.paint.enemyBox = enemyBox;
    this.paint.enemyStillFacing = enemyStillFacing;

    this.paint.clearScreen = clearScreen;
    this.paint.updateCanvas = updateCanvas;

    this.update.areaViewportPosition = areaViewportPosition;
    this.update.mousePointerPosition = mousePointerPosition;
    this.update.clickPosition = clickPosition;
    this.update.playerBoxPosition = playerBoxPosition;
    this.update.playerFacing = playerFacing;
    this.update.enemyFacing = enemyFacing;

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
      '+-','++','/+','-+','--','/-'
    ]

  },

  elem: {
    area: o('#canvas', 1),
  },

  hexCords: {},

  math: {},

  canvas: document.getElementById('canvas').getContext('2d'),
  canvasBar: document.getElementById('canvasBar').getContext('2d'),

  weapons: {},

  enemies: {

    enemyIdToIndex(id) {
      let index = -1;
      that.enemies.list.filter((obj,idx) => {
        if (obj.id === id) {
          index = idx;
          return obj;
        }
      });
      return index;
    },

    createEnemy(x,y) {

      let enemy = {
        HEX: {
          CORD: {
            x: x,
            y: y
          },
/*          PX: {
            x: x * BOXSIZE,
            y: y * BOXSIZE
          }*/
        },
/*        CORD: {
          x: x,
          y: y
        },
        PX: {
          x: x * BOXSIZE,
          y: y * BOXSIZE
        },*/
        FACING: {
          x: '+',
          y: '+'
        },
        DEFAULTS: {
          actionPoints: 8
        },
        id: that.math.generateUniqueID(that),
        //state: 0,
        alive: true,
        health: 30,
        engaged: false,
        aggroRange: 5,
        actionPoints: 8,
        weapon: {}
      };

      Object.assign(enemy.weapon, that.weapons.rifle);

      that.enemies.list.push(enemy);

    },

    list: [],

  },

  hexagon: {

    grid: new HexagonGrid("canvas", 20),

  },

  combat: {

    inCombat: false,
    queuePos: 0,
    queue: [],

    setNextInQueue() {

      let nextPos = that.combat.queuePos, i = nextPos, resultPos = -1;

      nextPos++;
      if (nextPos > that.combat.queue.length - 1) nextPos = 0;

      //for (let i = nextPos; i < that.combat.queue.length - 1; i++) {
      while(true) {
        if (that.combat.queue[i].engaged && that.combat.queue[i].alive) {
          resultPos = i;
        }
        i++;
        if (i > that.combat.queue.length - 1) i = 0;
        if (i === that.combat.queuePos) break;
      }

      that.combat.queuePos = resultPos;

    },

    moveToNextInQueue() {

      that.combat.setNextInQueue();

      //nothing to move on to, assume end of combat
      if (that.combat.queuePos === -1) {
        that.combat.leaveCombat();
        console.log('--END OF COMBAT--');
        return;
      }

      //the next in turn is the player, enable player actions and exit
      if (that.combat.queue[that.combat.queuePos].id === '_player') {
        that.player.stopActions = false;
        console.log('--PLAYERS TURN--');
        return;
      }

      //its an enemy, make it attack, and stop player actions
      that.player.stopActions = true;
      console.log('--ENEMIES TURN--');

      that.combat.attackPlayer(that.combat.queue[that.combat.queuePos])

    },

    subtractActionPoints(player,points,subtractFromObject) {
      if (player) subtractFromObject = that.player;
      subtractFromObject.actionPoints -= points;
      if (subtractFromObject.actionPoints < 0) subtractFromObject.actionPoints = 0;
    },

    enterCombat() {
      console.log('enter combat scenario');
      that.combat.inCombat = true;
      that.player.actionPoints = that.player.DEFAULTS.actionPoints;
      that.combat.clearQueue();
      that.combat.populateQueue();
    },

    clearQueue() {
      that.combat.queuePos = 0;
      that.combat.queue.length = 0;
    },

    populateQueue() {
      that.combat.queue.push({
        id: '_player'
      });
      that.enemies.list.filter((enemy, idx) => {
        if (enemy.engaged) {
          that.combat.queue.push(that.enemies.list[idx])
        }
      });
      console.log(that.combat.queue);
    },

    leaveCombat() {
      that.player.stopActions = false;
      console.log('--leaving combat--');
    },

    attackPlayer(enemy) {
      console.log(enemy);

      let damage;

      //force the enemy to face the player
      that.update.enemyFacing(that,
        enemy.idx,
        that.paths.calculatePathDirection(that,
          enemy.CORD,
          that.positions.playerPos.HEX.CORD
        )
      );

      //check if enemy has enough actionPoints for the attack
      if (enemy.actionPoints < enemy.weapon.actionPoints) {
        //too few actionPoints, stop the attack
        return;
      } else {
        //subtract actionPoints and continue
        that.combat.subtractActionPoints(false,enemy.weapon.actionPoints,enemy);
      }

      //get a damage number based on the equipped weapon
      damage = that.math.getRandomNumberInRange(that,
        enemy.weapon.damage[0],
        enemy.weapon.damage[1]
      );

      //animate the attack
/*      that.player.animation.attackAnimation.start();
      let i = 0, attackTimer = setInterval(() => {
        i++;
        if (i === 4) {
          console.log('on hit action');
        } else
        if (i === 7) {
          endOfAttack();
        }
      }, 100);*/

      /*

      const endOfAttack = () => {
        clearInterval(attackTimer);
        that.player.animation.attackAnimation.stop();

        //subtract the damage from the enemy health
        enemy.health -= damage;

        //enemy was killed, unengage that enemy and change it state
        if (enemy.health <= 0) {
          enemy.alive = false;
          enemy.engaged = false;
        }

        //enable actions
        that.player.stopActions = false;

        //out of actionPoints! move to next entity in queue
        if (that.player.actionPoints === 0) {
          that.combat.moveToNextInQueue();
        }

      };

      //animate the attack
      that.player.animation.attackAnimation.start();
      let i = 0, attackTimer = setInterval(() => {
        i++;
        if (i === 4) {
          console.log('on hit action');
        } else
        if (i === 7) {
          endOfAttack();
        }
      }, 100);*/

    },

    attackEnemy(targetIdx) {

      let enemy = that.enemies.list[targetIdx], damage;

      //force the player to face the enemy
      that.update.playerFacing(that,
        that.paths.calculatePathDirection(that,
          that.positions.playerPos.HEX.CORD,
          enemy.CORD
        )
      );

      //check if player has enough actionPoints for the attack
      if (that.player.actionPoints < that.player.weapon.actionPoints) {
        //too few actionPoints, stop the attack
        return;
      } else {
        //subtract actionPoints and continue
        that.combat.subtractActionPoints(true,
          that.player.weapon.actionPoints,
          that.player
        );
      }

      //disable player actions
      that.player.stopActions = true;

      //get a damage number based on the equipped weapon
      damage = that.math.getRandomNumberInRange(that,
        that.player.weapon.damage[0],
        that.player.weapon.damage[1]
      );

      const endOfAttack = () => {
        clearInterval(attackTimer);
        that.player.animation.attackAnimation.stop();

        //subtract the damage from the enemy health
        enemy.health -= damage;

        //enemy was killed, unengage that enemy and change it state
        if (enemy.health <= 0) {
          enemy.alive = false;
          enemy.engaged = false;
        }

        //enable actions
        that.player.stopActions = false;

        //out of actionPoints! move to next entity in queue
        if (that.player.actionPoints === 0) {
          that.combat.moveToNextInQueue();
        }

      };

      //animate the attack
      that.player.animation.attackAnimation.start();
      let i = 0, attackTimer = setInterval(() => {
        i++;
        if (i === 4) {
          console.log('on hit action');
        } else
        if (i === 7) {
          endOfAttack();
        }
      }, 100);

    },

    tryCombat(from,to) {

      //get enemy by cords
      let enemy = that.cords.getEnemyByCords(that,to)
      //get straight path between cords, with range
      ,pathToEnemy = that.paths.getStraightPathBetweenCords(that,from,to);

      //attack is within required range, attack!
      if (pathToEnemy.pathLength <= that.player.weapon.range) {

        //consider enemy engaged, regardless of outcome
        that.enemies.list[enemy.idx].engaged = true;

        //if it's the combat first attack then clear any previous
        //combat queue and reset player actionPoints
        //also create a new combat queue with the player first in line
        if (!that.combat.inCombat) {
          that.combat.enterCombat();
        }

        //perform the actual attack on the enemy
        that.combat.attackEnemy(enemy.idx);

      //the enemy is not within range
      } else {

        console.log('the enemy is not within range');

        let pathDirection = that.paths.calculatePathDirection(that,
          enemy.CORD,
          that.positions.playerPos.HEX.CORD
        );

        that.update.enemyFacing(that,
          enemy.idx,
          pathDirection
        );

      }


    }

  },

  animations: {},

  player: {

    DEFAULTS: {
      actionPoints: 8,
    },

    //state: integer
    //0 = still
    //1 = moving
    //2 = attacking
    state: 0,
    actionPoints: 8,
    stopActions: false,
    weapon: {},

    temp: {
      attackStep: 0,
      haveBeenRun: false,
    },

    animations: {

      still: {},
      moving: {},
      attack: {}

    },

    animation: {

      startTime: null,

      assignDefaultToPlayer() {

        //still animation
        Object.assign(
          that.player.animations.still,
          that.animations.player.stillBasic
        );
        that.player.animations.still.init();

        //movement animation
        Object.assign(
          that.player.animations.moving,
          that.animations.player.movingBasic
        );
        that.player.animations.moving.init();

        //attack animation
        Object.assign(
          that.player.animations.attack,
          that.animations.player.gunFireBasic
        );
        that.player.animations.attack.init();

      },

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

      attackAnimation: {

        start() {
          that.player.animation.init(2);
        },

        stop() {
          that.player.animation.finished();
        }

      }

    }

  },

  positions: {

    mousePointer: {
      HEX: {
        PX: {
          x: 0,
          y: 0,
        },
        CORD: {
          x: 0,
          y: 0
        }
      }
    },

    clickPos: {
      HEX: {
        PX: {
          x: 0,
          y: 0,
        },
        CORD: {
          x: 0,
          y: 0
        }
      }
    },

    playerPos: {
      previousImgStep: 0,
      moveCounter: 0,
      FACING: {
        x: '+',
        y: '+'
      },
      HEX: {
        PX: {
          x: 0,
          y: 0,
        },
        CORD: {
          x: 0,
          y: 0
        }
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

  paint: {},

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
          previousDestination.x,
          previousDestination.y,
          pathDirection.directionX,
          pathDirection.directionY,
          true
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

      console.log(previousSteps);

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

    updateMousePointerPositionHEX() {
      that.elem.area.addEventListener("mousemove", function(e) {

        let tile = that.hexagon.grid.getSelectedTile(
          e.pageX - that.hexagon.grid.canvasOriginX,
          e.pageY - that.hexagon.grid.canvasOriginY
        );

        that.positions.mousePointer.HEX.CORD.x = tile.column;
        that.positions.mousePointer.HEX.CORD.y = tile.row;

        //console.log(that.positions.mousePointer.HEX.CORD);

      }, false);
    },

    click() {

      that.elem.area.addEventListener('click', function(e) {

        if (that.player.stopActions) return;

        let originalPos, allowed, sameCordAsBefore, cordType, from, to;

        //current/original click position
        originalPos = JSON.parse(JSON.stringify({
          x: that.positions.clickPos.HEX.CORD.x,
          y: that.positions.clickPos.HEX.CORD.y
        }));

        //set new cords for the click position
        that.update.clickPosition(that, e,
          e.clientX - that.CONSTANTS.area.x,
          e.clientY - that.CONSTANTS.area.y
        );

        //check if the new cords are the same as the old
        sameCordAsBefore = that.restricted.isCordSameAsNow(
          that, that.positions.clickPos.HEX.CORD, originalPos
        );

        //players current position
        from = {
          x: that.positions.playerPos.HEX.CORD.x,
          y: that.positions.playerPos.HEX.CORD.y
        };

        //destination click position
        to = {
          x: that.positions.clickPos.HEX.CORD.x,
          y: that.positions.clickPos.HEX.CORD.y
        };

        console.log(from);
        console.log(to);

        //determines if the cords is an enemy, a structure, etc..
        cordType = that.cords.typeOfCord(that,that.positions.clickPos.HEX.CORD);

        console.log(cordType);

        //MOVE = cord is nothing special, and cord is different than before
        if (cordType.type === 0 && !sameCordAsBefore) {
          that.movement.movePlayerFromStartToEnd(from, to);
        }

/*
         else
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
        }*/

      });

    },

    init() {
      //that.hexagon.init();
      that.events.updateInterface();
      that.events.updateMousePointerPosition();
      that.events.updateMousePointerPositionHEX();
      that.events.click();
    }

  },

  init() {
    this.imports();
    this.utils.fixCanvasSize();

    //assign default weapon (a gun) to player
    Object.assign(this.player.weapon, that.weapons.gun);

    this.paint.img.barInit();
    this.paint.img.bgDesertInit();

    this.paint.img.cursorStandardInit();
    this.paint.img.cursorCurrentInit();
    this.paint.img.cursorEnemyInit();
    this.paint.img.cursorRestrictedInit();
    this.paint.img.cursorTouchInit();

    //this.paint.img.playerStillInit();

    that.player.animation.assignDefaultToPlayer();

    //this.paint.img.charMovementAllInit();

    this.paint.img.enemyStillInit();

    this.enemies.createEnemy(8,6);
    this.enemies.createEnemy(13,8);

    this.events.init();
    this.update.areaViewportPosition(that);
    //this.utils.createRandomRestrictedArea(that);
  }

};

module.exports.canvas = that;
