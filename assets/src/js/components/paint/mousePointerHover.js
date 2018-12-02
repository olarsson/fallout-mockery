module.exports.mousePointerHover = (that) => {

  that.hexagon.grid.drawHexAtColRow(
    that.positions.mousePointer.HEX.CORD.x,
    that.positions.mousePointer.HEX.CORD.y,
    "rgba(255,0,255,0.2)",
  );

};
