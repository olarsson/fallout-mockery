import type { FacingKey } from './types';

export const CANVAS_WIDTH = 700;
export const CANVAS_HEIGHT = 425;
export const BAR_HEIGHT = 100;
export const STAGE_WIDTH = CANVAS_WIDTH;
export const STAGE_HEIGHT = CANVAS_HEIGHT + BAR_HEIGHT;

/** Fallout 2 hex cell metrics (see grid/FalloutGeometry.ts). */
export const MAP_HEX_WIDTH = 32;
export const MAP_HEX_LINE_HEIGHT = 12;
export const MAP_HEX_HEIGHT = 16;

export const GRID_COLS = 28;
export const GRID_ROWS = 17;
export const LONGEST_PATH = GRID_COLS;

export const PLAYER_START = {
  x: Math.floor(GRID_COLS / 2),
  y: Math.floor(GRID_ROWS / 2),
} as const;
/** How many hexes inward from the entry edge the player spawns on a new chunk. */
export const CHUNK_ENTRY_INSET = 2;
/** Enter an adjacent chunk when movement ends within this many hexes of a map edge. */
export const CHUNK_EDGE_TRANSITION_DEPTH = 1;

export const CORD_PRIORITIES: readonly FacingKey[] = [
  '+-',
  '++',
  '/+',
  '-+',
  '--',
  '/-',
] as const;

export const STATIC_RESTRICTED_TILES = [
  { x: 1, y: 1 },
  { x: 1, y: 2 },
  { x: 1, y: 3 },
  { x: 3, y: 3 },
  { x: 4, y: 3 },
  { x: 4, y: 4 },
  { x: 4, y: 5 },
  { x: 4, y: 6 },
  { x: 3, y: 6 },
  { x: 2, y: 6 },
] as const;

export const TIMING = {
  renderIntervalMs: 50,
  moveStepMs: 150,
  attackTickMs: 100,
  animationHoldMs: 800,
  moveFrameMs: 70,
  attackFrameMs: 100,
} as const;

export const PLAYER_ATTACK_HIT_FRAME = 4;
export const ENEMY_ATTACK_HIT_FRAME = 11;

/** Movement cursor draw size and hotspot (icon center ≈ hex aim point). */
export const CURSOR_SIZE = { width: 28, height: 23, hotspotX: 14, hotspotY: 11 } as const;

export const INITIAL_ENEMIES: readonly { x: number; y: number }[] = [
  { x: 8, y: 6 },
];
