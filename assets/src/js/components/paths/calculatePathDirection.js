module.exports.calculatePathDirection = (that,from,to) => {

  let directionX = '/', directionY = '/';

  if (from.x < to.x) {
    directionX = '+'
  } else
  if (from.x > to.x) {
    directionX = '-'
  }

  if (from.y < to.y) {
    directionY = '+'
  } else
  if (from.y > to.y) {
    directionY = '-'
  }

  return {
    directionX: directionX,
    directionY: directionY
  };

/*  return that.cords.getNextCord(that,
    from.x,from.y,directionX,directionY
  );*/

};
