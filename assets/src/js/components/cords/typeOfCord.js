module.exports.typeOfCord = (that,cord) => {

  /*{
    canMoveTo: boolean,
    type: int //
      0 = nothing,
      1 = non-interactive,
      2 = enemy
  }*/

  let nonInteractive = false, canMoveTo = true, enemyCord = false, type = 0;

  that.targets.enemies.map(enemy => {
    if (
      enemy.CORD.x === cord.x &&
      enemy.CORD.y === cord.y
    ) {
      type = 2;
      enemyCord = true;
      nonInteractive = true;
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
