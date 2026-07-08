import {
  CHUNK_ENTRY_INSET,
  GRID_COLS,
  GRID_ROWS,
  STATIC_RESTRICTED_TILES,
} from '@/core/constants';
import type { Cord, MapChunkCoord } from '@/core/types';
import { cordKey, getHexNeighbors } from '@/grid/hexNeighbors';

export type MapEdge = 'north' | 'south' | 'east' | 'west';

const TARGET_WALKABLE_RATIO = 0.7;
const MIN_WALL_SEGMENT_LENGTH = 5;
const MIN_REACHABLE_FROM_SPAWN_RATIO = 0.4;
const ZONE_COLS = 6;
const ZONE_ROWS = 4;
const CORRIDOR_WIDTH = 2;

type ZoneCoord = { cx: number; cy: number };
type BorderDir = 'east' | 'south' | 'west' | 'north';

export type GenerateChunkOptions = {
  chunk: MapChunkCoord;
  entryEdge: MapEdge;
  entryPosition: number;
};

function createSeededRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function chunkSeed(chunk: MapChunkCoord): number {
  return ((chunk.x * 73856093) ^ (chunk.y * 19349663)) >>> 0;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function parseCordKey(key: string): Cord {
  const [x, y] = key.split(',').map(Number);
  return { x: x ?? 0, y: y ?? 0 };
}

function allGridTiles(): Cord[] {
  const tiles: Cord[] = [];
  for (let x = 0; x <= GRID_COLS; x += 1) {
    for (let y = 0; y <= GRID_ROWS; y += 1) {
      tiles.push({ x, y });
    }
  }
  return tiles;
}

function zoneKey(cx: number, cy: number): string {
  return `${cx},${cy}`;
}

function passageKey(cx: number, cy: number, dir: BorderDir): string {
  return `${cx},${cy}:${dir}`;
}

function zoneBounds(cx: number, cy: number): { x0: number; y0: number; x1: number; y1: number } {
  const x0 = Math.floor((cx * (GRID_COLS + 1)) / ZONE_COLS);
  const x1 = Math.floor(((cx + 1) * (GRID_COLS + 1)) / ZONE_COLS) - 1;
  const y0 = Math.floor((cy * (GRID_ROWS + 1)) / ZONE_ROWS);
  const y1 = Math.floor(((cy + 1) * (GRID_ROWS + 1)) / ZONE_ROWS) - 1;
  return { x0, y0, x1, y1 };
}

function zoneCyForRow(row: number): number {
  for (let cy = 0; cy < ZONE_ROWS; cy += 1) {
    const { y0, y1 } = zoneBounds(0, cy);
    if (row >= y0 && row <= y1) return cy;
  }
  return Math.floor(ZONE_ROWS / 2);
}

function zoneCxForCol(col: number): number {
  for (let cx = 0; cx < ZONE_COLS; cx += 1) {
    const { x0, x1 } = zoneBounds(cx, 0);
    if (col >= x0 && col <= x1) return cx;
  }
  return Math.floor(ZONE_COLS / 2);
}

function carveEntry(walkable: Set<string>, edge: MapEdge, position: number): void {
  if (edge === 'west') {
    const y = clamp(position, 0, GRID_ROWS);
    for (let dy = -1; dy <= 1; dy += 1) {
      const row = clamp(y + dy, 0, GRID_ROWS);
      walkable.add(cordKey({ x: 0, y: row }));
      walkable.add(cordKey({ x: 1, y: row }));
    }
    return;
  }

  if (edge === 'east') {
    const y = clamp(position, 0, GRID_ROWS);
    for (let dy = -1; dy <= 1; dy += 1) {
      const row = clamp(y + dy, 0, GRID_ROWS);
      walkable.add(cordKey({ x: GRID_COLS, y: row }));
      walkable.add(cordKey({ x: GRID_COLS - 1, y: row }));
    }
    return;
  }

  if (edge === 'north') {
    const x = clamp(position, 0, GRID_COLS);
    for (let dx = -1; dx <= 1; dx += 1) {
      const col = clamp(x + dx, 0, GRID_COLS);
      walkable.add(cordKey({ x: col, y: 0 }));
      walkable.add(cordKey({ x: col, y: 1 }));
    }
    return;
  }

  const x = clamp(position, 0, GRID_COLS);
  for (let dx = -1; dx <= 1; dx += 1) {
    const col = clamp(x + dx, 0, GRID_COLS);
    walkable.add(cordKey({ x: col, y: GRID_ROWS }));
    walkable.add(cordKey({ x: col, y: GRID_ROWS - 1 }));
  }
}

function carveInwardCorridor(
  walkable: Set<string>,
  edge: MapEdge,
  position: number,
  depth: number,
): void {
  const center = clamp(position, 0, edge === 'north' || edge === 'south' ? GRID_COLS : GRID_ROWS);
  let current: Cord;

  switch (edge) {
    case 'west':
      current = { x: 0, y: center };
      break;
    case 'east':
      current = { x: GRID_COLS, y: center };
      break;
    case 'north':
      current = { x: center, y: 0 };
      break;
    case 'south':
      current = { x: center, y: GRID_ROWS };
      break;
  }

  walkable.add(cordKey(current));

  for (let step = 0; step < depth; step += 1) {
    const inward =
      edge === 'west'
        ? getHexNeighbors(current.x, current.y).find((neighbor) => neighbor.x > current.x)
        : edge === 'east'
          ? getHexNeighbors(current.x, current.y).find((neighbor) => neighbor.x < current.x)
          : edge === 'north'
            ? getHexNeighbors(current.x, current.y).find((neighbor) => neighbor.y > current.y)
            : getHexNeighbors(current.x, current.y).find((neighbor) => neighbor.y < current.y);

    if (!inward) break;
    walkable.add(cordKey(inward));
    current = inward;
  }
}

function spawnCordForEntry(entryEdge: MapEdge, entryPosition: number): Cord {
  switch (entryEdge) {
    case 'west':
      return { x: CHUNK_ENTRY_INSET, y: entryPosition };
    case 'east':
      return { x: GRID_COLS - CHUNK_ENTRY_INSET, y: entryPosition };
    case 'north':
      return { x: entryPosition, y: CHUNK_ENTRY_INSET };
    case 'south':
      return { x: entryPosition, y: GRID_ROWS - CHUNK_ENTRY_INSET };
  }
}

function buildReservedZone(entryEdge: MapEdge, entryPosition: number): Set<string> {
  const corridor = new Set<string>();
  carveEntry(corridor, entryEdge, entryPosition);
  carveInwardCorridor(corridor, entryEdge, entryPosition, CHUNK_ENTRY_INSET + 2);

  const reserved = new Set<string>();
  for (const key of corridor) {
    reserved.add(key);
    const tile = parseCordKey(key);
    for (const neighbor of getHexNeighbors(tile.x, tile.y)) {
      reserved.add(cordKey(neighbor));
    }
  }

  return reserved;
}

function buildZonePassages(rng: () => number): Set<string> {
  const passages = new Set<string>();
  const visited = new Set<string>();
  const stack: ZoneCoord[] = [{ cx: 0, cy: 0 }];
  visited.add(zoneKey(0, 0));

  while (stack.length > 0) {
    const zone = stack[stack.length - 1];
    if (!zone) break;

    const neighbors: { cx: number; cy: number; dir: BorderDir; back: BorderDir }[] = [];
    if (zone.cx + 1 < ZONE_COLS) {
      neighbors.push({ cx: zone.cx + 1, cy: zone.cy, dir: 'east', back: 'west' });
    }
    if (zone.cy + 1 < ZONE_ROWS) {
      neighbors.push({ cx: zone.cx, cy: zone.cy + 1, dir: 'south', back: 'north' });
    }
    if (zone.cx - 1 >= 0) {
      neighbors.push({ cx: zone.cx - 1, cy: zone.cy, dir: 'west', back: 'east' });
    }
    if (zone.cy - 1 >= 0) {
      neighbors.push({ cx: zone.cx, cy: zone.cy - 1, dir: 'north', back: 'south' });
    }

    const unvisited = neighbors.filter((neighbor) => !visited.has(zoneKey(neighbor.cx, neighbor.cy)));
    if (unvisited.length === 0) {
      stack.pop();
      continue;
    }

    const next = unvisited[Math.floor(rng() * unvisited.length)];
    if (!next) break;

    passages.add(passageKey(zone.cx, zone.cy, next.dir));
    passages.add(passageKey(next.cx, next.cy, next.back));
    visited.add(zoneKey(next.cx, next.cy));
    stack.push({ cx: next.cx, cy: next.cy });
  }

  return passages;
}

function forceEntryPassage(
  passages: Set<string>,
  entryEdge: MapEdge,
  entryPosition: number,
): void {
  switch (entryEdge) {
    case 'west': {
      const cy = zoneCyForRow(entryPosition);
      passages.add(passageKey(0, cy, 'east'));
      passages.add(passageKey(1, cy, 'west'));
      break;
    }
    case 'east': {
      const cy = zoneCyForRow(entryPosition);
      const cx = ZONE_COLS - 1;
      passages.add(passageKey(cx, cy, 'west'));
      passages.add(passageKey(cx - 1, cy, 'east'));
      break;
    }
    case 'north': {
      const cx = zoneCxForCol(entryPosition);
      passages.add(passageKey(cx, 0, 'south'));
      passages.add(passageKey(cx, 1, 'north'));
      break;
    }
    case 'south': {
      const cx = zoneCxForCol(entryPosition);
      const cy = ZONE_ROWS - 1;
      passages.add(passageKey(cx, cy, 'north'));
      passages.add(passageKey(cx, cy - 1, 'south'));
      break;
    }
  }
}

function tryAddWall(
  tile: Cord,
  walls: Set<string>,
  reserved: Set<string>,
  maxWalls: number,
): boolean {
  const key = cordKey(tile);
  if (reserved.has(key) || walls.has(key) || walls.size >= maxWalls) return false;
  walls.add(key);
  return true;
}

function placeWallSpan(
  tiles: Cord[],
  walls: Set<string>,
  reserved: Set<string>,
  maxWalls: number,
): number {
  let placed = 0;
  for (const tile of tiles) {
    if (tryAddWall(tile, walls, reserved, maxWalls)) placed += 1;
  }
  return placed;
}

function extendSpanToMinLength(
  span: Cord[],
  axis: 'x' | 'y',
  sign: 1 | -1,
  bounds: { x0: number; y0: number; x1: number; y1: number },
): Cord[] {
  const result = [...span];
  const start = span[0];
  const end = span[span.length - 1];
  if (!start || !end) return result;

  while (result.length < MIN_WALL_SEGMENT_LENGTH) {
    const anchor = sign > 0 ? end : start;
    const next =
      axis === 'x'
        ? { x: anchor.x + sign, y: anchor.y }
        : { x: anchor.x, y: anchor.y + sign };

    if (next.x < bounds.x0 || next.x > bounds.x1 || next.y < bounds.y0 || next.y > bounds.y1) {
      break;
    }

    if (sign > 0) {
      result.push(next);
    } else {
      result.unshift(next);
    }
  }

  return result;
}

function buildVerticalWallSpan(
  x: number,
  y0: number,
  y1: number,
  bounds: { x0: number; y0: number; x1: number; y1: number },
): Cord[] {
  if (y1 < y0) return [];

  let span: Cord[] = [];
  for (let y = y0; y <= y1; y += 1) {
    span.push({ x, y });
  }

  if (span.length < MIN_WALL_SEGMENT_LENGTH) {
    span = extendSpanToMinLength(span, 'x', -1, bounds);
    span = extendSpanToMinLength(span, 'x', 1, bounds);
  }

  return span;
}

function buildHorizontalWallSpan(
  y: number,
  x0: number,
  x1: number,
  bounds: { x0: number; y0: number; x1: number; y1: number },
): Cord[] {
  if (x1 < x0) return [];

  let span: Cord[] = [];
  for (let x = x0; x <= x1; x += 1) {
    span.push({ x, y });
  }

  if (span.length < MIN_WALL_SEGMENT_LENGTH) {
    span = extendSpanToMinLength(span, 'y', -1, bounds);
    span = extendSpanToMinLength(span, 'y', 1, bounds);
  }

  return span;
}

function placePartitionedVerticalBorder(
  x: number,
  y0: number,
  y1: number,
  hasPassage: boolean,
  gapCenterY: number,
  zoneBounds: { x0: number; y0: number; x1: number; y1: number },
  walls: Set<string>,
  reserved: Set<string>,
  maxWalls: number,
): void {
  if (!hasPassage) {
    placeWallSpan(buildVerticalWallSpan(x, y0, y1, zoneBounds), walls, reserved, maxWalls);
    return;
  }

  const gapStart = clamp(gapCenterY - Math.floor(CORRIDOR_WIDTH / 2), y0, y1);
  const gapEnd = clamp(gapStart + CORRIDOR_WIDTH - 1, y0, y1);

  if (gapStart - y0 >= 1) {
    placeWallSpan(
      buildVerticalWallSpan(x, y0, gapStart - 1, zoneBounds),
      walls,
      reserved,
      maxWalls,
    );
  }

  if (y1 - gapEnd >= 1) {
    placeWallSpan(
      buildVerticalWallSpan(x, gapEnd + 1, y1, zoneBounds),
      walls,
      reserved,
      maxWalls,
    );
  }
}

function placePartitionedHorizontalBorder(
  y: number,
  x0: number,
  x1: number,
  hasPassage: boolean,
  gapCenterX: number,
  zoneBounds: { x0: number; y0: number; x1: number; y1: number },
  walls: Set<string>,
  reserved: Set<string>,
  maxWalls: number,
): void {
  if (!hasPassage) {
    placeWallSpan(buildHorizontalWallSpan(y, x0, x1, zoneBounds), walls, reserved, maxWalls);
    return;
  }

  const gapStart = clamp(gapCenterX - Math.floor(CORRIDOR_WIDTH / 2), x0, x1);
  const gapEnd = clamp(gapStart + CORRIDOR_WIDTH - 1, x0, x1);

  if (gapStart - x0 >= 1) {
    placeWallSpan(
      buildHorizontalWallSpan(y, x0, gapStart - 1, zoneBounds),
      walls,
      reserved,
      maxWalls,
    );
  }

  if (x1 - gapEnd >= 1) {
    placeWallSpan(
      buildHorizontalWallSpan(y, gapEnd + 1, x1, zoneBounds),
      walls,
      reserved,
      maxWalls,
    );
  }
}

function addExtraPassages(passages: Set<string>, rng: () => number): void {
  const extraCandidates: { cx: number; cy: number; dir: BorderDir }[] = [];
  for (let cy = 0; cy < ZONE_ROWS; cy += 1) {
    for (let cx = 0; cx < ZONE_COLS; cx += 1) {
      if (cx + 1 < ZONE_COLS && !passages.has(passageKey(cx, cy, 'east'))) {
        extraCandidates.push({ cx, cy, dir: 'east' });
      }
      if (cy + 1 < ZONE_ROWS && !passages.has(passageKey(cx, cy, 'south'))) {
        extraCandidates.push({ cx, cy, dir: 'south' });
      }
    }
  }

  const extraOpenings = Math.floor(extraCandidates.length * 0.12);
  for (let i = 0; i < extraOpenings; i += 1) {
    const pick = extraCandidates[Math.floor(rng() * extraCandidates.length)];
    if (!pick) break;
    passages.add(passageKey(pick.cx, pick.cy, pick.dir));
    if (pick.dir === 'east') {
      passages.add(passageKey(pick.cx + 1, pick.cy, 'west'));
    } else {
      passages.add(passageKey(pick.cx, pick.cy + 1, 'north'));
    }
  }
}

function buildZoneMazeWalls(
  passages: Set<string>,
  reserved: Set<string>,
  maxWalls: number,
): Set<string> {
  const walls = new Set<string>();

  for (let cy = 0; cy < ZONE_ROWS; cy += 1) {
    for (let cx = 0; cx < ZONE_COLS; cx += 1) {
      const bounds = zoneBounds(cx, cy);
      const gapCenterY = Math.floor((bounds.y0 + bounds.y1) / 2);
      const gapCenterX = Math.floor((bounds.x0 + bounds.x1) / 2);

      if (cx + 1 < ZONE_COLS) {
        const hasPassage = passages.has(passageKey(cx, cy, 'east'));
        const eastX = bounds.x1;
        placePartitionedVerticalBorder(
          eastX,
          bounds.y0,
          bounds.y1,
          hasPassage,
          gapCenterY,
          bounds,
          walls,
          reserved,
          maxWalls,
        );
      }

      if (cy + 1 < ZONE_ROWS) {
        const hasPassage = passages.has(passageKey(cx, cy, 'south'));
        const southY = bounds.y1;
        placePartitionedHorizontalBorder(
          southY,
          bounds.x0,
          bounds.x1,
          hasPassage,
          gapCenterX,
          bounds,
          walls,
          reserved,
          maxWalls,
        );
      }
    }
  }

  return walls;
}

function floodReachable(walls: Set<string>, start: Cord): Set<string> {
  const reachable = new Set<string>();
  const queue: Cord[] = [start];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;

    const key = cordKey(current);
    if (reachable.has(key) || walls.has(key)) continue;

    reachable.add(key);
    for (const neighbor of getHexNeighbors(current.x, current.y)) {
      queue.push(neighbor);
    }
  }

  return reachable;
}

