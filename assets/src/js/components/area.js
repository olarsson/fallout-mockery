import {getCords} from './cords.js';

var that = {

  elem: {
    area: o('.area', 1),
    mouseBox: o('.area .mouseBox', 1),
    mousePointer: o('.area .mousePointer', 1),
    player: o('.area .player', 1),
    restrictedBoxes: o('.area .restrictedBoxes', 1)
  },

  mouseBox: {
    width: 45,
    height: 45,
    halfWidth: 22.5,
    halfHeight: 22.5
  },

  defaults: {

    positionsX: 600 / 45,
    positionsY: 450 / 45,

    area: {
      width: 600,
      height: 450,
      x: null,
      y: null
    },

    movementPos: {
      x: 0,
      y: 0
    },

    clickPos: {
      x: 0,
      y: 0,
      smallX: 0,
      smallY: 0
    },

  },

  restricted: {

    cords: [
      {
        x: 1,
        y: 2
      },
      {
        x: 4,
        y: 3
      }
    ],

    paintAreas() {

      let html = '';

      that.restricted.cords.map(xy => {
        html += `<div class="restrictedBox" style="top: ${xy.y * that.mouseBox.height}px; left: ${xy.x * that.mouseBox.width}px;"></div>`;
      });

      that.elem.restrictedBoxes.innerHTML = html;

    },

    isCordAllowed(x,y) {
      return !that.restricted.cords.find(xy => {
        return (xy.x === x && xy.y === y)
      });
    }

  },

  defaultXY() {
    let XY = that.elem.area.getBoundingClientRect();
    that.defaults.area.x = XY.x;
    that.defaults.area.y = XY.y;
  },

  setMousePointerPosition(x,y) {
    that.elem.mousePointer.style.cssText = `
      transform: translate3d(${x - 5}px, ${y - 5}px, 0px);
    `;
  },

  setMouseBoxPosition(x,y) {

    let stiffCordsInPx = that.getCords.final(x,y);

    if (!that.restricted.isCordAllowed(
      stiffCordsInPx.smallX, stiffCordsInPx.smallY)
    ) return;

    that.elem.mouseBox.style.cssText = `
      transform: translate3d(${stiffCordsInPx.stiffX}px, ${stiffCordsInPx.stiffY}px, 0px);
    `;

  },

  setPlayerPosition(x,y) {

    x = x * that.mouseBox.width;
    y = y * that.mouseBox.height;

    let stiffCordsInPx = that.getCords.final(x,y);

    if (!that.restricted.isCordAllowed(
      stiffCordsInPx.smallX, stiffCordsInPx.smallY)
    ) return;

    that.elem.player.style.cssText = `
      transform: translate3d(${stiffCordsInPx.stiffX}px, ${stiffCordsInPx.stiffY}px, 0px);
    `;

  },

  updateClickXY(x,y) {

    let clickPos = that.defaults.clickPos;

    clickPos.x = x;
    clickPos.y = y;

    let stiffCordsSmall = that.getCords.small(x,y);

    clickPos.smallX = stiffCordsSmall.smallX;
    clickPos.smallY = stiffCordsSmall.smallY;

  },

  updateMovementXY(x,y) {
    that.defaults.movementPos.x = x;
    that.defaults.movementPos.y = y;
  },

  getCordsFromStartToEnd(startCords,endCords) {
    let xAxis = that.rangeBetweenNumber(startCords.smallX, endCords.smallX),
    yAxis = that.rangeBetweenNumber(startCords.smallY, endCords.smallY);
    return {
      xAxis,
      yAxis
    };
  },

  calculatePath(xAxis,yAxis) {

    let xLargest = true, mean, primaryArray, secondaryArray, mergedMovement = [];

    if (xAxis.length < yAxis.length) {
      xLargest = false;
      mean = Math.round(yAxis.length / xAxis.length);
      primaryArray = yAxis;
      secondaryArray = xAxis;
    } else {
      mean = Math.round(xAxis.length / yAxis.length);
      primaryArray = xAxis;
      secondaryArray = yAxis;
    }

    let moveTo = {
      secondary: secondaryArray[0]
    },
    count = 1;

    primaryArray.map((prim, idx) => {

      count++;

      moveTo.primary = prim;
      if (count >= mean && secondaryArray.length > 0) {
        count = 1;
        moveTo.secondary = secondaryArray.shift()
        //console.log(secondaryArray.shift());
        //secondaryArray
      }

      //console.log(moveTo);

      mergedMovement.push({
        a: moveTo.primary,
        b: moveTo.secondary
      });

/*      setTimeout(() => {
        console.log('set');
        that.setPlayerPosition(
          moveTo.primary * that.mouseBox.width,
          moveTo.secondary * that.mouseBox.width
        );
      }, idx * 100)*/

    });

    console.log(xLargest ? 'x,y' : 'y,x', mergedMovement);

    mergedMovement.map((cords, i) => {

      setTimeout(() => {
        that.setPlayerPosition(
          xLargest ? cords.a : cords.b,
          xLargest ? cords.b : cords.a,
        );
      }, i * 100)

    });

/*    console.log(
      mean,
      'primaryArray.length:' + primaryArray.length,
      'secondaryArray.length:' + secondaryArray.length,
      'xAxis' + xAxis,
      'yAxis' + yAxis,
      secondaryArray
    );*/

    //console.log(mean);

  },

  movePlayerFromStartToEnd(axises) {

    that.calculatePath(
      axises.xAxis,
      axises.yAxis
    )

    return;

    let xAxis = axises.xAxis,
    yAxis = axises.yAxis;

    xAxis.map((x, idx) => {
      //if (idx === 0) {
      //console.log(x, idx);

      that.setPlayerPosition(
        x * that.mouseBox.width,
        0
      );
      //((idx) => {
/*        setInterval(() => {
          that.setPlayerPosition(x, 0)
        }, idx * 250)*/
      //});
      //setInt
      //}
    });

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

    this.elem.area.addEventListener('mousemove', function(e) {

      let defs = that.defaults;

      requestAnimationFrame(() => {
        that.updateMovementXY(
          e.clientX - defs.area.x,
          e.clientY - defs.area.y
        );
        that.setMousePointerPosition(
          defs.movementPos.x,
          defs.movementPos.y
        );
      });
    });

    this.elem.area.addEventListener('click', function(e) {

      let defs = that.defaults;

      let originalPos = JSON.parse(JSON.stringify({
        smallX: defs.clickPos.smallX,
        smallY: defs.clickPos.smallY
      }));

      that.updateClickXY(
        e.clientX - defs.area.x,
        e.clientY - defs.area.y
      );

      let axisRange = that.getCordsFromStartToEnd(
        originalPos, {
          smallX: defs.clickPos.smallX,
          smallY: defs.clickPos.smallY,
        }
      );

      that.movePlayerFromStartToEnd(axisRange);

      that.setMouseBoxPosition(defs.clickPos.x,defs.clickPos.y);

    });

  },

  init() {

    this.getCords = getCords(this);

    this.events();
    this.defaultXY();
    this.restricted.paintAreas();
  }

};

module.exports.area = that;
