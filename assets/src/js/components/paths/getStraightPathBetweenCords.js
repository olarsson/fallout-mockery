module.exports.getStraightPathBetweenCords = (that,from,to) => {

  let
  i,
  nextCords,
  previousDestination = from,
  pathDirection,
  isPathPossible = true,
  pathLength = 0;

  for (i = 0; i < that.CONSTANTS.longestPath; i++) {

    pathDirection = that.paths.calculatePathDirection(that,previousDestination,to);

    nextCords = that.cords.getNextCord(that,
      previousDestination.x,previousDestination.y,
      pathDirection.directionX,
      pathDirection.directionY,
      true //check if cord is restricted
    );

    pathLength++;

    if (nextCords.restricted) isPathPossible = false;

    previousDestination = nextCords.newCords;

    if (nextCords.newCords.x == to.x && nextCords.newCords.y == to.y) {
      break;
    }

  }

  return {
    pathLength,
    isPathPossible
  }

};
