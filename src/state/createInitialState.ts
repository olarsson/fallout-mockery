import { INITIAL_ENEMIES, STATIC_RESTRICTED_TILES } from '@/core/constants';
import type { GameState } from '@/core/types';
import { createEnemy } from '@/entities/createEnemy';
import { createPlayer } from '@/entities/createPlayer';
import type { HexGrid } from '@/grid/HexGrid';

export function createInitialState(hexGrid: HexGrid): GameState {
  const state: GameState = {
    player: createPlayer(),
    enemies: INITIAL_ENEMIES.map(({ x, y }) => createEnemy(hexGrid, x, y)),
    combat: {
      inCombat: false,
      queuePos: 0,
      queue: [],
    },
    positions: {
      mousePointer: {
        HEX: {
          PX: { x: 0, y: 0 },
          CORD: { x: 0, y: 0 },
        },
      },
      clickPos: {
        HEX: {
          PX: { x: 0, y: 0 },
          CORD: { x: 0, y: 0 },
        },
      },
      playerPos: {
        previousImgStep: 0,
        moveCounter: 0,
        FACING: { x: '+', y: '+' },
        HEX: {
          PX: { x: 0, y: 0 },
          CORD: { x: 0, y: 0 },
        },
      },
    },
    restricted: {
      dynamic: false,
      dynamicCords: [],
      cords: [...STATIC_RESTRICTED_TILES],
    },
    viewport: { x: 0, y: 0 },
    cursorType: 0,
  };

  return state;
}
