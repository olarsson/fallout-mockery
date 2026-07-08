const OFFSET_X = 20;
const OFFSET_Y = 28;

type Point = { x: number; y: number };
type Tile = { row: number; column: number };

export class HexGrid {
  readonly radius: number;
  readonly height: number;
  readonly width: number;
  readonly side: number;

  canvasOriginX = 0;
  canvasOriginY = 0;

  constructor(radius: number) {
    this.radius = radius;
    this.height = Math.sqrt(3) * radius;
    this.width = 2 * radius;
    this.side = (3 / 2) * radius;
  }

  getPXAtColRow(column: number, row: number): Point {
    const drawY =
      column % 2 === 0
        ? row * this.height + this.canvasOriginY
        : row * this.height + this.canvasOriginY + this.height / 2;
    const drawX = column * this.side + this.canvasOriginX;

    return { x: drawX - OFFSET_X, y: drawY - OFFSET_Y };
  }

  drawHexAtColRow(
    ctx: CanvasRenderingContext2D,
    column: number,
    row: number,
    color: string,
  ): void {
    const px = this.getPXAtColRow(column, row);
    this.drawHex(ctx, px.x, px.y, color, '');
  }

  drawHex(
    ctx: CanvasRenderingContext2D,
    x0: number,
    y0: number,
    fillColor: string,
    debugText: string,
  ): void {
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.moveTo(x0 + this.width - this.side, y0);
    ctx.lineTo(x0 + this.side, y0);
    ctx.lineTo(x0 + this.width, y0 + this.height / 2);
    ctx.lineTo(x0 + this.side, y0 + this.height);
    ctx.lineTo(x0 + this.width - this.side, y0 + this.height);
    ctx.lineTo(x0, y0 + this.height / 2);

    if (fillColor) {
      ctx.fillStyle = fillColor;
      ctx.fill();
    }

    ctx.closePath();
    ctx.stroke();

    if (debugText) {
      ctx.font = '8px monospace';
      ctx.fillStyle = 'rgba(0,255,0,0.4)';
      ctx.fillText(
        debugText,
        x0 + this.width / 2 - this.width / 4,
        y0 + this.height - 5,
      );
    }
  }

  getSelectedTile(canvasX: number, canvasY: number): Tile {
    let mouseX = canvasX + OFFSET_X;
    let mouseY = canvasY + OFFSET_Y;

    let column = Math.floor(mouseX / this.side);
    let row = Math.floor(
      column % 2 === 0
        ? mouseY / this.height
        : (mouseY + this.height * 0.5) / this.height - 1,
    );

    if (mouseX > column * this.side && mouseX < column * this.side + this.width - this.side) {
      const p1: Point = {
        x: column * this.side,
        y: column % 2 === 0 ? row * this.height : row * this.height + this.height / 2,
      };
      const p2: Point = { x: p1.x, y: p1.y + this.height / 2 };
      const p3: Point = { x: p1.x + this.width - this.side, y: p1.y };
      const mousePoint: Point = { x: mouseX, y: mouseY };

      if (this.isPointInTriangle(mousePoint, p1, p2, p3)) {
        column -= 1;
        if (column % 2 !== 0) row -= 1;
      }

      const p4 = p2;
      const p5: Point = { x: p4.x, y: p4.y + this.height / 2 };
      const p6: Point = { x: p5.x + (this.width - this.side), y: p5.y };

      if (this.isPointInTriangle(mousePoint, p4, p5, p6)) {
        column -= 1;
        if (column % 2 === 0) row += 1;
      }
    }

    return { row, column };
  }

  private sign(p1: Point, p2: Point, p3: Point): number {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
  }

  private isPointInTriangle(pt: Point, v1: Point, v2: Point, v3: Point): boolean {
    const b1 = this.sign(pt, v1, v2) < 0;
    const b2 = this.sign(pt, v2, v3) < 0;
    const b3 = this.sign(pt, v3, v1) < 0;
    return b1 === b2 && b2 === b3;
  }
}
