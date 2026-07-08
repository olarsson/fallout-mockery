import { CORD_PRIORITIES, GRID_COLS } from '@/core/constants';
import type { Cord, Facing, FacingKey, GameState, NextCordResult, PathDirection } from '@/core/types';
import { cordKey, getHexNeighbors, isInGridBounds } from '@/grid/hexNeighbors';
import { isWalkable } from '@/grid/RestrictionMap';

export function getNextCord(
  state: GameState,
  x: number,
  y: number,
  directionX: string,
  directionY: string,
  checkRestricted = true,
): NextCordResult | undefined {
  const direction = `${directionX}${directionY}` as FacingKey;
  let prioIndex = CORD_PRIORITIES.indexOf(direction);
  if (prioIndex === -1) prioIndex = 0;

  const prioArray: FacingKey[] = [direction];
  let prioStep = 1;
  let iPlus = prioIndex;
  let iMinus = prioIndex;

  do {
    prioStep += 1;
    iPlus += 1;
    iMinus -= 1;
    if (iPlus > CORD_PRIORITIES.length - 1) iPlus = 0;
    if (iMinus === -1) iMinus = CORD_PRIORITIES.length - 1;
    const plusDir = CORD_PRIORITIES[iPlus];
    const minusDir = CORD_PRIORITIES[iMinus];
    if (plusDir) prioArray.push(plusDir);
    if (minusDir) prioArray.push(minusDir);
  } while (prioStep <= 4);

  prioArray.pop();

  for (const prio of prioArray) {
    const newCords: Cord = { x, y };
    let blocked = false;

    if (prio === '/-') newCords.y = y - 1;
    if (prio === '/+') newCords.y = y + 1;

    if (x % 2 === 1) {
      if (prio === '+-') newCords.x = x + 1;
      if (prio === '++') {
        newCords.x = x + 1;
        newCords.y = y + 1;
      }
      if (prio === '-+') {
        newCords.x = x - 1;
        newCords.y = y + 1;
      }
      if (prio === '--') newCords.x = x - 1;
    } else {
      if (prio === '+-') {
        newCords.x = x + 1;
        newCords.y = y - 1;
      }
      if (prio === '++') newCords.x = x + 1;
      if (prio === '-+') newCords.x = x - 1;
      if (prio === '--') {
        newCords.x = x - 1;
        newCords.y = y - 1;
      }
    }

    if (checkRestricted) {
      blocked = !isWalkable(state, newCords.x, newCords.y);
    }

    if (!blocked) {
      return { newCords, restricted: blocked };
    }
  }

  return undefined;
}

export function calculatePathDirection(
  from: Cord,
  to: Cord,
): { directionX: '+' | '-' | '/'; directionY: '+' | '-' } {
  let directionX: '+' | '-' | '/' = '+';
  let directionY: '+' | '-' = '+';

  if (from.x % 2 === 1) {
    if (to.x > from.x && to.y === from.y) {
      directionX = '+';
      directionY = '-';
    } else if (to.x > from.x && to.y > from.y) {
      directionX = '+';
      directionY = '+';
    } else if (to.x === from.x && to.y > from.y) {
      directionX = '/';
      directionY = '+';
    } else if (to.x < from.x && to.y > from.y) {
      directionX = '-';
      directionY = '+';
    } else if (to.x < from.x && to.y === from.y) {
      directionX = '-';
      directionY = '-';
    } else if (to.x === from.x && to.y < from.y) {
      directionX = '/';
      directionY = '-';
    } else if (to.x > from.x && to.y < from.y) {
      directionX = '+';
      directionY = '-';
    } else if (to.x < from.x && to.y < from.y) {
      directionX = '-';
      directionY = '-';
    }
  } else {
    if (to.x > from.x && to.y < from.y) {
      directionX = '+';
      directionY = '-';
    } else if (to.x > from.x && to.y === from.y) {
      directionX = '+';
      directionY = '+';
    } else if (to.x === from.x && to.y > from.y) {
      directionX = '/';
      directionY = '+';
    } else if (to.x < from.x && to.y === from.y) {
      directionX = '-';
      directionY = '+';
    } else if (to.x < from.x && to.y < from.y) {
      directionX = '-';
      directionY = '-';
    } else if (to.x === from.x && to.y < from.y) {
      directionX = '/';
      directionY = '-';
    } else if (to.x > from.x && to.y > from.y) {
      directionX = '+';
      directionY = '+';
    } else if (to.x < from.x && to.y > from.y) {
      directionX = '-';
      directionY = '+';
    }
  }

  return { directionX, directionY };
}

