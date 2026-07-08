import type { Cord, GameState, TileQueryResult } from '@/core/types';
import { buildMovePath } from '@/grid/Pathfinding';
import {
  beginDynamicRestrictions,
  endDynamicRestrictions,
  isSameCord,
} from '@/grid/RestrictionMap';

const OUT_OF_COMBAT_MAX_STEPS = 20;

export function computePathPreview(state: GameState, from: Cord, to: Cord): Cord[] {
  const maxSteps = state.combat.inCombat
    ? Math.floor(state.player.actionPoints / state.player.moveCost)
    : OUT_OF_COMBAT_MAX_STEPS;

  if (maxSteps <= 0) return [];

  beginDynamicRestrictions(state);
  const steps = buildMovePath(state, from, to, maxSteps);
  endDynamicRestrictions(state);

  return steps.map((step) => step.nextCords);
}

export function updatePathPreview(
  state: GameState,
  hoverCord: Cord,
  tileInfo: TileQueryResult,
): void {
  const from = state.positions.playerPos.HEX.CORD;

  if (
    state.gameOver ||
    state.player.state !== 0 ||
    state.player.stopActions ||
    tileInfo.type !== 0 ||
    isSameCord(from, hoverCord)
  ) {
    state.pathPreview = [];
    return;
  }

  state.pathPreview = computePathPreview(state, from, hoverCord);
}
