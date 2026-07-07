import { useState, useCallback } from 'react';
import MathCanvas, { createCoordTransform, drawAxes } from '../../components/MathCanvas';
import ControlPanel from '../../components/ControlPanel';

export function AntiderivViz() {
  const [cVal, setCVal] = useState(2);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _coord: ReturnType<typeof createCoordTransform>, w: number, h: number) => {
      const xMin = -3, xMax = 3, yMin = -8, yMax = 12;
      const c = createCoordTransform(w, h, xMin, xMax, yMin, yMax, 30);
      drawAxes(ctx, c, w, h, xMin, xMax, yMin, yMax, 2);

      // f(x) = 2x (derivative)
      ctx.save();
      ctx.strokeStyle = '#e67e22';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 200; i++) {
        const x = xMin + (xMax - xMin) * i / 200;
        const [px, py] = c.toPixel(x, 2 * x);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.fillStyle = '#e67e22';
      ctx.font = '13px sans-serif';
      ctx.fillText('f(x) = 2x (导函数)', 10, 20);
      ctx.restore();

      // Family F(x) = x² + C
      const cs = [cVal, cVal + 3, cVal - 2, cVal - 4];
      const colors = ['#1a73e8', '#2ecc71', '#9b59b6', '#e74c3c'];
      cs.forEach((c, idx) => {
        ctx.save();
        ctx.strokeStyle = colors[idx];
        ctx.lineWidth = idx === 0 ? 2.5 : 1;
        ctx.setLineDash(idx === 0 ? [] : [4, 3]);
        ctx.beginPath();
        for (let i = 0; i <= 400; i++) {
          const x = xMin + (xMax - xMin) * i / 400;
          const [px, py] = c.toPixel(x, x * x + c);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      });

      ctx.fillStyle = '#1a73e8';
      ctx.font = '13px sans-serif';
      ctx.fillText('F(x) = x² + C (原函数族)', 10, h - 20);
      ctx.fillText('所有曲线斜率处处相同 (平移)', 10, h - 40);
    },
    [cVal]
  );

  return (
    <div className="visual-wrapper">
      <div className="visual-canvas">
        <MathCanvas width={650} height={380} draw={draw} />
      </div>
      <div className="visual-controls">
        <ControlPanel
          title="常数 C"
          sliders={[{ label: 'C', min: -6, max: 6, step: 0.5, value: cVal, onChange: setCVal }]}
        />
      </div>
    </div>
  );
}

export function IntegrationViz() {
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _coord: ReturnType<typeof createCoordTransform>, w: number, h: number) => {
      const xMin = -1, xMax = 3, yMin = -2, yMax = 10;
      const c = createCoordTransform(w, h, xMin, xMax, yMin, yMax, 40);
      drawAxes(ctx, c, w, h, xMin, xMax, yMin, yMax, 1);

      // f(x) = x * e^x
      const f = (x: number) => x * Math.exp(x);
      const F = (x: number) => (x - 1) * Math.exp(x); // antiderivative

      ctx.save();
      ctx.strokeStyle = '#e67e22';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 400; i++) {
        const x = xMin + (xMax - xMin) * i / 400;
        const [px, py] = c.toPixel(x, f(x));
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.fillStyle = '#e67e22';
      ctx.fillText('f(x) = x·eˣ', 10, 20);
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = '#1a73e8';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      for (let i = 0; i <= 400; i++) {
        const x = xMin + (xMax - xMin) * i / 400;
        const [px, py] = c.toPixel(x, F(x));
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#1a73e8';
      ctx.fillText('F(x) = (x−1)eˣ (原函数)', 10, 40);
      ctx.restore();

      ctx.fillStyle = '#333';
      ctx.font = '12px sans-serif';
      ctx.fillText('分部积分: ∫x·eˣdx = x·eˣ − ∫eˣdx', 10, h - 15);
    },
    []
  );

  return (
    <div className="visual-wrapper">
      <div className="visual-canvas">
        <MathCanvas width={650} height={350} draw={draw} />
      </div>
    </div>
  );
}
