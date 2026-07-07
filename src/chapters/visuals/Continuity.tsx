import { useState, useCallback } from 'react';
import MathCanvas, { createCoordTransform, drawAxes } from '../../components/MathCanvas';
import ControlPanel from '../../components/ControlPanel';

const DISCONT_TYPES = [
  { value: 'removable', label: '可去间断点 — sin(x)/x' },
  { value: 'jump', label: '跳跃间断点 — sgn(x)' },
  { value: 'infinite', label: '无穷间断点 — 1/x' },
  { value: 'oscillating', label: '振荡间断点 — sin(1/x)' },
];

export function ContinuityViz() {
  const [type, setType] = useState('removable');

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _coord: ReturnType<typeof createCoordTransform>, w: number, h: number) => {
      const xMin = -2, xMax = 2, yMin = -2.5, yMax = 2.5;
      const c = createCoordTransform(w, h, xMin, xMax, yMin, yMax, 40);
      drawAxes(ctx, c, w, h, xMin, xMax, yMin, yMax, 0.5);

      ctx.save();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      const steps = 600;

      if (type === 'removable') {
        // f(x) = sin(x)/x, with hole at x=0
        for (let side = 0; side < 2; side++) {
          const xStart = side === 0 ? xMin : 0.001;
          const xEnd = side === 0 ? -0.001 : xMax;
          ctx.beginPath();
          for (let i = 0; i <= steps / 2; i++) {
            const x = xStart + (xEnd - xStart) * i / (steps / 2);
            if (Math.abs(x) < 1e-4) continue;
            const y = Math.sin(x) / x;
            const [px, py] = c.toPixel(x, y);
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
        // Open circle at (0, 1) — the hole
        const [hx, hy] = c.toPixel(0, 1);
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(hx, hy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#d93025';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#d93025';
        ctx.font = '11px sans-serif';
        ctx.fillText('可去间断', hx - 30, hy - 14);

        // Filled circle at the limit
        ctx.fillStyle = '#1a73e8';
        ctx.beginPath();
        ctx.arc(hx, hy, 3, 0, Math.PI * 2);
        ctx.fill();

      } else if (type === 'jump') {
        // sgn(x)
        ctx.beginPath();
        const [n1x, n1y] = c.toPixel(xMin, -1);
        const [n2x, n2y] = c.toPixel(-0.001, -1);
        ctx.moveTo(n1x, n1y); ctx.lineTo(n2x, n2y); ctx.stroke();
        ctx.beginPath();
        const [p1x, p1y] = c.toPixel(0.001, 1);
        const [p2x, p2y] = c.toPixel(xMax, 1);
        ctx.moveTo(p1x, p1y); ctx.lineTo(p2x, p2y); ctx.stroke();

        // Open circle at (0,1) and (0,-1)
        const [u1x, u1y] = c.toPixel(0, 1);
        const [u2x, u2y] = c.toPixel(0, -1);
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(u1x, u1y, 5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#d93025'; ctx.stroke();
        ctx.beginPath(); ctx.arc(u2x, u2y, 5, 0, Math.PI * 2); ctx.fill();
        ctx.stroke();
        // Origin point
        const [ox, oy] = c.toPixel(0, 0);
        ctx.fillStyle = '#d93025';
        ctx.beginPath(); ctx.arc(ox, oy, 3, 0, Math.PI * 2); ctx.fill();

      } else if (type === 'infinite') {
        // f(x) = 1/x
        for (let side = 0; side < 2; side++) {
          ctx.beginPath();
          const xStart = side === 0 ? xMin : 0.01;
          const xEnd = side === 0 ? -0.01 : xMax;
          for (let i = 0; i <= steps / 2; i++) {
            const x = xStart + (xEnd - xStart) * i / (steps / 2);
            if (Math.abs(x) < 1e-4) continue;
            const y = 1 / x;
            if (!isFinite(y)) continue;
            const [px, py] = c.toPixel(x, Math.max(-2.5, Math.min(2.5, y)));
            i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      } else if (type === 'oscillating') {
        // sin(1/x)
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const x = xMin + (xMax - xMin) * i / steps;
          if (Math.abs(x) < 0.001) continue;
          const cy = Math.max(-2, Math.min(2, Math.sin(1 / x)));
          const [px, py] = c.toPixel(x, cy);
          if (i === 0 || Math.abs(x - xMin) < 0.001) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        // Shade the oscillation zone around x=0
        ctx.fillStyle = 'rgba(220, 50, 30, 0.1)';
        const [zx1, zy1] = c.toPixel(-0.05, -1);
        const [zx2, zy2] = c.toPixel(0.05, 1);
        ctx.fillRect(zx1, zy2, zx2 - zx1, zy1 - zy2);
      }

      ctx.restore();
    },
    [type]
  );

  return (
    <div className="visual-wrapper">
      <div className="visual-canvas">
        <MathCanvas width={650} height={380} draw={draw} />
      </div>
      <div className="visual-controls">
        <ControlPanel
          title="间断点类型"
          selects={[{
            label: '类型',
            value: type,
            options: DISCONT_TYPES,
            onChange: setType,
          }]}
        />
      </div>
    </div>
  );
}
