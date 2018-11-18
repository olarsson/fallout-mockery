module.exports.clickPosition = (that,x,y) => {

  let clickPos = that.positions.clickPos;

  clickPos.PX.x = x;
  clickPos.PX.y = y;

  let calcCords = that.cords.getCords.small(x,y);

  clickPos.CORD.x = calcCords.CORD.x;
  clickPos.CORD.y = calcCords.CORD.y;

};
