module.exports.enemyFacing = (that,idx,direction) => {
  Object.assign(that.enemies.list[idx].FACING, {
    x: direction.directionX,
    y: direction.directionY
  });
};
