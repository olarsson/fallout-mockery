import {
  CHUNK_EDGE_TRANSITION_DEPTH,
  CHUNK_ENTRY_INSET,
  GRID_COLS,
  GRID_ROWS,
  INITIAL_ENEMIES,
  MAP_EDGE_EAST,
  MAP_EDGE_NORTH,
  MAP_EDGE_SOUTH,
  MAP_EDGE_WEST,
} from '@/core/constants';
import type { Cord, GameContext, MapChunkCoord } from '@/core/types';
import { createEnemy } from '@/entities/createEnemy';
import { setPlayerPosition } from '@/entities/createPlayer';
import { cordKey } from '@/grid/hexNeighbors';
import {
  entryPositionForPlayer,
  generateChunkWalls,
  oppositeEdge,
  type MapEdge,
} from '@/grid/MapGenerator';
import { getHexDistance } from '@/grid/Pathfinding';
import { isWalkable } from '@/grid/RestrictionMap';

const MIN_ENEMY_DISTANCE = 5;
const ENEMIES_PER_CHUNK = 2;

function mapEdgeFor(direction: MapEdge): number {
  switch (direction) {
    case 'east':
      return MAP_EDGE_EAST;
    case 'west':
      return MAP_EDGE_WEST;
    case 'south':
      return MAP_EDGE_SOUTH;
    case 'north':
      return MAP_EDGE_NORTH;
  }
}

export function detectEdgeCrossing(prev: Cord, next: Cord): MapEdge | null {
  if (prev.x < MAP_EDGE_EAST && next.x >= MAP_EDGE_EAST) return 'east';
  if (prev.x > MAP_EDGE_WEST && next.x <= MAP_EDGE_WEST) return 'west';
  if (prev.y < MAP_EDGE_SOUTH && next.y >= MAP_EDGE_SOUTH) return 'south';
  if (prev.y > MAP_EDGE_NORTH && next.y <= MAP_EDGE_NORTH) return 'north';
  return null;
}

function isInEdgeBand(cord: Cord, edge: MapEdge, depth = CHUNK_EDGE_TRANSITION_DEPTH): boolean {
  const border = mapEdgeFor(edge);
  switch (edge) {
    case 'east':
      return cord.x >= border - depth;
    case 'west':
      return cord.x <= border + depth;
    case 'south':
      return cord.y >= border - depth;
    case 'north':
      return cord.y <= border + depth;
  }
}

function intentTowardEdge(intent: Cord, edge: MapEdge, depth = CHUNK_EDGE_TRANSITION_DEPTH): boolean {
  const border = mapEdgeFor(edge);
  switch (edge) {
    case 'east':
      return intent.x >= border - depth;
    case 'west':
      return intent.x <= border + depth;
    case 'south':
      return intent.y >= border - depth;
    case 'north':
      return intent.y <= border + depth;
  }
}

/** Transition when movement ends near a playable edge and the click was toward it. */
export function detectEdgeTransitionAtRest(position: Cord, intent: Cord): MapEdge | null {
  if (isInEdgeBand(position, 'east') && intentTowardEdge(intent, 'east')) return 'east';
  if (isInEdgeBand(position, 'west') && intentTowardEdge(intent, 'west')) return 'west';
  if (isInEdgeBand(position, 'south') && intentTowardEdge(intent, 'south')) return 'south';
  if (isInEdgeBand(position, 'north') && intentTowardEdge(intent, 'north')) return 'north';
  return null;
}

export function nextChunk(chunk: MapChunkCoord, edge: MapEdge): MapChunkCoord {
  switch (edge) {
    case 'east':
      return { x: chunk.x + 1, y: chunk.y };
    case 'west':
      return { x: chunk.x - 1, y: chunk.y };
    case 'south':
      return { x: chunk.x, y: chunk.y + 1 };
    case 'north':
      return { x: chunk.x, y: chunk.y - 1 };
  }
}

