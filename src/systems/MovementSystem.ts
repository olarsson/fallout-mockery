import { TIMING } from '@/core/constants';
import type { Cord, EnemyEntity, GameContext } from '@/core/types';
import { setEnemyFacing, setEnemyPosition } from '@/entities/createEnemy';
import { setPlayerFacing, setPlayerPosition } from '@/entities/createPlayer';
import { buildMovePath, toFacing } from '@/grid/Pathfinding';
import {
  beginDynamicRestrictions,
  endDynamicRestrictions,
  isSameCord,
} from '@/grid/RestrictionMap';
import { CombatSystem } from '@/systems/CombatSystem';

export function movePlayerAlongPath(
  ctx: GameContext,
  from: Cord,
  to: Cord,
  maxSteps = 20,
): void {
  const { state } = ctx;

  if (state.player.state !== 0) return;

  beginDynamicRestrictions(state);

  const steps = buildMovePath(state, from, to, maxSteps);

  if (state.combat.inCombat) {
    if (state.player.actionPoints === 0) {
      new CombatSystem(ctx).moveToNextInQueue();
      endDynamicRestrictions(state);
      return;
    }

    const allowed = steps.slice(0, state.player.actionPoints);
    subtractActionPoints(state.player, allowed.length);
    runPlayerSteps(ctx, allowed);
    return;
  }

  runPlayerSteps(ctx, steps);
}

function runPlayerSteps(
  ctx: GameContext,
  steps: ReturnType<typeof buildMovePath>,
): void {
  const { state, hexGrid, scheduler } = ctx;
  if (steps.length === 0) {
    endDynamicRestrictions(state);
    return;
  }

  let index = 0;
  state.player.animation.movementAnimation.start();

  scheduler.scheduleRepeating(
    TIMING.moveStepMs,
    steps.length,
    () => {
      const step = steps[index];
      if (!step) return;

      setPlayerPosition(hexGrid, state.positions.playerPos, step.nextCords.x, step.nextCords.y);
      setPlayerFacing(state.positions.playerPos, toFacing(step.pathDirection));

      if (index === steps.length - 1) {
        state.player.animation.movementAnimation.stop();
        endDynamicRestrictions(state);

        if (state.combat.inCombat && state.player.actionPoints === 0) {
          new CombatSystem(ctx).moveToNextInQueue();
        }
      }

      index += 1;
    },
  );
}

export function moveEnemyAlongPath(
  ctx: GameContext,
  enemy: EnemyEntity,
  from: Cord,
  to: Cord,
): void {
  const { state, hexGrid, scheduler } = ctx;

  beginDynamicRestrictions(state);
  for (const other of state.enemies) {
    state.restricted.dynamicCords.push(other.HEX.CORD);
  }

  const steps = buildMovePath(state, from, to, enemy.maxsteps);
  const lastStep = steps[steps.length - 1];
  if (lastStep && isSameCord(lastStep.nextCords, to)) {
    steps.pop();
  }

  const allowed = steps.slice(0, enemy.actionPoints);
  subtractActionPoints(enemy, allowed.length);

  if (allowed.length === 0) {
    endDynamicRestrictions(state);
    new CombatSystem(ctx).nextEnemyAction(enemy);
    return;
  }

  let index = 0;
  enemy.animation.movementAnimation.start();

  scheduler.scheduleRepeating(
    TIMING.moveStepMs,
    allowed.length,
    () => {
      const step = allowed[index];
      if (!step) return;

      setEnemyPosition(hexGrid, enemy, step.nextCords.x, step.nextCords.y);
      setEnemyFacing(enemy, toFacing(step.pathDirection));

      if (index === allowed.length - 1) {
        enemy.animation.movementAnimation.stop();
        endDynamicRestrictions(state);
        new CombatSystem(ctx).nextEnemyAction(enemy);
      }

      index += 1;
    },
  );
}

function subtractActionPoints(entity: { actionPoints: number }, points: number): void {
  entity.actionPoints -= points;
  if (entity.actionPoints < 0) entity.actionPoints = 0;
}
