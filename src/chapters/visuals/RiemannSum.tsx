import { useState, useCallback } from 'react';
import MathCanvas, { createCoordTransform, drawAxes } from '../../components/MathCanvas';
import ControlPanel from '../../components/ControlPanel';

export function RiemannViz() {
  const [n, setN] = useState(6);
  const [method, setMethod] = useState<'left' | 'right' | 'mid'>('mid');

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _coord: ReturnType<typeof createCoordTransform>, w: number, h: number) => {
      const a = 0, b = 3;
      const xMin = -0.5, xMax = 3.5, yMin = -1, yMax = 8;
      const c = createCoordTransform(w, h, xMin, xMax, yMin, yMax, 40);
      drawAxes(ctx, c, w, h, xMin, xMax, yMin, yMax, 1);

      const f = (x: number) => 1 + x * x / 2;
      const F = (x: number) => x + x * x * x / 6;
      const exact = F(b) - F(a);
      const dx = (b - a) / n;

      // Curve
      ctx.save();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 400; i++) {
        const x = xMin + (xMax - xMin) * i / 400;
        const [px, py] = c.toPixel(x, f(x));
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();

      // Rectangles
      let approx = 0;
      for (let i = 0; i < n; i++) {
        const xLeft = a + i * dx;
        const xRight = xLeft + dx;
        let sampleX: number;
        if (method === 'left') sampleX = xLeft;
        else if (method === 'right') sampleX = xRight;
        else sampleX = (xLeft + xRight) / 2;

        const fVal = f(sampleX);
        approx += fVal * dx;

        const [rx, ry] = c.toPixel(xLeft, fVal);
        const [rx2, ry2] = c.toPixel(xRight, 0);
        ctx.fillStyle = 'rgba(26, 115, 232, 0.2)';
        ctx.strokeStyle = 'rgba(26, 115, 232, 0.6)';
        ctx.lineWidth = 1;
        ctx.fillRect(rx, ry, rx2 - rx, ry2 - ry);
        ctx.strokeRect(rx, ry, rx2 - rx, ry2 - ry);
      }

      ctx.fillStyle = '#1a73e8';
      ctx.font = '13px sans-serif';
      ctx.fillText(`n=${n}  近似 = ${approx.toFixed(3)}  精确 = ${exact.toFixed(3)}  误差 = ${Math.abs(approx - exact).toFixed(4)}`, 10, h - 15);
    },
    [n, method]
  );

  return (
    <div className="visual-wrapper">
      <div className="visual-canvas">
        <MathCanvas width={650} height={400} draw={draw} />
      </div>
      <div className="visual-controls">
        <ControlPanel
          title="黎曼和"
          sliders={[{ label: '分区数 n', min: 1, max: 40, step: 1, value: n, onChange: (v) => setN(Math.round(v)), format: (v) => v.toFixed(0) }]}
          selects={[{
            label: '采样方式', value: method,
            options: [{ value: 'left', label: '左端点' }, { value: 'right', label: '右端点' }, { value: 'mid', label: '中点' }],
            onChange: (v) => setMethod(v as 'left' | 'right' | 'mid'),
          }]}
        />
      </div>
    </div>
  );
}
