import type { Cord, EnemyEntity, GameState, TileQueryResult, TileType } from '@/core/types';
import { isWalkable } from '@/grid/RestrictionMap';

export function queryTile(state: GameState, cord: Cord): TileQueryResult {
  let type: TileType = 0;
  let enemyCord = false;
  let nonInteractive = false;

  for (const enemy of state.enemies) {
    if (enemy.HEX.CORD.x === cord.x && enemy.HEX.CORD.y === cord.y) {
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
  }

  nonInteractive = !isWalkable(state, cord.x, cord.y);

  const canMoveTo = !(nonInteractive || enemyCord);
  if (nonInteractive && !enemyCord) type = 1;

  return { type, canMoveTo, enemy: enemyCord };
}

export function findEnemyAt(state: GameState, cord: Cord): EnemyEntity | undefined {
  return state.enemies.find(
    (enemy) => enemy.HEX.CORD.x === cord.x && enemy.HEX.CORD.y === cord.y,
  );
}
