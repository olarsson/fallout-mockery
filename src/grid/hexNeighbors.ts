import { GRID_COLS, GRID_ROWS } from '@/core/constants';
import type { Cord } from '@/core/types';

export function isInGridBounds(x: number, y: number): boolean {
  return x >= 0 && x <= GRID_COLS && y >= 0 && y <= GRID_ROWS;
}

/** All six hex neighbors for the game's odd/even column layout. */
export function getHexNeighbors(x: number, y: number): Cord[] {
  const neighbors: Cord[] = [
    { x, y: y - 1 },
    { x, y: y + 1 },
  ];

  if (x % 2 === 1) {
    neighbors.push(
      { x: x + 1, y },
      { x: x + 1, y: y + 1 },
      { x: x - 1, y: y + 1 },
      { x: x - 1, y },
    );
  } else {
    neighbors.push(
      { x: x + 1, y: y - 1 },
      { x: x + 1, y },
      { x: x - 1, y },
      { x: x - 1, y: y - 1 },
    );
  }

  return neighbors.filter((cord) => isInGridBounds(cord.x, cord.y));
}

export function cordKey(cord: Cord): string {
  return `${cord.x},${cord.y}`;
}
