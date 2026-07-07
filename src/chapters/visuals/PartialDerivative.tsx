import { useState, useCallback } from 'react';
import MathCanvas, { createCoordTransform, drawAxes } from '../../components/MathCanvas';
import ControlPanel from '../../components/ControlPanel';

// Simple 2D contour plot of a bivariate function
export function PartialDerivViz() {
  const [x0, setX0] = useState(1.0);
  const [y0, setY0] = useState(0.8);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _coord: ReturnType<typeof createCoordTransform>, w: number, h: number) => {
      const xMin = -2, xMax = 2, yMin = -2, yMax = 2;
      const c = createCoordTransform(w, h, xMin, xMax, yMin, yMax, 40);
      drawAxes(ctx, c, w, h, xMin, xMax, yMin, yMax, 0.5);

      // Contour lines for f(x,y) = x² + y²
      const levels = [0.5, 1, 2, 3, 5, 7];
      ctx.save();
      levels.forEach((level) => {
        ctx.strokeStyle = 'rgba(100, 100, 200, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const r = Math.sqrt(level);
        const [cx, cy] = c.toPixel(0, 0);
        const [rx] = c.toPixel(r, 0);
        const pixelR = rx - cx;
        ctx.arc(cx, cy, pixelR, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.restore();

      // Point (x0, y0)
      const [px, py] = c.toPixel(x0, y0);
      ctx.fillStyle = '#d93025';
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();

      // Gradient vector at (x0, y0)
      const gradX = 2 * x0;
      const gradY = 2 * y0;
      const scale = 0.15;
      const [gx, gy] = c.toPixel(x0 + gradX * scale, y0 + gradY * scale);
      ctx.strokeStyle = '#ff6600';
      ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(gx, gy); ctx.stroke();
      // arrowhead
      const angle = Math.atan2(gy - py, gx - px);
      const hl = 8;
      ctx.fillStyle = '#ff6600';
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx - hl * Math.cos(angle - 0.5), gy - hl * Math.sin(angle - 0.5));
      ctx.lineTo(gx - hl * Math.cos(angle + 0.5), gy - hl * Math.sin(angle + 0.5));
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#333';
      ctx.font = '12px sans-serif';
      ctx.fillText(
        `∇f(${x0.toFixed(1)},${y0.toFixed(1)}) = (${gradX.toFixed(1)}, ${gradY.toFixed(1)})`,
        10, h - 10
      );
      ctx.fillText('等高线 + 梯度（指向最陡上升方向）', 10, h - 25);
    },
    [x0, y0]
  );

  return (
    <div className="visual-wrapper">
      <div className="visual-canvas">
        <MathCanvas width={550} height={400} draw={draw} />
      </div>
      <div className="visual-controls">
        <ControlPanel
          sliders={[
            { label: 'x₀', min: -1.8, max: 1.8, step: 0.05, value: x0, onChange: setX0 },
            { label: 'y₀', min: -1.8, max: 1.8, step: 0.05, value: y0, onChange: setY0 },
          ]}
        />
      </div>
    </div>
  );
}
