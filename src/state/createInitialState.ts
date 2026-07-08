import { INITIAL_ENEMIES, PLAYER_START, STATIC_RESTRICTED_TILES } from '@/core/constants';
import type { GameState } from '@/core/types';
import { createEnemy } from '@/entities/createEnemy';
import { createPlayer, setPlayerPosition } from '@/entities/createPlayer';
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
    gameOver: false,
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
    map: { chunk: { x: 0, y: 0 }, visited: {} },
    viewport: { x: 0, y: 0 },
    cursorType: 0,
    pathPreview: [],
  };

  setPlayerPosition(hexGrid, state.positions.playerPos, PLAYER_START.x, PLAYER_START.y);

  return state;
}

export function resetGameState(state: GameState, hexGrid: HexGrid): void {
  const fresh = createInitialState(hexGrid);
  const viewport = state.viewport;

  state.player = fresh.player;
  state.enemies = fresh.enemies;
  state.combat = fresh.combat;
  state.gameOver = fresh.gameOver;
  state.positions = fresh.positions;
  state.restricted = fresh.restricted;
  state.map = fresh.map;
  state.cursorType = fresh.cursorType;
  state.pathPreview = fresh.pathPreview;
  state.viewport = viewport;
}
