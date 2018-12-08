module.exports.calculatePathDirection = (that,from,to) => {

  let directionX = '', directionY = '';

  //debugger

  if (from.x % 2 === 1) {

    //odd columns

    if (to.x > from.x && to.y === from.y) {
      directionX = '+'
      directionY = '-'
    } else
    if (to.x > from.x && to.y > from.y) {
      directionX = '+'
      directionY = '+'
    } else
    if (to.x === from.x && to.y > from.y) {
      directionX = '/'
      directionY = '+'
    } else
    if (to.x < from.x && to.y > from.y) {
      directionX = '-'
      directionY = '+'
    } else
    if (to.x < from.x && to.y === from.y) {
      directionX = '-'
      directionY = '-'
    } else
    if (to.x === from.x && to.y < from.y) {
      directionX = '/'
      directionY = '-'
    } else
    //
    if (to.x > from.x && to.y < from.y) {
      directionX = '+'
      directionY = '-'
    } else
    if (to.x < from.x && to.y > from.y) {
      directionX = '-'
      directionY = '+'
    } else
    if (to.x < from.x && to.y < from.y) {
      directionX = '-'
      directionY = '-'
    //
    } else {
      debugger
    }

  } else {

    //even columns

    if (to.x > from.x && to.y < from.y) {
      directionX = '+'
      directionY = '-'
    } else
    if (to.x > from.x && to.y === from.y) {
      directionX = '+'
      directionY = '+'
    } else
    if (to.x === from.x && to.y > from.y) {
      directionX = '/'
      directionY = '+'
    } else
    if (to.x < from.x && to.y === from.y) {
      directionX = '-'
      directionY = '+'
    } else
    if (to.x < from.x && to.y < from.y) {
      directionX = '-'
      directionY = '-'
    } else
    if (to.x === from.x && to.y < from.y) {
      directionX = '/'
      directionY = '-'
    } else
    //
    if (to.x > from.x && to.y > from.y) {
      directionX = '+'
      directionY = '+'
    } else
    if (to.x < from.x && to.y > from.y) {
      directionX = '-'
      directionY = '+'
    }
    //
    else {
      debugger
    }

  }

  return {
    directionX: directionX,
    directionY: directionY
  };

};
