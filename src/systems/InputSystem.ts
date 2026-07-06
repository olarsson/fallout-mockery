import type { GameContext } from '@/core/types';
import { isSameCord } from '@/grid/RestrictionMap';
import { queryTile } from '@/grid/TileQuery';
import { CombatSystem } from '@/systems/CombatSystem';
import { movePlayerAlongPath } from '@/systems/MovementSystem';

export class InputSystem {
  private readonly combat: CombatSystem;

  constructor(
    private readonly ctx: GameContext,
    private readonly canvas: HTMLCanvasElement,
  ) {
    this.combat = new CombatSystem(ctx);
  }

  bind(): void {
    this.canvas.addEventListener('mousemove', this.onMouseMove);
    this.canvas.addEventListener('click', this.onClick);
    window.addEventListener('resize', this.onResize);
  }

  unbind(): void {
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.removeEventListener('click', this.onClick);
    window.removeEventListener('resize', this.onResize);
  }

  updateViewport(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.ctx.state.viewport = { x: rect.x, y: rect.y };
  }

  private onMouseMove = (event: MouseEvent): void => {
    const { state, hexGrid } = this.ctx;

    state.positions.mousePointer.HEX.PX.x = event.clientX - state.viewport.x;
    state.positions.mousePointer.HEX.PX.y = event.clientY - state.viewport.y;

    const tile = hexGrid.getSelectedTile(event.pageX, event.pageY);
    state.positions.mousePointer.HEX.CORD = { x: tile.column, y: tile.row };

    const tileInfo = queryTile(state, state.positions.mousePointer.HEX.CORD);
    state.cursorType = tileInfo.type;
  };

  private onClick = (event: MouseEvent): void => {
    const { state, hexGrid } = this.ctx;
    if (state.player.stopActions) return;

    const previousClick = { ...state.positions.clickPos.HEX.CORD };
    const tile = hexGrid.getSelectedTile(event.pageX, event.pageY);

    if (tile.column >= 0 && tile.row >= 0) {
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

  private onResize = (): void => {
    fixCanvasSize(this.canvas, this.ctx.barCanvas);
    this.updateViewport();
  };
}

export function fixCanvasSize(...canvases: HTMLCanvasElement[]): void {
  for (const canvas of canvases) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
}
