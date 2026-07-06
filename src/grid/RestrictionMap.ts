import { GRID_COLS, GRID_ROWS } from '@/core/constants';
import type { Cord, GameState } from '@/core/types';

/** Returns true when the tile is walkable (not in the restricted list). */
export function isWalkable(state: GameState, x: number, y: number): boolean {
  const activeArr = state.restricted.dynamic
    ? state.restricted.dynamicCords
    : state.restricted.cords;

  if (x > GRID_COLS || x < 0 || y > GRID_ROWS || y < 0) return false;

  return !activeArr.some((tile) => tile.x === x && tile.y === y);
}

export function isSameCord(a: Cord, b: Cord): boolean {
  return a.x === b.x && a.y === b.y;
}

export function beginDynamicRestrictions(state: GameState): void {
  state.restricted.dynamic = true;
  state.restricted.dynamicCords = [...state.restricted.cords];
}

export function endDynamicRestrictions(state: GameState): void {
  state.restricted.dynamic = false;
  state.restricted.dynamicCords = [];
}
