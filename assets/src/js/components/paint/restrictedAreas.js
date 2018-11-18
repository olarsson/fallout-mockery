module.exports.restrictedAreas = (that) => {
  let activeArr = that.restricted.cords;
  //if (that.restricted.dynamic) activeArr = that.restricted.dynamicCords;
  activeArr.map(xy => {
    that.canvas.fillStyle = that.restricted.dynamic ? 'pink' : 'red';
    that.canvas.fillRect(
      xy.x * that.CONSTANTS.mouseBox.width,
      xy.y * that.CONSTANTS.mouseBox.height,
      that.CONSTANTS.mouseBox.width,that.CONSTANTS.mouseBox.height
    );
  });
};
