import type {
  ChunkSnapshot,
  EnemyEntity,
  EnemySnapshot,
  GameState,
  MapChunkCoord,
} from '@/core/types';
import { restoreEnemyFromSnapshot } from '@/entities/createEnemy';
import type { HexGrid } from '@/grid/HexGrid';

export function chunkKey(chunk: MapChunkCoord): string {
  return `${chunk.x},${chunk.y}`;
}

export function enemyToSnapshot(enemy: EnemyEntity): EnemySnapshot {
  return {
    id: enemy.id,
    alive: enemy.alive,
    health: enemy.health,
    actionPoints: enemy.actionPoints,
    state: enemy.state,
    facing: { ...enemy.FACING },
    cord: { ...enemy.HEX.CORD },
    temp: { ...enemy.temp },
  };
}

export function saveChunkSnapshot(state: GameState): void {
  const key = chunkKey(state.map.chunk);
  state.map.visited[key] = {
    walls: state.restricted.cords.map((wall) => ({ x: wall.x, y: wall.y })),
    enemies: state.enemies.map(enemyToSnapshot),
  };
}

export function getChunkSnapshot(
  state: GameState,
  chunk: MapChunkCoord,
): ChunkSnapshot | undefined {
  return state.map.visited[chunkKey(chunk)];
}

export function restoreChunkEnemies(
  hexGrid: HexGrid,
  snapshot: ChunkSnapshot,
): EnemyEntity[] {
  return snapshot.enemies.map((enemy) => restoreEnemyFromSnapshot(hexGrid, enemy));
}
