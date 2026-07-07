import { useRef, useEffect } from 'react';

export interface CoordTransform {
  // Maps math coords to pixel coords
  toPixel: (mx: number, my: number) => [number, number];
  // Maps pixel coords to math coords
  toMath: (px: number, py: number) => [number, number];
  scale: number; // pixels per math unit
}

export function createCoordTransform(
  canvasW: number,
  canvasH: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  padding = 40
): CoordTransform {
  const drawW = canvasW - 2 * padding;
  const drawH = canvasH - 2 * padding;
  const scaleX = drawW / (xMax - xMin);
  const scaleY = drawH / (yMax - yMin);
  const scale = Math.min(scaleX, scaleY);
  const mathMidX = (xMin + xMax) / 2;
  const mathMidY = (yMin + yMax) / 2;
  const pixelMidX = canvasW / 2;
  const pixelMidY = canvasH / 2;

  const toPixel = (mx: number, my: number): [number, number] => [
    pixelMidX + (mx - mathMidX) * scale,
    pixelMidY - (my - mathMidY) * scale,
  ];

  const toMath = (px: number, py: number): [number, number] => [
    mathMidX + (px - pixelMidX) / scale,
    mathMidY - (py - pixelMidY) / scale,
  ];

  return { toPixel, toMath, scale };
}

interface MathCanvasProps {
  width?: number;
  height?: number;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  draw: (ctx: CanvasRenderingContext2D, coord: CoordTransform, canvasW: number, canvasH: number) => void;
  onCoordChange?: (coord: CoordTransform) => void;
}

export default function MathCanvas({
  width = 600,
  height = 500,
  xMin = -5,
  xMax = 5,
  yMin = -5,
  yMax = 5,
  draw,
  onCoordChange,
}: MathCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const coordRef = useRef<CoordTransform>(createCoordTransform(width, height, xMin, xMax, yMin, yMax));

  useEffect(() => {
    coordRef.current = createCoordTransform(width, height, xMin, xMax, yMin, yMax);
    onCoordChange?.(coordRef.current);
  }, [width, height, xMin, xMax, yMin, yMax, onCoordChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);
    draw(ctx, coordRef.current, width, height);
  }, [width, height, xMin, xMax, yMin, yMax, draw]);

  return <canvas ref={canvasRef} className="math-canvas" />;
}

// Helper: draw axes with ticks
export function drawAxes(
  ctx: CanvasRenderingContext2D,
  coord: CoordTransform,
  w: number,
  h: number,
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  tickStep = 1
) {
  void w; void h;
  ctx.save();
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  ctx.font = '11px sans-serif';
  ctx.fillStyle = '#666';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  // X axis (y=0)
  const [ox1, oy] = coord.toPixel(xMin, 0);
  const [ox2] = coord.toPixel(xMax, 0);
  ctx.beginPath();
  ctx.moveTo(ox1, oy);
  ctx.lineTo(ox2, oy);
  ctx.stroke();

  // Y axis (x=0)
  const [ox, oy1] = coord.toPixel(0, yMin);
  const [, oy2] = coord.toPixel(0, yMax);
  ctx.beginPath();
  ctx.moveTo(ox, oy1);
  ctx.lineTo(ox, oy2);
  ctx.stroke();

  // Ticks on X
  for (let x = Math.ceil(xMin / tickStep) * tickStep; x <= xMax; x += tickStep) {
    if (Math.abs(x) < tickStep / 10) continue;
    const [px, py] = coord.toPixel(x, 0);
    ctx.beginPath();
    ctx.moveTo(px, py - 4);
    ctx.lineTo(px, py + 4);
    ctx.stroke();
    ctx.fillText(x.toFixed(Number.isInteger(x) ? 0 : 1), px, py + 6);
  }

  // Ticks on Y
  for (let y = Math.ceil(yMin / tickStep) * tickStep; y <= yMax; y += tickStep) {
    if (Math.abs(y) < tickStep / 10) continue;
    const [px, py] = coord.toPixel(0, y);
    ctx.beginPath();
    ctx.moveTo(px - 4, py);
    ctx.lineTo(px + 4, py);
    ctx.stroke();
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(y.toFixed(Number.isInteger(y) ? 0 : 1), px - 6, py);
  }

  // Origin label
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  const [p0x, p0y] = coord.toPixel(0, 0);
  ctx.fillText('0', p0x - 6, p0y + 2);

  ctx.restore();
}
