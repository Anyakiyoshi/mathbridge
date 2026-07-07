import { useState, useCallback } from 'react';
import MathCanvas, { createCoordTransform, drawAxes } from '../../components/MathCanvas';
import ControlPanel from '../../components/ControlPanel';

export function FTCViz() {
  const [x, setX] = useState(2.0);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _coord: ReturnType<typeof createCoordTransform>, w: number, h: number) => {
      const tMin = -1, tMax = 3.5, yMin = -2, yMax = 8;
      const c = createCoordTransform(w, h, tMin, tMax, yMin, yMax, 40);
      drawAxes(ctx, c, w, h, tMin, tMax, yMin, yMax, 1);

      const f = (t: number) => 1 + t;
      // F(x) = ∫₀ˣ f(t)dt = x + x²/2
      const exactArea = x + x * x / 2;

      // f(t) curve
      ctx.save();
      ctx.strokeStyle = '#e67e22';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 300; i++) {
        const t = tMin + (tMax - tMin) * i / 300;
        const [px, py] = c.toPixel(t, f(t));
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.fillStyle = '#e67e22';
      ctx.fillText('f(t) = 1 + t', 10, 20);
      ctx.restore();

      // Shaded area from 0 to x
      ctx.save();
      ctx.fillStyle = 'rgba(26, 115, 232, 0.2)';
      const [vx, vy1] = c.toPixel(x, 0);
      const [vx2, vy2] = c.toPixel(x, f(x));
      // Fill area under curve
      ctx.beginPath();
      const [px0, py0] = c.toPixel(0, f(0));
      ctx.moveTo(px0, py0);
      for (let i = 0; i <= 100; i++) {
        const t = 0 + x * i / 100;
        const [px, py] = c.toPixel(t, f(t));
        ctx.lineTo(px, py);
      }
      ctx.lineTo(vx, vy1);
      ctx.closePath();
      ctx.fill();

      // Vertical line at x
      ctx.strokeStyle = '#1a73e8';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(vx, vy1); ctx.lineTo(vx2, vy2); ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      ctx.fillStyle = '#1a73e8';
      ctx.font = '13px sans-serif';
      ctx.fillText(`A(x) = ∫₀ˣ f(t)dt = ${exactArea.toFixed(2)}`, 10, h - 20);
      ctx.fillText(`FTC: d/dx A(x) = f(x) = ${f(x).toFixed(1)}`, 10, h - 40);
    },
    [x]
  );

  return (
    <div className="visual-wrapper">
      <div className="visual-canvas">
        <MathCanvas width={650} height={380} draw={draw} />
      </div>
      <div className="visual-controls">
        <ControlPanel
          title="移动 x"
          sliders={[{ label: 'x', min: 0.1, max: 3, step: 0.05, value: x, onChange: setX }]}
        />
      </div>
    </div>
  );
}
