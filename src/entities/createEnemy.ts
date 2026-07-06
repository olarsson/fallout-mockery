import { ENEMY_SPRITES } from '@/config/sprites';
import { WEAPONS } from '@/config/weapons';
import type {
  AnimationController,
  EnemyEntity,
  EntityState,
  Facing,
} from '@/core/types';
import type { HexGrid } from '@/grid/HexGrid';
import { generateUniqueId } from '@/utils/id';

export function createEnemy(hexGrid: HexGrid, x: number, y: number): EnemyEntity {
  const px = hexGrid.getPXAtColRow(x, y);

  const enemy: EnemyEntity = {
    HEX: {
      CORD: { x, y },
      PX: { x: px.x, y: px.y },
    },
    FACING: { x: '+', y: '+' },
    DEFAULTS: { actionPoints: 4 },
    animation: null as unknown as AnimationController,
    id: generateUniqueId(),
    alive: true,
    health: 30,
    engaged: false,
    maxsteps: 10,
    aggroRange: 5,
    actionPoints: 8,
    weapon: { ...WEAPONS.melee },
    state: 0,
    temp: { tempStep: 0, haveBeenRun: false },
    animations: {
      still: { ...ENEMY_SPRITES.scorpionStill },
      moving: { ...ENEMY_SPRITES.scorpionMoving },
      attack: { ...ENEMY_SPRITES.scorpionAttack },
      hit: { ...ENEMY_SPRITES.scorpionHit },
      death: { ...ENEMY_SPRITES.scorpionDeath },
      dead: { ...ENEMY_SPRITES.scorpionDead },
    },
  };

  enemy.animation = createEnemyAnimationController(enemy);
  return enemy;
}

function createEnemyAnimationController(
  enemy: EnemyEntity,
): AnimationController {
  return {
    startTime: null,

    init(state: EntityState) {
      enemy.temp.haveBeenRun = false;
      enemy.temp.tempStep = 0;
      this.startTime = Date.now();
      enemy.state = state;
    },

    finished() {
      enemy.state = 0;
    },

    movementAnimation: {
      start() {
        enemy.state = 1;
        enemy.temp.haveBeenRun = false;
        enemy.temp.tempStep = 0;
      },
      stop() {
        enemy.state = 0;
      },
    },

    attackAnimation: {
      start() {
        enemy.state = 2;
        enemy.temp.haveBeenRun = false;
        enemy.temp.tempStep = 0;
      },
      stop() {
        enemy.state = 0;
      },
    },

    hitAnimation: {
      start() {
        enemy.state = 3;
        enemy.temp.haveBeenRun = false;
        enemy.temp.tempStep = 0;
      },
      stop() {
        enemy.state = 0;
      },
    },

    deathAnimation: {
      start() {
        enemy.state = -1;
        enemy.temp.haveBeenRun = false;
        enemy.temp.tempStep = 0;
      },
      stop() {
        enemy.state = 0;
      },
    },
  };
}

export function setEnemyFacing(enemy: EnemyEntity, facing: Facing): void {
  enemy.FACING = facing;
}

export function setEnemyPosition(
  hexGrid: HexGrid,
  enemy: EnemyEntity,
  column: number,
  row: number,
): void {
  const px = hexGrid.getPXAtColRow(column, row);
  enemy.HEX = {
    PX: { x: px.x, y: px.y },
    CORD: { x: column, y: row },
  };
}