export function playerCordAfterTransition(edge: MapEdge, current: Cord): Cord {
  switch (edge) {
    case 'east':
      return { x: CHUNK_ENTRY_INSET, y: current.y };
    case 'west':
      return { x: MAP_EDGE_EAST - CHUNK_ENTRY_INSET, y: current.y };
    case 'south':
      return { x: current.x, y: CHUNK_ENTRY_INSET };
    case 'north':
      return { x: current.x, y: MAP_EDGE_SOUTH - CHUNK_ENTRY_INSET };
  }
}

function chunkEnemySeed(chunk: MapChunkCoord): number {
  return ((chunk.x * 83492791) ^ (chunk.y * 2654435761)) >>> 0;
}

function listWalkableTiles(state: GameContext['state'], avoid: Cord): Cord[] {
  const tiles: Cord[] = [];
  for (let x = 0; x <= GRID_COLS; x += 1) {
    for (let y = 0; y <= GRID_ROWS; y += 1) {
      const cord = { x, y };
      if (cordKey(cord) === cordKey(avoid)) continue;
      if (!isWalkable(state, x, y)) continue;
      if (getHexDistance(state, avoid, cord) < MIN_ENEMY_DISTANCE) continue;
      tiles.push(cord);
    }
  }
  return tiles;
}

function spawnProceduralEnemies(
  ctx: GameContext,
  playerCord: Cord,
): ReturnType<typeof createEnemy>[] {
  const { state, hexGrid } = ctx;
  const candidates = listWalkableTiles(state, playerCord);
  if (candidates.length === 0) return [];

  let seed = chunkEnemySeed(state.map.chunk);
  const rng = () => {
    seed = (seed + 0x9e3779b9) >>> 0;
    return seed / 4294967296;
  };

  const shuffled = [...candidates];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const temp = shuffled[i];
    const swap = shuffled[j];
    if (temp && swap) {
      shuffled[i] = swap;
      shuffled[j] = temp;
    }
  }

  return shuffled
    .slice(0, ENEMIES_PER_CHUNK)
    .map((cord) => createEnemy(hexGrid, cord.x, cord.y));
}

function loadChunkEnemies(ctx: GameContext, playerCord: Cord): ReturnType<typeof createEnemy>[] {
  const { state, hexGrid } = ctx;
  if (state.map.chunk.x === 0 && state.map.chunk.y === 0) {
    return INITIAL_ENEMIES.map(({ x, y }) => createEnemy(hexGrid, x, y));
  }
  return spawnProceduralEnemies(ctx, playerCord);
}

export function loadMapChunk(
  ctx: GameContext,
  chunk: MapChunkCoord,
  entryEdge: MapEdge,
  playerCord: Cord,
): void {
  const { state, hexGrid } = ctx;

  state.map.chunk = chunk;
  state.restricted.cords = generateChunkWalls({
    chunk,
    entryEdge,
    entryPosition: entryPositionForPlayer(entryEdge, playerCord),
  });
  state.enemies = loadChunkEnemies(ctx, playerCord);
  setPlayerPosition(hexGrid, state.positions.playerPos, playerCord.x, playerCord.y);
}

export function tryMapTransition(ctx: GameContext, prevCord: Cord, nextCord: Cord): boolean {
  const { state } = ctx;
  if (state.combat.inCombat || state.gameOver) return false;

  const edge = detectEdgeCrossing(prevCord, nextCord);
  if (!edge) return false;

  return applyMapTransition(ctx, edge, nextCord);
}

export function tryMapTransitionAtRest(
  ctx: GameContext,
  position: Cord,
  intent: Cord,
): boolean {
  const { state } = ctx;
  if (state.combat.inCombat || state.gameOver) return false;

  const edge = detectEdgeTransitionAtRest(position, intent);
  if (!edge) return false;

  return applyMapTransition(ctx, edge, position);
}

function applyMapTransition(ctx: GameContext, edge: MapEdge, anchor: Cord): boolean {
  const { state } = ctx;
  const chunk = nextChunk(state.map.chunk, edge);
  const spawnCord = playerCordAfterTransition(edge, anchor);
  loadMapChunk(ctx, chunk, oppositeEdge(edge), spawnCord);
  return true;
}
