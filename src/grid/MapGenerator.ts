import { GRID_COLS, GRID_ROWS, STATIC_RESTRICTED_TILES } from '@/core/constants';
import type { Cord, MapChunkCoord } from '@/core/types';
import { cordKey, getHexNeighbors } from '@/grid/hexNeighbors';

export type MapEdge = 'north' | 'south' | 'east' | 'west';

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

function allGridTiles(): Cord[] {
  const tiles: Cord[] = [];
  for (let x = 0; x <= GRID_COLS; x += 1) {
    for (let y = 0; y <= GRID_ROWS; y += 1) {
      tiles.push({ x, y });
    }
  }
  return tiles;
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

function bridgeBetween(a: Cord, b: Cord): Cord | undefined {
  for (const mid of getHexNeighbors(a.x, a.y)) {
    const beyond = getHexNeighbors(mid.x, mid.y);
    if (beyond.some((neighbor) => neighbor.x === b.x && neighbor.y === b.y)) {
      return mid;
    }
  }
  return undefined;
}

function isLatticeCoord(x: number, y: number): boolean {
  return (
    x >= 1 &&
    x <= GRID_COLS - 1 &&
    y >= 1 &&
    y <= GRID_ROWS - 1 &&
    x % 2 === 1 &&
    y % 2 === 1
  );
}

function latticeCells(): Cord[] {
  return allGridTiles().filter((tile) => isLatticeCoord(tile.x, tile.y));
}

function carveSparseHexMaze(walkable: Set<string>, rng: () => number): void {
  const lattice = latticeCells();
  if (lattice.length === 0) return;

  const visited = new Set<string>();
  const start = lattice[Math.floor(rng() * lattice.length)];
  if (!start) return;

  visited.add(cordKey(start));
  walkable.add(cordKey(start));
  const stack: Cord[] = [start];

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    if (!current) break;

    const links = lattice
      .filter((node) => !visited.has(cordKey(node)))
      .map((node) => ({ node, bridge: bridgeBetween(current, node) }))
      .filter((link): link is { node: Cord; bridge: Cord } => !!link.bridge);

    if (links.length === 0) {
      stack.pop();
      continue;
    }

    const link = links[Math.floor(rng() * links.length)];
    if (!link) break;

    visited.add(cordKey(link.node));
    walkable.add(cordKey(link.node));
    walkable.add(cordKey(link.bridge));
    stack.push(link.node);
  }

  // Add a few shortcuts so corridors are not all dead ends.
  const wallCandidates = allGridTiles().filter((tile) => !walkable.has(cordKey(tile)));
  const openings = Math.floor(wallCandidates.length * 0.04);
  for (let i = 0; i < openings; i += 1) {
    const tile = wallCandidates[Math.floor(rng() * wallCandidates.length)];
    if (!tile) continue;

    const walkableNeighbors = getHexNeighbors(tile.x, tile.y).filter((neighbor) =>
      walkable.has(cordKey(neighbor)),
    );
    if (walkableNeighbors.length >= 2) {
      walkable.add(cordKey(tile));
    }
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

function wallsFromWalkable(walkable: Set<string>): Cord[] {
  return allGridTiles().filter((tile) => !walkable.has(cordKey(tile)));
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
  const walkable = new Set<string>();

  carveSparseHexMaze(walkable, rng);
  carveEntry(walkable, entryEdge, entryPosition);
  carveInwardCorridor(walkable, entryEdge, entryPosition, 5);

  return wallsFromWalkable(walkable);
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
