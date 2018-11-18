module.exports.playerFacing = (that,direction) => {
  Object.assign(that.positions.playerPos.FACING, {
    x: direction.directionX,
    y: direction.directionY
  });
};
