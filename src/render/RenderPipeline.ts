import { CURSOR_SIZE } from '@/core/constants';
import type { GameState, TileType } from '@/core/types';
import { hexDepth } from '@/grid/FalloutGeometry';
import type { HexGrid } from '@/grid/HexGrid';
import { isInGridBounds } from '@/grid/hexNeighbors';
import type { AssetLoader } from '@/render/AssetLoader';
import { drawEnemy, drawPlayer } from '@/render/SpriteRenderer';

const CURSOR_KEYS: Record<TileType, string> = {
  0: 'cursorStandard',
  1: 'cursorRestricted',
  2: 'cursorEnemy',
  3: 'cursorTouch',
  4: 'cursorStandard',
};

const ENEMY_HEX_ALIVE = 'rgba(255, 165, 0, 0.2)';
const ENEMY_HEX_DEAD = 'rgba(96, 96, 96, 0.35)';
const PATH_PREVIEW_FILL = 'rgba(0, 210, 255, 0.35)';

export class RenderPipeline {
  constructor(
    private readonly canvas: HTMLCanvasElement,
    private readonly barCanvas: HTMLCanvasElement,
    private readonly hexGrid: HexGrid,
    private readonly assets: AssetLoader,
  ) {}

  render(state: GameState): void {
    const ctx = this.canvas.getContext('2d');
    const barCtx = this.barCanvas.getContext('2d');
    if (!ctx || !barCtx) return;

    this.clear(ctx);
    this.drawBackground(ctx);
    this.drawRestrictedAreas(ctx, state);
    this.drawPathPreview(ctx, state);
    this.drawHoverHex(ctx, state);
    this.drawEntities(ctx, state);
    this.drawCursor(ctx, state);
    this.drawBar(barCtx);
    this.drawHud(ctx, state);
    if (state.gameOver) {
      this.drawGameOver(ctx);
    }
  }

  private clear(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawBackground(ctx: CanvasRenderingContext2D): void {
    const bg = this.assets.get('bgDesert');
    ctx.drawImage(bg, 0, 0, 960, 440, 0, 0, 960, 440);
  }

  private drawPathPreview(ctx: CanvasRenderingContext2D, state: GameState): void {
    for (const cord of state.pathPreview) {
      this.hexGrid.drawHexAtColRow(ctx, cord.x, cord.y, PATH_PREVIEW_FILL);
    }
  }

  private drawHoverHex(ctx: CanvasRenderingContext2D, state: GameState): void {
    const { x, y } = state.positions.mousePointer.HEX.CORD;
    this.hexGrid.drawHexAtColRow(ctx, x, y, 'rgba(255,0,255,0.2)');
  }

  private drawRestrictedAreas(ctx: CanvasRenderingContext2D, state: GameState): void {
    for (const cord of state.restricted.cords) {
      this.hexGrid.drawHexAtColRow(ctx, cord.x, cord.y, 'rgba(255,0,0,0.15)');
    }
  }

  private drawEntities(ctx: CanvasRenderingContext2D, state: GameState): void {
    const playerCord = state.positions.playerPos.HEX.CORD;
    const drawables = [
      ...state.enemies.map((enemy) => ({
        cord: enemy.HEX.CORD,
        draw: () => {
          const tile = this.hexGrid.getPXAtColRow(enemy.HEX.CORD.x, enemy.HEX.CORD.y);
          const hexColor = enemy.alive ? ENEMY_HEX_ALIVE : ENEMY_HEX_DEAD;
          this.hexGrid.drawHexAtColRow(ctx, enemy.HEX.CORD.x, enemy.HEX.CORD.y, hexColor);
          drawEnemy(ctx, this.assets, enemy, tile.x, tile.y);
        },
      })),
      {
        cord: playerCord,
        draw: () => {
          this.hexGrid.drawHexAtColRow(ctx, playerCord.x, playerCord.y, 'blue');
          drawPlayer(ctx, this.assets, state);
        },
      },
    ];

    drawables.sort(
      (a, b) => hexDepth(a.cord.x, a.cord.y) - hexDepth(b.cord.x, b.cord.y),
    );

    for (const drawable of drawables) {
      drawable.draw();
    }
  }

  private drawCursor(ctx: CanvasRenderingContext2D, state: GameState): void {
    const cursorKey = CURSOR_KEYS[state.cursorType] ?? 'cursorStandard';
    const cursor = this.assets.get(cursorKey);
    const { x: mouseX, y: mouseY } = state.positions.mousePointer.HEX.PX;
    const { x: column, y: row } = state.positions.mousePointer.HEX.CORD;

    let anchorX = mouseX;
    let anchorY = mouseY;
    if (isInGridBounds(column, row)) {
      const hexCenter = this.hexGrid.getPXAtColRow(column, row);
      anchorX = hexCenter.x;
      anchorY = hexCenter.y;
    }

    const drawX = anchorX - CURSOR_SIZE.hotspotX;
    const drawY = anchorY - CURSOR_SIZE.hotspotY;
    ctx.drawImage(
      cursor,
      0,
      0,
      CURSOR_SIZE.width,
      CURSOR_SIZE.height,
      drawX,
      drawY,
      CURSOR_SIZE.width,
      CURSOR_SIZE.height,
    );
  }

  private drawBar(ctx: CanvasRenderingContext2D): void {
    const bar = this.assets.get('bar');
    ctx.drawImage(bar, 0, 0, 1100, 100, 0, 0, 1100, 100);
  }

  private drawHud(ctx: CanvasRenderingContext2D, state: GameState): void {
    if (state.gameOver) return;

    ctx.font = '13px monospace';
    ctx.fillStyle = '#fff';
    ctx.fillText(`In combat: ${state.combat.inCombat}`, 20, 385);
    if (state.combat.inCombat) {
      const current = state.combat.queue[state.combat.queuePos];
      const turnLabel =
        current && 'id' in current && current.id === '_player' ? 'Player' : 'Enemy';
      ctx.fillText(`Turn: ${turnLabel}`, 20, 400);
    }
    ctx.fillText(
      `actionPoints: ${state.player.actionPoints}/${state.player.DEFAULTS.actionPoints}`,
      20,
      415,
    );
  }

  private drawGameOver(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = 'rgba(20, 8, 8, 0.55)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#ff4444';
    ctx.font = 'bold 48px monospace';
    ctx.fillText('YOU DIED', this.canvas.width / 2, this.canvas.height / 2 - 12);

    ctx.fillStyle = '#e8d8d8';
    ctx.font = '16px monospace';
    ctx.fillText('Combat is over.', this.canvas.width / 2, this.canvas.height / 2 + 24);
    ctx.textAlign = 'start';
  }
}
