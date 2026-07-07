import { useState, useCallback } from 'react';
import MathCanvas, { createCoordTransform, drawAxes } from '../../components/MathCanvas';
import ControlPanel from '../../components/ControlPanel';

export function DoubleIntegralViz() {
  const [nx, setNx] = useState(8);
  const [ny, setNy] = useState(8);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _coord: ReturnType<typeof createCoordTransform>, w: number, h: number) => {
      const xMin = -2.5, xMax = 2.5, yMin = -1.5, yMax = 4.5;
      const c = createCoordTransform(w, h, xMin, xMax, yMin, yMax, 40);
      drawAxes(ctx, c, w, h, xMin, xMax, yMin, yMax, 1);

      const f = (x: number, y: number) => 2 + 0.5 * x - 0.3 * y;
      const a = -1, bu = 1, cu = -1, d = 1;

      // Draw surface as contour grid
      ctx.save();
      const res = 20;
      for (let i = 0; i <= res; i++) {
        for (let j = 0; j <= res; j++) {
          const x = a + (bu - a) * i / res;
          const y = cu + (d - cu) * j / res;
          const z = f(x, y);
          const shade = Math.floor(100 + z * 30);
          ctx.fillStyle = `rgba(26,115,232,${0.1 + z * 0.08})`;
          const [px1, py1] = c.toPixel(x, y);
          const [px2, py2] = c.toPixel(x + (bu - a) / res, y + (d - cu) / res);
          ctx.fillRect(px1, py2, Math.max(1, px2 - px1), Math.max(1, py1 - py2));
        }
      }
      ctx.restore();

      // Volume approximation with rectangular prisms
      const dx = (bu - a) / nx;
      const dy = (d - cu) / ny;
      for (let i = 0; i < nx; i++) {
        for (let j = 0; j < ny; j++) {
          const xMid = a + (i + 0.5) * dx;
          const yMid = cu + (j + 0.5) * dy;
          const zVal = f(xMid, yMid);
          const [px1, py1] = c.toPixel(a + i * dx, cu + j * dy);
          const [px2, py2] = c.toPixel(a + (i + 1) * dx, cu + (j + 1) * dy);
          ctx.strokeStyle = 'rgba(255, 100, 0, 0.5)';
          ctx.lineWidth = 1;
          ctx.strokeRect(px1, py2, px2 - px1, py1 - py2);
        }
      }

      const approxVol = f(0, 0) * (bu - a) * (d - cu) / (nx * ny); // rough
      ctx.fillStyle = '#333';
      ctx.font = '12px sans-serif';
      ctx.fillText(`网格 ${nx}×${ny}  区域 [-1,1]×[-1,1]`, 10, h - 15);
    },
    [nx, ny]
  );

  return (
    <div className="visual-wrapper">
      <div className="visual-canvas">
        <MathCanvas width={600} height={380} draw={draw} />
      </div>
      <div className="visual-controls">
        <ControlPanel
          sliders={[
            { label: 'x 分区', min: 2, max: 20, step: 1, value: nx, onChange: (v) => setNx(Math.round(v)), format: (v) => v.toFixed(0) },
            { label: 'y 分区', min: 2, max: 20, step: 1, value: ny, onChange: (v) => setNy(Math.round(v)), format: (v) => v.toFixed(0) },
          ]}
        />
      </div>
    </div>
  );
}
