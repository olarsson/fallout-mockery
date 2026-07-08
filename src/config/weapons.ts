import type { Weapon } from '@/core/types';

export const WEAPONS = {
  melee: {
    melee: true,
    range: 1,
    damage: [7, 12],
    actionPoints: 3,
  },
  gun: {
    melee: false,
    range: 5,
    damage: [2, 6],
    actionPoints: 4,
  },
  rifle: {
    melee: false,
    range: 8,
    damage: [7, 12],
    actionPoints: 3,
  },
  scorpion: {
    melee: true,
    range: 1,
    damage: [7, 12],
    actionPoints: 4,
  },
  knife: {
    melee: true,
    range: null,
    damage: [4, 6],
    actionPoints: 2,
  },
} as const satisfies Record<string, Weapon>;

export type WeaponId = keyof typeof WEAPONS;
