import {getCords} from './cords.js';

var that = {

  elem: {
    area: o('#canvas', 1),
    mouseBox: o('.area .mouseBox', 1),
    mousePointer: o('.area .mousePointer', 1),
    player: o('.area .player', 1),
    restrictedBoxes: o('.area .restrictedBoxes', 1)
  },

  canvas: document.getElementById('canvas').getContext('2d'),

  mouseBox: {
    width: 45,
    height: 45,
    halfWidth: 22.5,
    halfHeight: 22.5
  },

  defaults: {

    positionsX: 630 / 45,
    positionsY: 450 / 45,

    area: {
      width: 630,
      height: 450,
      x: null,
      y: null
    },

    mousePointer: {
      x: 0,
      y: 0
    },

    clickPos: {
      x: 0,
      y: 0,
      smallX: 0,
      smallY: 0
    },

    playerPos: {
      x: 0,
      y: 0,
      smallX: 0,
      smallY: 0
    }

  },

  restricted: {

    cords: [
      {x:1,y:1},
      {x:1,y:2},
      {x:1,y:3},
      {x:4,y:3},
      {x:4,y:5},
      {x:4,y:6},
      {x:3,y:6},
      {x:2,y:6}
    ],

    isCordAllowed(x,y) {
      if (x > that.defaults.positionsX || x < 0) return false;
      if (y > that.defaults.positionsY || y < 0) return false;
      return !that.restricted.cords.find(xy => {
        return (xy.x === x && xy.y === y)
      });
    }

  },

  utils: {

    fixCanvasSize() {
      var canvases = document.getElementsByTagName("canvas");
      for (var i=0; i<canvases.length; i++) {
        let canvas = canvases[i];
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
    }

  },

  update: {

    areaViewportPosition() {
      let XY = that.elem.area.getBoundingClientRect();
      that.defaults.area.x = XY.x;
      that.defaults.area.y = XY.y;
    },

    mousePointerPosition(x,y) {
      that.defaults.mousePointer.x = x;
      that.defaults.mousePointer.y = y;
    },

    clickPosition(x,y) {

      let clickPos = that.defaults.clickPos;

      clickPos.x = x;
      clickPos.y = y;

      console.log();

      let stiffCordsSmall = that.getCords.small(x,y);

      clickPos.smallX = stiffCordsSmall.smallX;
      clickPos.smallY = stiffCordsSmall.smallY;

    },

    playerBoxPosition(x,y) {

      x = x * that.mouseBox.width;
      y = y * that.mouseBox.height;

      let stiffCordsInPx = that.getCords.final(x,y);

      if (!that.restricted.isCordAllowed(
        stiffCordsInPx.smallX, stiffCordsInPx.smallY)
      ) return;

      that.defaults.playerPos = {
        x: stiffCordsInPx.stiffX,
        y: stiffCordsInPx.stiffY,
        smallX: stiffCordsInPx.smallX,
        smallY: stiffCordsInPx.smallY
      };

    },

  },

  paint: {

    grid() {
      that.canvas.beginPath();
      for (let i = 1; i <= 13; i++) {
        that.canvas.moveTo(i * 45,0);
        that.canvas.lineTo(i * 45,450);
        that.canvas.strokeStyle="#ffd587";
        that.canvas.stroke();
        if (i <= 9) {
          that.canvas.moveTo(0, i * 45);
          that.canvas.lineTo(630, i * 45);
          that.canvas.stroke();
        }
      }
    },

    mousePointer() {
      that.canvas.beginPath();
      that.canvas.arc(
        that.defaults.mousePointer.x,
        that.defaults.mousePointer.y,
        10,0,2*Math.PI
      );
      that.canvas.strokeStyle = "#000";
      that.canvas.stroke();
    },

    restrictedAreas() {
      that.restricted.cords.map(xy => {
        that.canvas.fillStyle = 'red';
        that.canvas.fillRect(
          xy.x * that.mouseBox.width,
          xy.y * that.mouseBox.height,
          45,45
        );
      });
    },

    playerBox() {
      that.canvas.fillStyle = '#fff';
      that.canvas.fillRect(
        that.defaults.playerPos.x,
        that.defaults.playerPos.y,
        45,45
      );
    },

    clearScreen() {
      that.canvas.clearRect(0, 0, that.defaults.area.width, that.defaults.area.height);
    },

    updateScreen() {
      that.paint.clearScreen();
      that.paint.grid();
      that.paint.restrictedAreas();
      that.paint.playerBox();
      that.paint.mousePointer();
    }

  },

  demoninator(x,y) {

    if (x === y) return x;

    if (x === '/') return y;

    if (y === '/') return x;

    console.log('UNDEFINED: ',x,y);

  },

/*  setMouseBoxPosition(x,y) {

    let stiffCordsInPx = that.getCords.final(x,y);

    if (!that.restricted.isCordAllowed(
      stiffCordsInPx.smallX, stiffCordsInPx.smallY)
    ) return;

    that.elem.mouseBox.style.cssText = `
      transform: translate3d(${stiffCordsInPx.stiffX}px, ${stiffCordsInPx.stiffY}px, 0px);
    `;

  },*/

  getCordsFromStartToEnd(startCords,endCords) {
    let xAxis = that.rangeBetweenNumber(startCords.smallX, endCords.smallX),
    yAxis = that.rangeBetweenNumber(startCords.smallY, endCords.smallY);
    return {
      xAxis,
      yAxis
    };
  },

  getNextCord(xDestination,yDestination,directionX,directionY) {

    let prioIndex,
    prioStep = 1,
    prioStepPlus, prioStepMinus,
    iPlus, iMinus,
    prioArray = [],
    prioritiesList = [
      '--','/-','+-','+/','++','/+','-+','-/'
    ];

    if (xDestination === -0) xDestination = 0;
    if (yDestination === -0) yDestination = 0;

    console.log(xDestination,yDestination);

    prioIndex = prioritiesList.indexOf(directionX+directionY);
    iPlus = prioIndex;
    iMinus = prioIndex;

    prioArray.push(directionX+directionY)

    do {
      prioStep++;
      iPlus++;
      iMinus--;
      prioStepPlus++;
      prioStepMinus--;
      if (iPlus > prioritiesList.length - 1) iPlus = 0;
      if (iMinus === -1) iMinus = prioritiesList.length - 1;
      prioArray.push(prioritiesList[iPlus]);
      prioArray.push(prioritiesList[iMinus]);
    } while (prioStep <= 4)

    prioArray.splice(-1,1);

    //prioArray.forEach(cords => {
    for (var i = 0; i < prioArray.length; i++) {
      let newCords = {
        x: xDestination,
        y: yDestination
      }, x = prioArray[i].substr(0,1), y = prioArray[i].substr(1,1);

      if (x === '+') {
        newCords.x = xDestination+1;
      } else
      if (x === '-') {
        newCords.x = xDestination-1;
      }

      if (y === '+') {
        newCords.y = xDestination+1;
      } else
      if (y === '-') {
        newCords.y = xDestination-1;
      }

      if (that.restricted.isCordAllowed(newCords.x,newCords.y)) {
        //console.log(newCords);
        return newCords;
      }

    };

    console.log('NO CORDS?');

    //});

  },

  calculatePathNew(from,to) {

    let directionX = '/', directionY = '/';

    //console.log(from,to);

    //that.update.playerBoxPosition(to.x,to.y);

    directionX = from.x < to.x ? '+' : '-';
    directionY = from.y < to.y ? '+' : '-';

/*    if (from.x < to.x) {
      directionX = '+';
    } else
    if (from.x > to.x) {
      directionX = '-';
    } else {
      directionX = '/';
    }

    if (from.y < to.y) {
      directionY = '+';
    } else
    if (from.y > to.y) {
      directionY = '-';
    } else {
      directionY = '/';
    }*/

    that.update.playerBoxPosition(to.x,to.y);

    let nextCords = that.getNextCord(from.x,from.y,directionX,directionY);

    console.log(
      nextCords
    );

/*    that.update.playerBoxPosition(
      nextCords.x,
      nextCords.y
    );*/

    //directionY = from.y < to.y ? 'down' : 'up';

    //console.log(from.y, to.y, directionX,directionY);

    //that.getNextCord(x,to.y,directionX,directionY);

/*

    let path = [], fromX, toX;



    if (directionX === 'left') {

      for (let i = from.x; i >= to.x; i--) {
        console.log(i);
      }

    } else {

      for (let x = from.x; x <= to.x; x++) {
        //check if cord is ok
        let accepted = that.restricted.isCordAllowed(x, to.y);

        if (accepted) {
          path.push({
            x: x,
            y: to.y
          })
        } else {

          that.getNextCord(x,to.y,directionX,directionY);

        }

      }

    }

    */

    //console.log(path, directionX, directionY);

  /*  let currentAxis = that.defaults.playerPos
    console.log(currentAxis,xAxis,yAxis);*/
  },

  calculatePath(xAxis,yAxis) {

    let xLargest = true,
    meanDiff,
    primaryArray,
    secondaryArray,
    mergedMovement = [],
    moveTo = {},
    count = 1,
    arrA,
    arrB;

    xLargest = !(xAxis.length < yAxis.length);

    if (xAxis.length < yAxis.length) {
      arrA = yAxis;
      arrB = xAxis;
    } else {
      arrA = xAxis;
      arrB = yAxis;
    }

    meanDiff = Math.round(arrA.length / arrB.length);
    primaryArray = arrA;
    secondaryArray = arrB;

    moveTo.secondary = secondaryArray[0];

    primaryArray.map((prim, idx) => {

      count++;

      moveTo.primary = prim;
      if (count >= meanDiff && secondaryArray.length > 0) {
        count = 1;
        moveTo.secondary = secondaryArray.shift()
      }

      console.log(moveTo, that.restricted.isCordAllowed(
        moveTo.primary, moveTo.secondary
      ));

      //isCordAllowed

      mergedMovement.push({
        a: moveTo.primary,
        b: moveTo.secondary
      });

    });

    return {
      mergedMovement,
      xLargest
    };

    //that.movePlayerAlongPathStepByStep(mergedMovement, xLargest);

    //console.log(xLargest ? 'x,y' : 'y,x', mergedMovement);

/*    console.log(
      meanDiff,
      'primaryArray.length:' + primaryArray.length,
      'secondaryArray.length:' + secondaryArray.length,
      'xAxis' + xAxis,
      'yAxis' + yAxis,
      secondaryArray
    );*/

  },

  movePlayerAlongPathStepByStep(axises, xLargest) {

    axises.map((cords, i) => {

      setTimeout(() => {
        that.update.playerBoxPosition(
          xLargest ? cords.a : cords.b,
          xLargest ? cords.b : cords.a,
        );
      }, i * 100);

    });

  },

  movePlayerFromStartToEnd(axises) {

    let calculatedPath = that.calculatePathNew(
      axises.xAxis,
      axises.yAxis
    );

/*    that.movePlayerAlongPathStepByStep(
      calculatedPath.mergedMovement,
      calculatedPath.xLargest
    );*/

  },

  rangeBetweenNumber(lowEnd, highEnd) {
    let list = [], from = lowEnd, to = highEnd, reverseDirection = false;

    if (lowEnd > highEnd) {
      from = highEnd;
      to = lowEnd;
      reverseDirection = true;
    }

    for (let i = from; i <= to; i++) {
      list.push(i);
    }

    if (reverseDirection) list = list.reverse();
    return list
  },

  events() {

    setInterval(() => {
      requestAnimationFrame(() => {
        that.paint.updateScreen();
      });
    }, 10);

    this.elem.area.addEventListener('mousemove', function(e) {
      requestAnimationFrame(() => {
        that.update.mousePointerPosition(
          e.clientX - that.defaults.area.x,
          e.clientY - that.defaults.area.y
        );
      });
    });

    this.elem.area.addEventListener('click', function(e) {

      let defs = that.defaults;

      let originalPos = JSON.parse(JSON.stringify({
        smallX: defs.clickPos.smallX,
        smallY: defs.clickPos.smallY
      }));

      that.update.clickPosition(
        e.clientX - defs.area.x,
        e.clientY - defs.area.y
      );

      that.calculatePathNew(
        {
          x: that.defaults.playerPos.smallX,
          y: that.defaults.playerPos.smallY
        },
        {
          x: that.defaults.clickPos.smallX,
          y: that.defaults.clickPos.smallY
        }
      );

/*      let axisRange = that.getCordsFromStartToEnd(
        originalPos, {
          smallX: defs.clickPos.smallX,
          smallY: defs.clickPos.smallY,
        }
      );

      that.movePlayerFromStartToEnd(axisRange);*/

      //that.setMouseBoxPosition(defs.clickPos.x,defs.clickPos.y);

    });

  },

  init() {

    that.utils.fixCanvasSize();

    this.getCords = getCords(this);
    this.events();
    this.update.areaViewportPosition();
    //this.areaViewportPosition();
    this.paint.updateScreen();
  }

};

module.exports.canvas = that;
