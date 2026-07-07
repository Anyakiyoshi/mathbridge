import { useState, useCallback } from 'react';
import MathCanvas, { createCoordTransform, drawAxes } from '../../components/MathCanvas';
import ControlPanel from '../../components/ControlPanel';

export function LimitLawsViz() {
  const [showSqueeze, setShowSqueeze] = useState(true);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _coord: ReturnType<typeof createCoordTransform>, w: number, h: number) => {
      const xMin = -0.5, xMax = 0.5, yMin = -0.2, yMax = 1.2;
      const c = createCoordTransform(w, h, xMin, xMax, yMin, yMax, 40);
      drawAxes(ctx, c, w, h, xMin, xMax, yMin, yMax, 0.1);

      // f(x) = sin(x)/x
      ctx.save();
      ctx.strokeStyle = '#d93025';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      const steps = 400;
      for (let i = 0; i <= steps; i++) {
        const x = xMin + (xMax - xMin) * i / steps;
        const y = x === 0 ? 1 : Math.sin(x) / x;
        const [px, py] = c.toPixel(x, y);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.fillStyle = '#d93025';
      ctx.font = '12px sans-serif';
      ctx.fillText('f(x)=sin(x)/x', 10, 20);
      ctx.restore();

      if (showSqueeze) {
        // g(x) = cos(x) — lower bound
        ctx.save();
        ctx.strokeStyle = '#1a73e8';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 3]);
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const x = xMin + (xMax - xMin) * i / steps;
          const [px, py] = c.toPixel(x, Math.cos(x));
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#1a73e8';
        ctx.fillText('g(x)=cos(x) (下界)', 10, 40);
        ctx.restore();

        // h(x) = 1 — upper bound
        ctx.save();
        ctx.strokeStyle = '#2ecc71';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 3]);
        const [h1x, h1y] = c.toPixel(xMin, 1);
        const [h2x, h2y] = c.toPixel(xMax, 1);
        ctx.beginPath(); ctx.moveTo(h1x, h1y); ctx.lineTo(h2x, h2y); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#2ecc71';
        ctx.fillText('h(x)=1 (上界)', 10, 60);
        ctx.restore();
      }

      // Mark the limit point (0, 1)
      const [px0, py0] = c.toPixel(0, 1);
      ctx.save();
      ctx.fillStyle = '#9b59b6';
      ctx.beginPath();
      ctx.arc(px0, py0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#9b59b6';
      ctx.font = '12px sans-serif';
      ctx.fillText('lim = 1', px0 + 8, py0 - 6);
      ctx.restore();
    },
    [showSqueeze]
  );

  return (
    <div className="visual-wrapper">
      <div className="visual-canvas">
        <MathCanvas width={650} height={380} draw={draw} />
      </div>
      <div className="visual-controls">
        <ControlPanel
          title="夹逼准则"
          buttons={[{
            label: showSqueeze ? '✓ 显示夹逼函数' : '显示夹逼函数',
            active: showSqueeze,
            onClick: () => setShowSqueeze(!showSqueeze),
          }]}
        />
      </div>
    </div>
  );
}
