import { BAR_HEIGHT, CANVAS_HEIGHT, CANVAS_WIDTH } from '@/core/constants';
import type { GameContext } from '@/core/types';
import { isInGridBounds } from '@/grid/hexNeighbors';
import { isSameCord } from '@/grid/RestrictionMap';
import { queryTile } from '@/grid/TileQuery';
import { CombatSystem } from '@/systems/CombatSystem';
import { movePlayerAlongPath } from '@/systems/MovementSystem';
import { updatePathPreview } from '@/systems/PathPreview';
import { clientToCanvasPoint } from '@/utils/canvasPointer';

export class InputSystem {
  constructor(
    private readonly ctx: GameContext,
    private readonly canvas: HTMLCanvasElement,
    private readonly combat: CombatSystem,
    private readonly endTurnBtn: HTMLButtonElement,
  ) {}

  bind(): void {
    this.canvas.addEventListener('mousemove', this.onMouseMove);
    this.canvas.addEventListener('click', this.onClick);
    this.endTurnBtn.addEventListener('click', this.onEndTurn);
    window.addEventListener('resize', this.onResize);
  }

  unbind(): void {
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('click', this.onClick);
    this.endTurnBtn.removeEventListener('click', this.onEndTurn);
    window.removeEventListener('resize', this.onResize);
  }

  updateViewport(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.ctx.state.viewport = { x: rect.left, y: rect.top };
  }

  private canvasPoint(event: MouseEvent): { x: number; y: number } {
    return clientToCanvasPoint(this.canvas, event.clientX, event.clientY);
  }

  private onMouseMove = (event: MouseEvent): void => {
    const { state, hexGrid } = this.ctx;
    if (state.gameOver) return;

    const point = this.canvasPoint(event);
    const tile = hexGrid.getSelectedTile(point.x, point.y);
    state.positions.mousePointer.HEX.PX = { x: point.x, y: point.y };
    state.positions.mousePointer.HEX.CORD = { x: tile.column, y: tile.row };

    const tileInfo = queryTile(state, state.positions.mousePointer.HEX.CORD);
    state.cursorType = tileInfo.type;
    updatePathPreview(state, state.positions.mousePointer.HEX.CORD, tileInfo);
  };

  private onClick = (event: MouseEvent): void => {
    const { state, hexGrid } = this.ctx;
    if (state.gameOver || state.player.stopActions) return;

    const previousClick = { ...state.positions.clickPos.HEX.CORD };
    const point = this.canvasPoint(event);
    const tile = hexGrid.getSelectedTile(point.x, point.y);

    if (isInGridBounds(tile.column, tile.row)) {
      const px = hexGrid.getPXAtColRow(tile.column, tile.row);
      state.positions.clickPos.HEX = {
        PX: { x: px.x, y: px.y },
        CORD: { x: tile.column, y: tile.row },
      };
    }

    const from = { ...state.positions.playerPos.HEX.CORD };
    const to = { ...state.positions.clickPos.HEX.CORD };
    const sameTile = isSameCord(state.positions.clickPos.HEX.CORD, previousClick);
    const tileInfo = queryTile(state, to);

    if (tileInfo.type === 0 && !sameTile) {
      movePlayerAlongPath(this.ctx, from, to);
    } else if (tileInfo.type === 2) {
      this.combat.tryCombat(from, to);
    }
  };

  private onEndTurn = (): void => {
    if (this.ctx.state.gameOver) return;
    this.combat.endPlayerTurn();
  };

  private onResize = (): void => {
    this.updateViewport();
  };
}

export function fixCanvasSize(...canvases: HTMLCanvasElement[]): void {
  // Logical resolution stays fixed; CSS scales the stage to the viewport.
  for (const canvas of canvases) {
    if (canvas.id === 'canvas') {
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
    } else if (canvas.id === 'canvasBar') {
      canvas.width = CANVAS_WIDTH;
      canvas.height = BAR_HEIGHT;
    }
  }
}
