import {
  MAP_HEX_HEIGHT,
  MAP_HEX_LINE_HEIGHT,
  MAP_HEX_WIDTH,
} from '@/core/constants';

export type MapEdges = {
  west: number;
  north: number;
  east: number;
  south: number;
};

export type GridLayout = {
  scaleX: number;
  scaleY: number;
  originX: number;
  originY: number;
};

type ScaledMetrics = {
  hexWidth: number;
  lineHeight: number;
  hexHeight: number;
  halfW: number;
  hq: number;
  limit: number;
};

function metrics(scaleX: number, scaleY: number): ScaledMetrics {
  const hexWidth = MAP_HEX_WIDTH * scaleX;
  const lineHeight = MAP_HEX_LINE_HEIGHT * scaleY;
  const hexHeight = MAP_HEX_HEIGHT * scaleY;
  const halfW = hexWidth / 2;
  const hq = hexHeight / 4;
  return { hexWidth, lineHeight, hexHeight, halfW, hq, limit: 2 * halfW * hq };
}

function hexRowShift(hexX: number): number {
  return hexX < 0 ? Math.floor((hexX - 1) / 2) : Math.floor(hexX / 2);
}

/** Fallout engine X grows west; mirror so game column grows east. */
function toEngineX(column: number): number {
  return -column;
}

function hexTopLeftUnscaled(
  column: number,
  row: number,
  scaleX: number,
  scaleY: number,
): { x: number; y: number } {
  const m = metrics(scaleX, scaleY);
  const rx = toEngineX(column);
  const ry = row;
  const hx = hexRowShift(rx);
  const x = ry * m.halfW - rx * m.hexWidth + m.halfW * hx;
  const y = ry * m.lineHeight + m.lineHeight * hx;
  return { x, y };
}

