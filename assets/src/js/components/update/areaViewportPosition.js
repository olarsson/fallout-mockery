module.exports.areaViewportPosition = (that) => {
  let XY = that.elem.area.getBoundingClientRect();
  that.CONSTANTS.area.x = XY.x;
  that.CONSTANTS.area.y = XY.y;
};
