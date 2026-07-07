import { useState, useCallback, useMemo } from 'react';
import MathCanvas, { createCoordTransform, drawAxes } from '../../components/MathCanvas';
import ControlPanel from '../../components/ControlPanel';
import { numericalGradient } from '../../utils/calculus';

export function GradientDescentViz() {
  const [lr, setLr] = useState(0.15);
  const [x0, setX0] = useState(1.5);
  const [y0, setY0] = useState(1.2);
  const [iters, setIters] = useState(15);

  const f = (x: number, y: number) => x * x + 2 * y * y;

  const trajectory = useMemo(() => {
    const pts: [number, number][] = [];
    let x = x0, y = y0;
    for (let i = 0; i <= iters; i++) {
      pts.push([x, y]);
      const [gx, gy] = numericalGradient((a, b) => f(a, b), x, y);
      x -= lr * gx;
      y -= lr * gy;
      if (!isFinite(x) || !isFinite(y)) break;
    }
    return pts;
  }, [x0, y0, lr, iters]);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _coord: ReturnType<typeof createCoordTransform>, w: number, h: number) => {
      const xMin = -2, xMax = 2, yMin = -2, yMax = 2;
      const c = createCoordTransform(w, h, xMin, xMax, yMin, yMax, 40);
      drawAxes(ctx, c, w, h, xMin, xMax, yMin, yMax, 0.5);

      // Contour ellipses for f(x,y) = x² + 2y²
      ctx.save();
      for (let level = 0.5; level <= 8; level += 1) {
        ctx.strokeStyle = 'rgba(100, 100, 200, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const [cx, cy] = c.toPixel(0, 0);
        const rxPix = Math.sqrt(level) * c.scale;
        const ryPix = Math.sqrt(level / 2) * c.scale;
        ctx.ellipse(cx, cy, rxPix, ryPix, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      // Trajectory
      ctx.save();
      ctx.strokeStyle = '#ff4500';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      trajectory.forEach(([x, y], i) => {
        const [px, py] = c.toPixel(x, y);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.stroke();
      // Points
      trajectory.forEach(([x, y], i) => {
        const [px, py] = c.toPixel(x, y);
        ctx.fillStyle = i === 0 ? '#1a73e8' : '#ff4500';
        ctx.beginPath();
        ctx.arc(px, py, i === 0 ? 5 : 3, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      ctx.fillStyle = '#333';
      ctx.font = '12px sans-serif';
      ctx.fillText(`f(x,y)=x²+2y²  学习率α=${lr}  迭代${iters}次`, 10, h - 10);
    },
    [trajectory, lr, iters]
  );

  return (
    <div className="visual-wrapper">
      <div className="visual-canvas">
        <MathCanvas width={550} height={400} draw={draw} />
      </div>
      <div className="visual-controls">
        <ControlPanel
          sliders={[
            { label: '学习率 α', min: 0.02, max: 0.5, step: 0.01, value: lr, onChange: setLr },
            { label: '初始 x₀', min: -2, max: 2, step: 0.1, value: x0, onChange: setX0 },
            { label: '初始 y₀', min: -2, max: 2, step: 0.1, value: y0, onChange: setY0 },
            { label: '迭代次数', min: 3, max: 30, step: 1, value: iters, onChange: (v) => setIters(Math.round(v)), format: (v) => v.toFixed(0) },
          ]}
        />
      </div>
    </div>
  );
}