function gridBounds(cols: number, rows: number, scaleX: number, scaleY: number) {
  const m = metrics(scaleX, scaleY);
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (let column = 0; column <= cols; column += 1) {
    for (let row = 0; row <= rows; row += 1) {
      const topLeft = hexTopLeftUnscaled(column, row, scaleX, scaleY);
      minX = Math.min(minX, topLeft.x);
      minY = Math.min(minY, topLeft.y);
      maxX = Math.max(maxX, topLeft.x + m.hexWidth);
      maxY = Math.max(maxY, topLeft.y + m.hexHeight);
    }
  }

  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

function hexCenterUnscaled(
  column: number,
  row: number,
  scaleX: number,
  scaleY: number,
): { x: number; y: number } {
  const m = metrics(scaleX, scaleY);
  const topLeft = hexTopLeftUnscaled(column, row, scaleX, scaleY);
  return { x: topLeft.x + m.halfW, y: topLeft.y + m.hexHeight / 2 };
}

/** Fit to the dense cross-section of the isometric diamond, not the empty AABB corners. */
function gridFitSpan(cols: number, rows: number, scaleX: number, scaleY: number) {
  const m = metrics(scaleX, scaleY);
  const midRow = Math.floor(rows / 2);
  const midCol = Math.floor(cols / 2);

  const west = hexCenterUnscaled(0, midRow, scaleX, scaleY);
  const east = hexCenterUnscaled(cols, midRow, scaleX, scaleY);
  const north = hexCenterUnscaled(midCol, 0, scaleX, scaleY);
  const south = hexCenterUnscaled(midCol, rows, scaleX, scaleY);

  const minX = west.x - m.halfW;
  const maxX = east.x + m.halfW;
  const minY = north.y - m.hexHeight / 2;
  const maxY = south.y + m.hexHeight / 2;

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

export function computeGridLayout(
  cols: number,
  rows: number,
  canvasWidth: number,
  canvasHeight: number,
): GridLayout {
  const unit = gridFitSpan(cols, rows, 1, 1);
  const fill = 0.98;
  const scaleX = (canvasWidth * fill) / unit.width;
  const scaleY = (canvasHeight * fill) / unit.height;
  const scaled = gridBounds(cols, rows, scaleX, scaleY);

  return {
    scaleX,
    scaleY,
    originX: Math.round((canvasWidth - scaled.width) / 2 - scaled.minX),
    originY: Math.round((canvasHeight - scaled.height) / 2 - scaled.minY),
  };
}

export function hexTopLeft(
  column: number,
  row: number,
  layout: GridLayout,
): { x: number; y: number } {
  const topLeft = hexTopLeftUnscaled(column, row, layout.scaleX, layout.scaleY);
  return { x: layout.originX + topLeft.x, y: layout.originY + topLeft.y };
}

export function hexCenter(
  column: number,
  row: number,
  layout: GridLayout,
): { x: number; y: number } {
  const m = metrics(layout.scaleX, layout.scaleY);
  const topLeft = hexTopLeft(column, row, layout);
  return { x: topLeft.x + m.halfW, y: topLeft.y + m.hexHeight / 2 };
}

function isInsideHex(dx: number, dy: number, m: ScaledMetrics): boolean {
  return (
    Math.abs(dx) <= m.halfW &&
    Math.abs(dx * m.hq - dy * m.halfW) <= m.limit &&
    Math.abs(dx * m.hq + dy * m.halfW) <= m.limit
  );
}

/** Port of FOnline GeometryHelper::GetHexPosCoord (hexagonal). */
export function screenToHex(
  canvasX: number,
  canvasY: number,
  layout: GridLayout,
): { column: number; row: number } {
  const m = metrics(layout.scaleX, layout.scaleY);
  const posX = canvasX - layout.originX;
  const posY = canvasY - layout.originY;

  const fa = posY / m.lineHeight;
  const fb = (posX - fa * m.halfW) / m.hexWidth;
  const fc = -(fa + fb);

  let ra = Math.round(fa);
  let rb = Math.round(fb);
  let rc = Math.round(fc);

  if (ra + rb + rc !== 0) {
    const da = Math.abs(ra - fa);
    const db = Math.abs(rb - fb);
    const dc = Math.abs(rc - fc);
    if (da > db && da > dc) {
      ra = -(rb + rc);
    } else if (db > dc) {
      rb = -(ra + rc);
    } else {
      rc = -(ra + rb);
    }
  }

  let dx = posX - (ra * m.halfW + rb * m.hexWidth);
  let dy = posY - ra * m.lineHeight;

  if (!isInsideHex(dx, dy, m)) {
    const neighborOffsets = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, -1],
      [-1, 1],
    ] as const;

    for (const [ox, oy] of neighborOffsets) {
      const na = ra + ox;
      const nb = rb + oy;
      const ndx = posX - (na * m.halfW + nb * m.hexWidth);
      const ndy = posY - na * m.lineHeight;
      if (isInsideHex(ndx, ndy, m)) {
        ra = na;
        rb = nb;
        break;
      }
    }
  }

  const rx = -rb;
  const ry = ra - (rx < 0 ? Math.floor((rx - 1) / 2) : Math.floor(rx / 2));
  return { column: -rx, row: ry };
}

export function hexOutlineVertices(
  centerX: number,
  centerY: number,
  layout: GridLayout,
): { x: number; y: number }[] {
  const m = metrics(layout.scaleX, layout.scaleY);
  return [
    { x: centerX, y: centerY - m.hexHeight / 2 },
    { x: centerX + m.halfW, y: centerY - m.hq },
    { x: centerX + m.halfW, y: centerY + m.hq },
    { x: centerX, y: centerY + m.hexHeight / 2 },
    { x: centerX - m.halfW, y: centerY + m.hq },
    { x: centerX - m.halfW, y: centerY - m.hq },
  ];
}

export function computeMapEdges(
  cols: number,
  rows: number,
  layout: GridLayout,
  canvasWidth: number,
  canvasHeight: number,
): MapEdges {
  const m = metrics(layout.scaleX, layout.scaleY);
  let east = 0;
  let south = 0;

  for (let column = 0; column <= cols; column += 1) {
    for (let row = 0; row <= rows; row += 1) {
      const center = hexCenter(column, row, layout);
      if (
        center.x >= m.halfW &&
        center.x <= canvasWidth - m.halfW &&
        center.y >= m.hexHeight / 2 &&
        center.y <= canvasHeight - m.hexHeight / 2
      ) {
        east = Math.max(east, column);
        south = Math.max(south, row);
      }
    }
  }

  return { west: 0, north: 0, east, south };
}

/** Isometric draw order: lower sum is farther back. */
export function hexDepth(column: number, row: number): number {
  return column + row;
}
