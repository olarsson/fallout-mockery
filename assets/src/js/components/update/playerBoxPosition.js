module.exports.playerBoxPosition = (that,column,row) => {

  //x = x * that.CONSTANTS.mouseBox.width;
  //y = y * that.CONSTANTS.mouseBox.height;

  let colRowToPX = that.hexagon.grid.getPXAtColRow(column,row);

  //let calcCords = that.cords.getCords.final(x,y);

  Object.assign(that.positions.playerPos, {
/*    PX: {
      x: calcCords.PX.x,
      y: calcCords.PX.y
    },
    CORD: {
      x: calcCords.CORD.x,
      y: calcCords.CORD.y
    },*/
    HEX: {
      PX: {
        x: colRowToPX.x,
        y: colRowToPX.y
      },
      CORD: {
        x: column,
        y: row
      }
    }
  });

/*  that.positions.playerPos = {
    PX: {
      x: calcCords.PX.x,
      y: calcCords.PX.y
    },
    CORD: {
      x: calcCords.CORD.x,
      y: calcCords.CORD.y
    }
  };*/

};