function ensureSpawnNotTrapped(
  walls: Set<string>,
  spawn: Cord,
  reserved: Set<string>,
  rng: () => number,
): void {
  const minReachable = Math.floor(allGridTiles().length * MIN_REACHABLE_FROM_SPAWN_RATIO);
  let reachable = floodReachable(walls, spawn);

  while (reachable.size < minReachable) {
    const candidates = [...walls].filter((key) => {
      if (reserved.has(key)) return false;
      const tile = parseCordKey(key);
      return getHexNeighbors(tile.x, tile.y).some((neighbor) =>
        reachable.has(cordKey(neighbor)),
      );
    });

    if (candidates.length === 0) break;

    const remove = candidates[Math.floor(rng() * candidates.length)];
    if (!remove) break;
    walls.delete(remove);
    reachable = floodReachable(walls, spawn);
  }
}

function wallsFromKeys(wallKeys: Set<string>): Cord[] {
  return allGridTiles().filter((tile) => wallKeys.has(cordKey(tile)));
}

/** Fixed tutorial chunk keeps the hand-authored obstacle layout. */
export function getOriginChunkWalls(): Cord[] {
  return STATIC_RESTRICTED_TILES.map((tile) => ({ x: tile.x, y: tile.y }));
}

export function generateChunkWalls(options: GenerateChunkOptions): Cord[] {
  const { chunk, entryEdge, entryPosition } = options;

  if (chunk.x === 0 && chunk.y === 0) {
    return getOriginChunkWalls();
  }

  const rng = createSeededRng(chunkSeed(chunk));
  const totalTiles = allGridTiles().length;
  const maxWalls = Math.floor(totalTiles * (1 - TARGET_WALKABLE_RATIO));
  const reserved = buildReservedZone(entryEdge, entryPosition);
  const spawn = spawnCordForEntry(entryEdge, entryPosition);

  const passages = buildZonePassages(rng);
  forceEntryPassage(passages, entryEdge, entryPosition);
  addExtraPassages(passages, rng);

  const wallKeys = buildZoneMazeWalls(passages, reserved, maxWalls);

  for (const key of reserved) {
    wallKeys.delete(key);
  }

  ensureSpawnNotTrapped(wallKeys, spawn, reserved, rng);

  return wallsFromKeys(wallKeys);
}

export function oppositeEdge(edge: MapEdge): MapEdge {
  switch (edge) {
    case 'north':
      return 'south';
    case 'south':
      return 'north';
    case 'east':
      return 'west';
    case 'west':
      return 'east';
  }
}

export function entryPositionForPlayer(edge: MapEdge, player: Cord): number {
  if (edge === 'north' || edge === 'south') return player.x;
  return player.y;
}
