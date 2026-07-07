import { useState, useCallback } from 'react';
import MathCanvas, { createCoordTransform, drawAxes } from '../../components/MathCanvas';
import ControlPanel from '../../components/ControlPanel';

export function VolumeViz() {
  const [n, setN] = useState(10);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _coord: ReturnType<typeof createCoordTransform>, w: number, h: number) => {
      const xMin = -0.5, xMax = 2.5, yMin = -0.5, yMax = 3.5;
      const c = createCoordTransform(w, h, xMin, xMax, yMin, yMax, 50);
      drawAxes(ctx, c, w, h, xMin, xMax, yMin, yMax, 0.5);

      // f(x) = √x
      const f = (x: number) => Math.sqrt(x);
      const a = 0, b = 2;

      // Curve
      ctx.save();
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 400; i++) {
        const x = xMin + (xMax - xMin) * i / 400;
        if (x < 0) continue;
        const [px, py] = c.toPixel(x, f(x));
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();

      // Disk slices (projection on 2D — each slice is a rectangle representing a disk)
      const dx = (b - a) / n;
      for (let i = 0; i < n; i++) {
        const xMid = a + (i + 0.5) * dx;
        const r = f(xMid);
        // Draw as rectangle in 2D representing the disk cross-section
        const [dx1, dy1] = c.toPixel(a + i * dx, -r);
        const [dx2, dy2] = c.toPixel(a + (i + 1) * dx, r);
        ctx.fillStyle = 'rgba(26, 115, 232, 0.15)';
        ctx.strokeStyle = 'rgba(26, 115, 232, 0.5)';
        ctx.fillRect(dx1, dy2, dx2 - dx1, dy1 - dy2);
        ctx.strokeRect(dx1, dy2, dx2 - dx1, dy1 - dy2);
      }

      // Volume formula
      let vol = 0;
      for (let i = 0; i < n; i++) {
        const xMid = a + (i + 0.5) * dx;
        vol += Math.PI * f(xMid) * f(xMid) * dx;
      }
      const exactVol = Math.PI * b * b / 2; // ∫₀² πx dx = 2π
      ctx.fillStyle = '#1a73e8';
      ctx.font = '12px sans-serif';
      ctx.fillText(`圆盘法 n=${n} 近似V=${vol.toFixed(3)}  精确V=${exactVol.toFixed(3)}`, 10, h - 15);
      ctx.fillText('绕 x 轴旋转: V = π∫[f(x)]²dx', 10, h - 30);
    },
    [n]
  );

  return (
    <div className="visual-wrapper">
      <div className="visual-canvas">
        <MathCanvas width={650} height={380} draw={draw} />
      </div>
      <div className="visual-controls">
        <ControlPanel
          sliders={[{ label: '圆盘数 n', min: 2, max: 30, step: 1, value: n, onChange: (v) => setN(Math.round(v)), format: (v) => v.toFixed(0) }]}
        />
      </div>
    </div>
  );
}
