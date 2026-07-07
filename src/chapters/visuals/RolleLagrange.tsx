import { useState, useCallback } from 'react';
import MathCanvas, { createCoordTransform, drawAxes } from '../../components/MathCanvas';
import ControlPanel from '../../components/ControlPanel';

export function RolleLagrangeViz() {
  const [a, setA] = useState(-1.5);
  const [b, setB] = useState(2.0);

  const f = (x: number) => (x - a) * (x - b) + 1;
  const fp = (x: number) => 2 * x - a - b; // derivative of (x-a)(x-b)+1 is 2x-a-b
  // Rolle: find ξ where f'(ξ) = 0
  const xi = (a + b) / 2;

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _coord: ReturnType<typeof createCoordTransform>, w: number, h: number) => {
      const xMin = a - 1, xMax = b + 1, yMin = -2, yMax = Math.max(3, f(xi) + 1);
      const c = createCoordTransform(w, h, xMin, xMax, yMin, yMax, 40);
      drawAxes(ctx, c, w, h, xMin, xMax, yMin, yMax, 1);

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

      // Endpoints
      const [ax, ay] = c.toPixel(a, f(a));
      const [bx, by] = c.toPixel(b, f(b));
      ctx.fillStyle = '#d93025';
      [ax, bx].forEach((px, i) => {
        ctx.beginPath();
        ctx.arc(px, i === 0 ? ay : by, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Secant line (a,f(a)) to (b,f(b))
      ctx.save();
      ctx.strokeStyle = '#e67e22';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 3]);
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
      ctx.setLineDash([]);
      const slope = (f(b) - f(a)) / (b - a);
      ctx.fillStyle = '#e67e22';
      ctx.font = '11px sans-serif';
      ctx.fillText(`割线斜率 = ${slope.toFixed(2)}`, (ax + bx) / 2 - 30, (ay + by) / 2 - 10);
      ctx.restore();

      // Tangent at ξ (parallel to secant by MVT)
      const [tix, tiy] = c.toPixel(xi, f(xi));
      const tlSlope = fp(xi);
      const tlLen = 1.5;
      const [t1x, t1y] = c.toPixel(xi - tlLen, f(xi) - tlLen * tlSlope);
      const [t2x, t2y] = c.toPixel(xi + tlLen, f(xi) + tlLen * tlSlope);
      ctx.save();
      ctx.strokeStyle = '#1a73e8';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(t1x, t1y); ctx.lineTo(t2x, t2y); ctx.stroke();
      ctx.fillStyle = '#1a73e8';
      ctx.beginPath();
      ctx.arc(tix, tiy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText(`ξ = ${xi.toFixed(2)}', slope = ${tlSlope.toFixed(2)}`, tix + 8, tiy - 8);
      ctx.restore();

      // Rolle check
      if (Math.abs(f(a) - f(b)) < 0.05) {
        ctx.fillStyle = '#2ecc71';
        ctx.font = '13px sans-serif';
        ctx.fillText('✓ f(a)=f(b) → Rolle 定理: ∃ξ 使 f\'(ξ)=0', 10, h - 15);
      }
    },
    [a, b, f, fp, xi]
  );

  return (
    <div className="visual-wrapper">
      <div className="visual-canvas">
        <MathCanvas width={650} height={380} draw={draw} />
      </div>
      <div className="visual-controls">
        <ControlPanel
          title="区间端点"
          sliders={[
            { label: 'a', min: -2.5, max: 1, step: 0.05, value: a, onChange: setA },
            { label: 'b', min: 0.5, max: 3, step: 0.05, value: b, onChange: setB },
          ]}
        />
      </div>
    </div>
  );
}
