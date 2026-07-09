import { useCallback } from 'react';
import MathCanvas, { createCoordTransform, drawAxes } from '../../components/MathCanvas';

export function SubstitutionViz() {
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _coord: ReturnType<typeof createCoordTransform>, w: number, h: number) => {
      const xMin = -2, xMax = 3, yMin = -3, yMax = 8;
      const c = createCoordTransform(w, h, xMin, xMax, yMin, yMax, 30);
      drawAxes(ctx, c, w, h, xMin, xMax, yMin, yMax, 1);

      // f(x) = 2x·cos(x²) — the integrand
      ctx.save();
      ctx.strokeStyle = '#e67e22';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 400; i++) {
        const x = xMin + (xMax - xMin) * i / 400;
        const y = 2 * x * Math.cos(x * x);
        const [px, py] = c.toPixel(x, y);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.fillStyle = '#e67e22';
      ctx.font = '13px sans-serif';
      ctx.fillText('被积函数 f(x)=2x·cos(x²)', 10, 20);
      ctx.restore();

      // F(x) = sin(x²) — the antiderivative
      ctx.save();
      ctx.strokeStyle = '#1a73e8';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      for (let i = 0; i <= 400; i++) {
        const x = xMin + (xMax - xMin) * i / 400;
        if (x < 0) continue;
        const y = Math.sin(x * x);
        const [px, py] = c.toPixel(x, y);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#1a73e8';
      ctx.fillText('原函数 F(x)=sin(x²)', 10, 40);
      ctx.restore();

      ctx.fillStyle = '#333';
      ctx.font = '12px sans-serif';
      ctx.fillText('换元: u=x², du=2x dx → ∫cos(u)du = sin(u)+C', 10, h - 15);
    },
    []
  );

  return (
    <div className="visual-wrapper">
      <div className="visual-canvas">
        <MathCanvas width={600} height={340} xMin={-2} xMax={3} yMin={-3} yMax={8} draw={draw} />
      </div>
    </div>
  );
}
