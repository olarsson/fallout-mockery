module.exports.playerBoxPosition = (that,x,y) => {

  x = x * that.CONSTANTS.mouseBox.width;
  y = y * that.CONSTANTS.mouseBox.height;

  let calcCords = that.cords.getCords.final(x,y);

  that.positions.playerPos = {
    PX: {
      x: calcCords.PX.x,
      y: calcCords.PX.y
    },
    CORD: {
      x: calcCords.CORD.x,
      y: calcCords.CORD.y
    }
  };

};
