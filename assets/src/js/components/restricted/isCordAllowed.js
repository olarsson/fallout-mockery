module.exports.isCordAllowed = (that,x,y) => {
  let activeArr = that.restricted.cords
  if (that.restricted.dynamic) {
    activeArr = that.restricted.dynamicCords;
  }
  if (x > that.CONSTANTS.positionsXsmallTotal || x < 0) return false;
  if (y > that.CONSTANTS.positionsYsmallTotal || y < 0) return false;
  return !activeArr.find(xy => {
    return (xy.x === x && xy.y === y)
  });
};
