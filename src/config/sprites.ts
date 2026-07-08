import type { SpriteSheetConfig } from '@/core/types';

function feetAnchor(width: number, height: number): { offsetX: number; offsetY: number } {
  return { offsetX: width / 2, offsetY: height };
}

const playerStill = feetAnchor(36, 70);
const playerMoving = feetAnchor(44, 68);
const playerAttack = feetAnchor(64, 79);
const playerHit = feetAnchor(68, 68);
const scorpionStill = feetAnchor(59, 49);
const scorpionMoving = feetAnchor(59, 48);
const scorpionAttack = feetAnchor(86, 68);
const scorpionHit = feetAnchor(59, 48);
const scorpionDeath = feetAnchor(53.8, 34.83);

export const PLAYER_SPRITES = {
  stillBasic: {
    imageKey: 'playerStill',
    countX: 8,
    countY: 6,
    width: 36,
    height: 70,
    clipX: 0,
    clipY: 70,
    ...playerStill,
  },
  movingBasic: {
    imageKey: 'playerMoving',
    totalFrames: 8,
    countX: 8,
    countY: 6,
    width: 44,
    height: 68,
    clipX: 44,
    clipY: 68,
    ...playerMoving,
  },
  gunFireBasic: {
    imageKey: 'playerAttacking',
    totalFrames: 5,
    countX: 5,
    countY: 6,
    width: 64,
    height: 79,
    clipX: 64,
    clipY: 79,
    ...playerAttack,
  },
  /** Placeholder until a proper multi-frame hit sheet is added. */
  hitBasic: {
    imageKey: 'playerHit',
    totalFrames: 1,
    countX: 1,
    countY: 1,
    width: 68,
    height: 68,
    clipX: 0,
    clipY: 68,
    ...playerHit,
  },
} as const satisfies Record<string, SpriteSheetConfig>;

export const ENEMY_SPRITES = {
  scorpionStill: {
    imageKey: 'scorpionStill',
    countX: 1,
    countY: 6,
    width: 59,
    height: 49,
    clipX: 59,
    clipY: 49,
    ...scorpionStill,
  },
  scorpionMoving: {
    imageKey: 'scorpionMoving',
    totalFrames: 8,
    countX: 8,
    countY: 6,
    width: 59,
    height: 48,
    clipX: 59,
    clipY: 48,
    ...scorpionMoving,
  },
  scorpionAttack: {
    imageKey: 'scorpionAttacking',
    totalFrames: 11,
    countX: 11,
    countY: 6,
    width: 86,
    height: 68,
    clipX: 86,
    clipY: 68,
    ...scorpionAttack,
  },
  scorpionHit: {
    imageKey: 'scorpionHit',
    totalFrames: 6,
    countX: 6,
    countY: 6,
    width: 59,
    height: 48,
    clipX: 59,
    clipY: 48,
    ...scorpionHit,
  },
  scorpionDeath: {
    imageKey: 'scorpionDeath',
    totalFrames: 5,
    countX: 5,
    countY: 6,
    width: 53.8,
    height: 34.83,
    clipX: 53.8,
    clipY: 34.83,
    ...scorpionDeath,
  },
  scorpionDead: {
    imageKey: 'scorpionDead',
    countX: 1,
    countY: 6,
    width: 53.8,
    height: 34.83,
    clipX: 0,
    clipY: 34.83,
    ...scorpionDeath,
  },
} as const satisfies Record<string, SpriteSheetConfig>;

export const UI_SPRITES = {
  bgDesert: '/assets/img/bg_desert.gif',
  bar: '/assets/img/bar.png',
  cursorStandard: '/assets/img/cursor_standard.png',
  cursorEnemy: '/assets/img/cursor_enemy.png',
  cursorRestricted: '/assets/img/cursor_restricted.png',
  cursorTouch: '/assets/img/cursor_touch.png',
} as const;

export const SPRITE_URLS: Record<string, string> = {
  playerStill: '/assets/img/char_36_419.gif',
  playerMoving: '/assets/img/complete_movement.gif',
  playerAttacking: '/assets/img/char_gun_firing.png',
  playerHit: '/assets/img/char_68_68.png',
  scorpionStill: '/assets/img/enemy_scorpion_still.png',
  scorpionMoving: '/assets/img/enemy_scorpion_moving.png',
  scorpionAttacking: '/assets/img/enemy_scorpion_attack.png',
  scorpionHit: '/assets/img/enemy_scorpion_hit.png',
  scorpionDeath: '/assets/img/enemy_scorpion_death.png',
  scorpionDead: '/assets/img/enemy_scorpion_dead.png',
  ...UI_SPRITES,
};
