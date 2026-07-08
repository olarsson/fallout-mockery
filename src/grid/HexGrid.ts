import {
  computeGridLayout,
  computeMapEdges,
  hexCenter,
  hexOutlineVertices,
  hexTopLeft,
  screenToHex,
  type GridLayout,
  type MapEdges,
} from '@/grid/FalloutGeometry';

type Tile = { row: number; column: number };

export class HexGrid {
  readonly layout: GridLayout;
  readonly mapEdges: MapEdges;

  constructor(
    cols: number,
    rows: number,
    canvasWidth: number,
    canvasHeight: number,
  ) {
    this.layout = computeGridLayout(cols, rows, canvasWidth, canvasHeight);
    this.mapEdges = computeMapEdges(
      cols,
      rows,
      this.layout,
      canvasWidth,
      canvasHeight,
    );
  }

  /** Hex visual center — feet anchor for critters and cursor aim point. */
  getPXAtColRow(column: number, row: number): { x: number; y: number } {
    return hexCenter(column, row, this.layout);
  }

  drawHexAtColRow(
    ctx: CanvasRenderingContext2D,
    column: number,
    row: number,
    color: string,
  ): void {
    const center = hexCenter(column, row, this.layout);
    this.drawHex(ctx, center.x, center.y, color);
  }

  drawHex(
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    fillColor: string,
  ): void {
    const vertices = hexOutlineVertices(centerX, centerY, this.layout);

    ctx.strokeStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath();
    const first = vertices[0];
    if (!first) return;
    ctx.moveTo(first.x, first.y);
    for (let i = 1; i < vertices.length; i += 1) {
      const vertex = vertices[i];
      if (vertex) ctx.lineTo(vertex.x, vertex.y);
    }
    ctx.closePath();

    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }

    ctx.stroke();
  }

  getSelectedTile(canvasX: number, canvasY: number): Tile {
    const hex = screenToHex(canvasX, canvasY, this.layout);
    return { row: hex.row, column: hex.column };
  }

  getTopLeftAtColRow(column: number, row: number): { x: number; y: number } {
    return hexTopLeft(column, row, this.layout);
  }
}
