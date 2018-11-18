module.exports.getNextCord = (that,xDestination,yDestination,directionX,directionY) => {

  let prioIndex,
  prioStep = 1,
  prioStepPlus, prioStepMinus,
  iPlus, iMinus,
  prioArray = [],
  prioritiesList = that.CONSTANTS.cordPrioritiesList;

  if (xDestination === -0) xDestination = 0; // TODO:
  if (yDestination === -0) yDestination = 0; // TODO:

  prioIndex = prioritiesList.indexOf(directionX+directionY);
  iPlus = prioIndex;
  iMinus = prioIndex;

  prioArray.push(directionX+directionY)

  do {
    prioStep++;
    iPlus++;
    iMinus--;
    prioStepPlus++;
    prioStepMinus--;
    if (iPlus > prioritiesList.length - 1) iPlus = 0;
    if (iMinus === -1) iMinus = prioritiesList.length - 1;
    prioArray.push(prioritiesList[iPlus]);
    prioArray.push(prioritiesList[iMinus]);
  } while (prioStep <= 4)

  prioArray.splice(-1,1);

  for (var i = 0; i < prioArray.length; i++) {

    let newCords = {
      x: xDestination,
      y: yDestination
    },
    x = prioArray[i].substr(0,1),
    y = prioArray[i].substr(1,1);

    if (x === '+') {
      newCords.x = xDestination+1;
    } else
    if (x === '-') {
      newCords.x = xDestination-1;
    } else {
      //console.log('////////'); // TODO:
    }

    if (y === '+') {
      newCords.y = yDestination+1;
    } else
    if (y === '-') {
      newCords.y = yDestination-1;
    } else {
      //console.log('////////'); // TODO:
    }

    if (x === '/' && y === '-') console.log('banned!');

    if (
      that.restricted.isCordRestricted(that,newCords.x,newCords.y) &&
      !(x === '/' && (y === '-' || y === '+')) //disable down and up movement
    ) {
      return newCords;
    }

  };

  console.log('NO CORDS?'); // TODO:

};
