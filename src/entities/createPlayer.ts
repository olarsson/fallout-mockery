import { PLAYER_SPRITES } from '@/config/sprites';
import { WEAPONS } from '@/config/weapons';
import type {
  AnimationController,
  EntityState,
  Facing,
  PlayerEntity,
} from '@/core/types';

export function createPlayer(): PlayerEntity {
  const player: PlayerEntity = {
    id: '_player',
    DEFAULTS: { actionPoints: 8 },
    health: 40,
    state: 0,
    actionPoints: 8,
    stopActions: false,
    weapon: { ...WEAPONS.rifle },
    temp: { attackStep: 0, haveBeenRun: false },
    animations: {
      still: { ...PLAYER_SPRITES.stillBasic },
      moving: { ...PLAYER_SPRITES.movingBasic },
      attack: { ...PLAYER_SPRITES.gunFireBasic },
    },
    animation: null as unknown as AnimationController,
  };

  player.animation = createAnimationController(player);
  return player;
}

function createAnimationController(
  entity: { state: EntityState; temp: { attackStep: number; haveBeenRun: boolean } },
): AnimationController {
  return {
    startTime: null,

    init(state: EntityState) {
      entity.temp.haveBeenRun = false;
      entity.temp.attackStep = 0;
      this.startTime = Date.now();
      entity.state = state;
    },

    finished() {
      entity.state = 0;
    },

    movementAnimation: {
      start() {
        entity.state = 1;
        entity.temp.haveBeenRun = false;
        entity.temp.attackStep = 0;
      },
      stop() {
        entity.state = 0;
      },
    },

    attackAnimation: {
      start() {
        entity.state = 2;
        entity.temp.haveBeenRun = false;
        entity.temp.attackStep = 0;
      },
      stop() {
        entity.state = 0;
      },
    },
  };
}

export function setPlayerFacing(playerPos: { FACING: Facing }, facing: Facing): void {
  playerPos.FACING = facing;
}

export function setPlayerPosition(
  hexGrid: import('@/grid/HexGrid').HexGrid,
  playerPos: import('@/core/types').PlayerPosition,
  column: number,
  row: number,
): void {
  const px = hexGrid.getPXAtColRow(column, row);
  playerPos.HEX = {
    PX: { x: px.x, y: px.y },
    CORD: { x: column, y: row },
  };
}
