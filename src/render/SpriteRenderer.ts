import { CORD_PRIORITIES, TIMING } from '@/core/constants';
import type {
  EnemyEntity,
  Facing,
  GameState,
  PlayerEntity,
  SpriteSheetConfig,
} from '@/core/types';
import type { AssetLoader } from '@/render/AssetLoader';

export function facingToRow(facing: Facing): number {
  const key = `${facing.x}${facing.y}`;
  const index = CORD_PRIORITIES.indexOf(key as (typeof CORD_PRIORITIES)[number]);
  return index === -1 ? 0 : index;
}

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  assets: AssetLoader,
  config: SpriteSheetConfig,
  destX: number,
  destY: number,
  frameX = 0,
  frameY = 0,
): void {
  const image = assets.get(config.imageKey);
  ctx.drawImage(
    image,
    config.clipX * frameX,
    config.clipY * frameY,
    config.width,
    config.height,
    destX - config.offsetX,
    destY - config.offsetY,
    config.width,
    config.height,
  );
}

export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  assets: AssetLoader,
  state: GameState,
): void {
  const { player, positions } = state;
  const { x, y } = positions.playerPos.HEX.PX;
  const row = facingToRow(positions.playerPos.FACING);

  if (player.state === 0) {
    drawSprite(ctx, assets, player.animations.still, x, y, 0, row);
    return;
  }

  if (player.state === 1) {
    if (!player.animation.startTime) player.animation.startTime = Date.now();
    if (Date.now() - player.animation.startTime > TIMING.moveFrameMs) {
      player.animation.startTime = Date.now();
      positions.playerPos.moveCounter += 1;
      const totalFrames = player.animations.moving.totalFrames ?? 8;
      if (positions.playerPos.moveCounter >= totalFrames) {
        positions.playerPos.moveCounter = 0;
      }
    }
    const frameRow = resolveMoveRow(row, positions);
    drawSprite(
      ctx,
      assets,
      player.animations.moving,
      x,
      y,
      positions.playerPos.moveCounter,
      frameRow,
    );
    return;
  }

  if (player.state === 2) {
    const totalFrames = player.animations.attack.totalFrames ?? 5;
    advanceAttackFrame(player, TIMING.attackFrameMs, totalFrames);
    drawSprite(
      ctx,
      assets,
      player.animations.attack,
      x,
      y,
      player.temp.attackStep,
      row,
    );
    return;
  }

  if (player.state === 3 && player.animations.hit) {
    drawSprite(ctx, assets, player.animations.hit, x, y, 0, 0);
  }
}

export function drawEnemy(
  ctx: CanvasRenderingContext2D,
  assets: AssetLoader,
  enemy: EnemyEntity,
  tileX: number,
  tileY: number,
): void {
  const row = facingToRow(enemy.FACING);

  if (enemy.state === 0) {
    if (enemy.alive) {
      drawSprite(ctx, assets, enemy.animations.still, tileX, tileY, 0, row);
    } else if (enemy.animations.dead) {
      drawSprite(ctx, assets, enemy.animations.dead, tileX, tileY, 0, row);
    }
    return;
  }

  if (enemy.state === 1 && enemy.animations.moving.totalFrames) {
    advanceEnemyMoveFrame(enemy, enemy.animations.moving.totalFrames);
    drawSprite(
      ctx,
      assets,
      enemy.animations.moving,
      tileX,
      tileY,
      enemy.temp.tempStep,
      row,
    );
    return;
  }

  if (enemy.state === 2) {
    advanceEnemyAttackFrame(enemy, enemy.animations.attack.totalFrames ?? 11);
    drawSprite(
      ctx,
      assets,
      enemy.animations.attack,
      tileX,
      tileY,
      enemy.temp.tempStep,
      row,
    );
    return;
  }

  if (enemy.state === 3 && enemy.animations.hit) {
    advanceEnemyAttackFrame(enemy, enemy.animations.hit.totalFrames ?? 6);
    drawSprite(ctx, assets, enemy.animations.hit, tileX, tileY, enemy.temp.tempStep, row);
    return;
  }

  if (enemy.state === -1 && enemy.animations.death) {
    advanceEnemyAttackFrame(enemy, enemy.animations.death.totalFrames ?? 5);
    drawSprite(ctx, assets, enemy.animations.death, tileX, tileY, enemy.temp.tempStep, row);
  }
}

function resolveMoveRow(row: number, positions: GameState['positions']): number {
  if (row === -1) return positions.playerPos.previousImgStep;
  positions.playerPos.previousImgStep = row;
  return row;
}

function advanceAttackFrame(player: PlayerEntity, frameMs: number, totalFrames: number): void {
  if (player.temp.haveBeenRun) return;
  if (!player.animation.startTime) player.animation.startTime = Date.now();
  if (Date.now() - player.animation.startTime > frameMs) {
    player.animation.startTime = Date.now();
    const nextStep = player.temp.attackStep + 1;
    if (nextStep >= totalFrames) {
      player.temp.haveBeenRun = true;
      player.temp.attackStep = totalFrames - 1;
      return;
    }
    player.temp.attackStep = nextStep;
  }
}

function advanceEnemyMoveFrame(enemy: EnemyEntity, totalFrames: number): void {
  if (enemy.temp.haveBeenRun) return;
  if (!enemy.animation.startTime) enemy.animation.startTime = Date.now();
  if (Date.now() - enemy.animation.startTime > TIMING.moveFrameMs) {
    enemy.animation.startTime = Date.now();
    const nextStep = enemy.temp.tempStep + 1;
    if (nextStep >= totalFrames) {
      enemy.temp.haveBeenRun = true;
      enemy.temp.tempStep = totalFrames - 1;
      return;
    }
    enemy.temp.tempStep = nextStep;
  }
}

function advanceEnemyAttackFrame(enemy: EnemyEntity, totalFrames: number): void {
  if (enemy.temp.haveBeenRun) return;
  if (!enemy.animation.startTime) enemy.animation.startTime = Date.now();
  if (Date.now() - enemy.animation.startTime > TIMING.attackFrameMs) {
    enemy.animation.startTime = Date.now();
    const nextStep = enemy.temp.tempStep + 1;
    if (nextStep >= totalFrames) {
      enemy.temp.haveBeenRun = true;
      enemy.temp.tempStep = totalFrames - 1;
      return;
    }
    enemy.temp.tempStep = nextStep;
  }
}