export function getStraightPathBetweenCords(
  state: GameState,
  from: Cord,
  to: Cord,
): { pathLength: number; isPathPossible: boolean } {
  if (from.x === to.x && from.y === to.y) {
    return { pathLength: 0, isPathPossible: true };
  }

  let previousDestination = { ...from };
  let pathLength = 0;
  let isPathPossible = true;

  for (let i = 0; i < GRID_COLS; i += 1) {
    const pathDirection = calculatePathDirection(previousDestination, to);
    const nextCords = getNextCord(
      state,
      previousDestination.x,
      previousDestination.y,
      pathDirection.directionX,
      pathDirection.directionY,
      false,
    );

    if (!nextCords) {
      isPathPossible = false;
      break;
    }

    pathLength += 1;
    const reachedTarget =
      nextCords.newCords.x === to.x && nextCords.newCords.y === to.y;

    if (
      !reachedTarget &&
      !isWalkable(state, nextCords.newCords.x, nextCords.newCords.y)
    ) {
      isPathPossible = false;
    }

    previousDestination = nextCords.newCords;

    if (reachedTarget) {
      break;
    }
  }

  if (previousDestination.x !== to.x || previousDestination.y !== to.y) {
    isPathPossible = false;
  }

  return { pathLength, isPathPossible };
}

/** Hex step count between tiles, ignoring blocked terrain (used for aggro range). */
export function getHexDistance(state: GameState, from: Cord, to: Cord): number {
  if (from.x === to.x && from.y === to.y) return 0;

  let previousDestination = { ...from };
  let pathLength = 0;

  for (let i = 0; i < GRID_COLS; i += 1) {
    const pathDirection = calculatePathDirection(previousDestination, to);
    const nextCords = getNextCord(
      state,
      previousDestination.x,
      previousDestination.y,
      pathDirection.directionX,
      pathDirection.directionY,
      false,
    );

    if (!nextCords) break;

    pathLength += 1;
    previousDestination = nextCords.newCords;

    if (nextCords.newCords.x === to.x && nextCords.newCords.y === to.y) {
      break;
    }
  }

  return pathLength;
}

function aliveEnemyTiles(state: GameState): Set<string> {
  const blocked = new Set<string>();
  for (const enemy of state.enemies) {
    if (enemy.alive) {
      blocked.add(cordKey(enemy.HEX.CORD));
    }
  }
  return blocked;
}

function extraBlockedTiles(state: GameState): Set<string> {
  const blocked = aliveEnemyTiles(state);
  if (state.restricted.dynamic) {
    for (const cord of state.restricted.dynamicCords) {
      blocked.add(cordKey(cord));
    }
  }
  return blocked;
}

/** Shortest walkable route using BFS — handles walls without greedy detours. */
export function findWalkPath(
  state: GameState,
  from: Cord,
  to: Cord,
  maxSteps: number,
): Cord[] {
  if (from.x === to.x && from.y === to.y) return [];
  if (!isWalkable(state, to.x, to.y)) return [];

  const blocked = extraBlockedTiles(state);
  const visited = new Set<string>([cordKey(from)]);
  const queue: { cord: Cord; path: Cord[] }[] = [{ cord: from, path: [] }];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;

    if (current.cord.x === to.x && current.cord.y === to.y) {
      return current.path;
    }

    if (current.path.length >= maxSteps) continue;

    for (const neighbor of getHexNeighbors(current.cord.x, current.cord.y)) {
      const key = cordKey(neighbor);
      if (visited.has(key) || blocked.has(key)) continue;
      if (!isWalkable(state, neighbor.x, neighbor.y)) continue;

      visited.add(key);
      queue.push({ cord: neighbor, path: [...current.path, neighbor] });
    }
  }

  return [];
}

export function buildMovePath(
  state: GameState,
  from: Cord,
  to: Cord,
  maxSteps: number,
): { nextCords: Cord; pathDirection: ReturnType<typeof calculatePathDirection> }[] {
  const path = findWalkPath(state, from, to, maxSteps);

  return path.map((nextCords, index) => {
    const previous = index === 0 ? from : path[index - 1] ?? from;
    return {
      nextCords,
      pathDirection: calculatePathDirection(previous, nextCords),
    };
  });
}

export function toFacing(direction: PathDirection): Facing {
  return { x: direction.directionX, y: direction.directionY };
}

export function isOutOfBounds(x: number, y: number): boolean {
  return !isInGridBounds(x, y);
}
