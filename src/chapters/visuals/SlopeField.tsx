import { useState, useCallback } from 'react';
import MathCanvas, { createCoordTransform } from '../../components/MathCanvas';
import ControlPanel from '../../components/ControlPanel';

export function SlopeFieldViz() {
  const [eqType, setEqType] = useState('xy');

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _coord: ReturnType<typeof createCoordTransform>, w: number, h: number) => {
      const xMin = -3, xMax = 3, yMin = -3, yMax = 3;
      const c = createCoordTransform(w, h, xMin, xMax, yMin, yMax, 20);

      // Draw slope field
      const step = 0.5;
      ctx.save();
      const f = (x: number, y: number): number => {
        switch (eqType) {
          case 'xy': return x - y;
          case 'harmonic': return -x / (y || 0.001);
          case 'exp': return y;
          default: return x - y;
        }
      };

      for (let x = xMin; x <= xMax; x += step) {
        for (let y = yMin; y <= yMax; y += step) {
          const slope = f(x, y);
          const angle = Math.atan(slope);
          const len = 7;
          const [cx, cy] = c.toPixel(x, y);
          const dx = len * Math.cos(angle);
          const dy = -len * Math.sin(angle); // y-flip

          ctx.strokeStyle = 'rgba(100, 100, 100, 0.5)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx - dx / 2, cy - dy / 2);
          ctx.lineTo(cx + dx / 2, cy + dy / 2);
          ctx.stroke();
        }
      }

      // Draw a few solution curves
      const solve = (x0: number, y0: number, steps: number, dt: number) => {
        ctx.strokeStyle = '#1a73e8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        let x = x0, y = y0;
        const [sx, sy] = c.toPixel(x, y);
        ctx.moveTo(sx, sy);
        for (let i = 0; i < steps; i++) {
          x += dt;
          y += dt * f(x, y);
          const [px, py] = c.toPixel(x, y);
          ctx.lineTo(px, py);
        }
        ctx.stroke();
        // Backwards
        ctx.strokeStyle = '#e67e22';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        x = x0; y = y0;
        const [bx, by] = c.toPixel(x, y);
        ctx.moveTo(bx, by);
        for (let i = 0; i < steps; i++) {
          x -= dt;
          y -= dt * f(x, y);
          const [px, py] = c.toPixel(x, y);
          ctx.lineTo(px, py);
        }
        ctx.stroke();
      };

      const seeds = [[-2, 2], [0, 1], [2, -1], [-2, -2], [2, 2]];
      seeds.forEach(([sx, sy]) => solve(sx, sy, 80, 0.05));

      ctx.restore();

      ctx.fillStyle = '#1a73e8';
      ctx.font = '12px sans-serif';
      ctx.fillText(`dy/dx = ${eqType === 'xy' ? 'x − y' : eqType === 'harmonic' ? '−x/y' : 'y'}`, 10, h - 10);
    },
    [eqType]
  );

  return (
    <div className="visual-wrapper">
      <div className="visual-canvas">
        <MathCanvas width={600} height={450} draw={draw} />
      </div>
      <div className="visual-controls">
        <ControlPanel
          title="方程"
          selects={[{
            label: 'dy/dx =', value: eqType,
            options: [
              { value: 'xy', label: 'x − y' },
              { value: 'harmonic', label: '−x/y' },
              { value: 'exp', label: 'y (指数)' },
            ],
            onChange: setEqType,
          }]}
        />
      </div>
    </div>
  );
}
