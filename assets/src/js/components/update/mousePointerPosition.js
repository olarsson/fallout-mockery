module.exports.mousePointerPosition = (that,x,y) => {

  that.positions.mousePointer.PX.x = x;
  that.positions.mousePointer.PX.y = y;

  let calcCords = that.cords.getCords.small(x,y),
  cordType = that.cords.typeOfCord(
    that, calcCords.CORD
  );

  if (cordType.type !== that.paint.img.cursorCurrentIdx) {

    that.paint.img.cursorCurrentIdx = cordType.type;

    if (cordType.type === 0) {
      that.paint.img.cursorCurrent.src = that.paint.img.cursorStandard.src;
    } else
    if (cordType.type === 1) {
      that.paint.img.cursorCurrent.src = that.paint.img.cursorRestricted.src;
    } else
    if (cordType.type === 2) {
      that.paint.img.cursorCurrent.src = that.paint.img.cursorEnemy.src;
    } else
    if (cordType.type === 3) {
      that.paint.img.cursorCurrent.src = that.paint.img.cursorTouch.src;
    }

  }

  that.positions.mousePointer.CORD.x = calcCords.CORD.x;
  that.positions.mousePointer.CORD.y = calcCords.CORD.y;

};
