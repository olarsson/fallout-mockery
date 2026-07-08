import type { FacingKey } from './types';

export const BOX_SIZE = 25;
export const CANVAS_WIDTH = 700;
export const CANVAS_HEIGHT = 425;
export const BAR_HEIGHT = 100;
export const STAGE_WIDTH = CANVAS_WIDTH;
export const STAGE_HEIGHT = CANVAS_HEIGHT + BAR_HEIGHT;
export const HEX_RADIUS = 20;

export const GRID_COLS = Math.floor(CANVAS_WIDTH / BOX_SIZE);
export const GRID_ROWS = Math.floor(CANVAS_HEIGHT / BOX_SIZE);
export const LONGEST_PATH = GRID_COLS;

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

export const INITIAL_ENEMIES: readonly { x: number; y: number }[] = [
  { x: 8, y: 6 },
  { x: 13, y: 8 },
];
