import { useState, useCallback } from 'react';
import MathCanvas, { createCoordTransform, drawAxes } from '../../components/MathCanvas';
import ControlPanel from '../../components/ControlPanel';

export function EpsilonDeltaViz() {
  const [eps, setEps] = useState(0.5);
  const [x0, setX0] = useState(1.0);
  const L = 3 * x0 - 1; // f(x) = 3x - 1
  const delta = eps / 3;

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _coord: ReturnType<typeof createCoordTransform>, w: number, h: number) => {
      const xMin = -1, xMax = 3, yMin = -2, yMax = 7;
      const c = createCoordTransform(w, h, xMin, xMax, yMin, yMax, 40);
      drawAxes(ctx, c, w, h, xMin, xMax, yMin, yMax, 1);

      // Draw f(x) = 3x - 1
      ctx.save();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 200; i++) {
        const x = xMin + (xMax - xMin) * i / 200;
        const y = 3 * x - 1;
        const [px, py] = c.toPixel(x, y);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();

      // ε band (horizontal) — f(x) must stay inside
      const [lx1, ly1] = c.toPixel(xMin, L - eps);
      const [lx2, ly2] = c.toPixel(xMax, L - eps);
      const [ux1, uy1] = c.toPixel(xMin, L + eps);
      const [ux2, uy2] = c.toPixel(xMax, L + eps);

      ctx.save();
      ctx.fillStyle = 'rgba(26, 115, 232, 0.12)';
      ctx.fillRect(lx1, uy1, lx2 - lx1, ly1 - uy1); // note: pixel y inverted
      // Correct fill (need to account for y-flip):
      ctx.clearRect(lx1, uy1, lx2 - lx1, ly1 - uy1);
      // Actually let's just draw lines for the band
      ctx.strokeStyle = 'rgba(26, 115, 232, 0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(lx1, ly1); ctx.lineTo(lx2, ly2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ux1, uy1); ctx.lineTo(ux2, uy2); ctx.stroke();
      ctx.setLineDash([]);

      // Label ε band
      ctx.fillStyle = '#1a73e8';
      ctx.font = '12px sans-serif';
      ctx.fillText(`L + ε`, ux2 + 2, uy2 - 4);
      ctx.fillText(`L − ε`, lx2 + 2, ly1 + 12);
      ctx.fillText(`ε = ${eps.toFixed(2)}`, 10, 20);

      // δ band (vertical) — x must stay inside
      const [dx1, dy1] = c.toPixel(x0 - delta, yMin);
      const [dx2, dy2] = c.toPixel(x0 - delta, yMax);
      const [dx3, dy3] = c.toPixel(x0 + delta, yMin);
      const [dx4, dy4] = c.toPixel(x0 + delta, yMax);

      ctx.strokeStyle = 'rgba(214, 73, 16, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(dx1, dy1); ctx.lineTo(dx2, dy2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(dx3, dy3); ctx.lineTo(dx4, dy4); ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#e67e22';
      ctx.fillText(`x₀−δ`, dx1 - 30, h - 20);
      ctx.fillText(`x₀+δ`, dx3 + 4, h - 20);
      ctx.fillText(`δ = ${delta.toFixed(3)}`, 10, 40);

      // Point (x₀, f(x₀))
      const [px0, py0] = c.toPixel(x0, L);
      ctx.fillStyle = '#d93025';
      ctx.beginPath();
      ctx.arc(px0, py0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Rectangular intersection zone
      ctx.save();
      ctx.fillStyle = 'rgba(180, 0, 0, 0.08)';
      ctx.strokeStyle = 'rgba(180, 0, 0, 0.3)';
      ctx.lineWidth = 1;
      // The rectangle where x-band and y-band overlap
      const rLeft = dx1, rRight = dx3, rTop = uy1, rBottom = ly1;
      ctx.fillRect(rLeft, rTop, rRight - rLeft, rBottom - rTop);
      ctx.strokeRect(rLeft, rTop, rRight - rLeft, rBottom - rTop);
      ctx.restore();

      ctx.fillStyle = '#d93025';
      ctx.font = '11px sans-serif';
      ctx.fillText(
        `f(x₀)=${L.toFixed(1)}   x₀=${x0.toFixed(1)}`,
        px0 + 8, py0 - 10
      );
    },
    [eps, x0, L, delta]
  );

  return (
    <div className="visual-wrapper">
      <div className="visual-canvas">
        <MathCanvas width={650} height={420} draw={draw} />
      </div>
      <div className="visual-controls">
        <ControlPanel
          title="ε-δ 参数控制"
          sliders={[
            { label: 'ε (误差容忍)', min: 0.05, max: 1.5, step: 0.01, value: eps, onChange: setEps },
            { label: 'x₀ (考察点)', min: -0.5, max: 2.5, step: 0.05, value: x0, onChange: setX0 },
          ]}
        />
      </div>
    </div>
  );
}
