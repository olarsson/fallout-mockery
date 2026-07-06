import type { GameState, TileType } from '@/core/types';
import type { HexGrid } from '@/grid/HexGrid';
import type { AssetLoader } from '@/render/AssetLoader';
import { drawEnemy, drawPlayer } from '@/render/SpriteRenderer';

const CURSOR_KEYS: Record<TileType, string> = {
  0: 'cursorStandard',
  1: 'cursorRestricted',
  2: 'cursorEnemy',
  3: 'cursorTouch',
  4: 'cursorStandard',
};

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
    this.drawHoverHex(ctx, state);
    this.drawRestrictedAreas(ctx, state);
    this.drawEntities(ctx, state);
    this.drawCursor(ctx, state);
    this.drawBar(barCtx);
    this.drawHud(ctx, state);
  }

  private clear(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawBackground(ctx: CanvasRenderingContext2D): void {
    const bg = this.assets.get('bgDesert');
    ctx.drawImage(bg, 0, 0, 960, 440, 0, 0, 960, 440);
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
    for (const enemy of state.enemies) {
      const tile = this.hexGrid.getPXAtColRow(enemy.HEX.CORD.x, enemy.HEX.CORD.y);
      this.hexGrid.drawHexAtColRow(ctx, enemy.HEX.CORD.x, enemy.HEX.CORD.y, 'rgba(255,165,0,0.2)');
      drawEnemy(ctx, this.assets, enemy, tile.x, tile.y);
    }

    const playerCord = state.positions.playerPos.HEX.CORD;
    this.hexGrid.drawHexAtColRow(ctx, playerCord.x, playerCord.y, 'blue');

    ctx.fillStyle = '#ffddff';
    ctx.font = '14px monospace';
    ctx.fillText(
      String(state.player.health),
      state.positions.playerPos.HEX.PX.x - 20,
      state.positions.playerPos.HEX.PX.y,
    );

    drawPlayer(ctx, this.assets, state);
  }

  private drawCursor(ctx: CanvasRenderingContext2D, state: GameState): void {
    const cursorKey = CURSOR_KEYS[state.cursorType] ?? 'cursorStandard';
    const cursor = this.assets.get(cursorKey);
    const { x, y } = state.positions.mousePointer.HEX.PX;
    ctx.drawImage(cursor, 0, 0, 28, 23, x, y, 28, 23);
  }

  private drawBar(ctx: CanvasRenderingContext2D): void {
    const bar = this.assets.get('bar');
    ctx.drawImage(bar, 0, 0, 1100, 100, 0, 0, 1100, 100);
  }

  private drawHud(ctx: CanvasRenderingContext2D, state: GameState): void {
    ctx.font = '13px monospace';
    ctx.fillStyle = '#fff';
    ctx.fillText(`In combat: ${state.combat.inCombat}`, 20, 400);
    ctx.fillText(
      `actionPoints: ${state.player.actionPoints}/${state.player.DEFAULTS.actionPoints}`,
      20,
      415,
    );
  }
}
