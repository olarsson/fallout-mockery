module.exports.typeOfCord = (that,cord) => {

  /*{
    canMoveTo: boolean,
    type: int //
      0 = nothing,
      1 = non-interactive,
      2 = living enemy
      3 = dead enemy
      4 = player
  }*/

  let nonInteractive = false, canMoveTo = true, enemyCord = false, type = 0;

  that.enemies.list.map(enemy => {
    if (
      enemy.CORD.x === cord.x &&
      enemy.CORD.y === cord.y
    ) {
      if (enemy.alive) {
        type = 2;
        enemyCord = true;
        nonInteractive = true;
      } else {
        type = 3;
        enemyCord = false;
        nonInteractive = false;
      }
    }
  });

  nonInteractive = !that.restricted.isCordRestricted(that,
    cord.x, cord.y
  );

  if (nonInteractive || enemyCord) canMoveTo = false;

  if (nonInteractive && !enemyCord) type = 1;

  return {
    type: type,
    canMoveTo: canMoveTo,
    enemy: enemyCord
  };

};
