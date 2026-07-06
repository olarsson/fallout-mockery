import { CORD_PRIORITIES, GRID_COLS, GRID_ROWS } from '@/core/constants';
import type { Cord, Facing, FacingKey, GameState, NextCordResult, PathDirection } from '@/core/types';
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
      true,
    );

    if (!nextCords) {
      isPathPossible = false;
      break;
    }

    pathLength += 1;
    if (nextCords.restricted) isPathPossible = false;
    previousDestination = nextCords.newCords;

    if (nextCords.newCords.x === to.x && nextCords.newCords.y === to.y) {
      break;
    }
  }

  return { pathLength, isPathPossible };
}

export function buildMovePath(
  state: GameState,
  from: Cord,
  to: Cord,
  maxSteps: number,
): { nextCords: Cord; pathDirection: ReturnType<typeof calculatePathDirection> }[] {
  const steps: { nextCords: Cord; pathDirection: ReturnType<typeof calculatePathDirection> }[] = [];
  let previousDestination = { ...from };

  for (let i = 0; i < maxSteps; i += 1) {
    state.restricted.dynamicCords.push(previousDestination);

    const pathDirection = calculatePathDirection(previousDestination, to);
    const nextCords = getNextCord(
      state,
      previousDestination.x,
      previousDestination.y,
      pathDirection.directionX,
      pathDirection.directionY,
      true,
    );

    if (!nextCords) break;

    previousDestination = nextCords.newCords;
    steps.push({ nextCords: nextCords.newCords, pathDirection });

    if (nextCords.newCords.x === to.x && nextCords.newCords.y === to.y) {
      break;
    }
  }

  return steps;
}

export function toFacing(direction: PathDirection): Facing {
  return { x: direction.directionX, y: direction.directionY };
}

export function isOutOfBounds(x: number, y: number): boolean {
  return x > GRID_COLS || x < 0 || y > GRID_ROWS || y < 0;
}
