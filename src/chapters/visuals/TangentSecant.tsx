import { useState, useCallback } from 'react';
import MathCanvas, { createCoordTransform, drawAxes } from '../../components/MathCanvas';
import ControlPanel from '../../components/ControlPanel';

export function TangentViz() {
  const [x0, setX0] = useState(1.0);
  const [delta, setDelta] = useState(0.6);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _coord: ReturnType<typeof createCoordTransform>, w: number, h: number) => {
      const xMin = -2, xMax = 3, yMin = -2, yMax = 8;
      const c = createCoordTransform(w, h, xMin, xMax, yMin, yMax, 40);
      drawAxes(ctx, c, w, h, xMin, xMax, yMin, yMax, 1);

      const f = (x: number) => x * x;
      const fp = (x: number) => 2 * x;

      // Draw f(x) = x²
      ctx.save();
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i <= 400; i++) {
        const x = xMin + (xMax - xMin) * i / 400;
        const [px, py] = c.toPixel(x, f(x));
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();

      const f0 = f(x0);
      const df = fp(x0);

      // Tangent line
      ctx.save();
      ctx.strokeStyle = '#1a73e8';
      ctx.lineWidth = 2;
      const [t1x, t1y] = c.toPixel(xMin, f0 + df * (xMin - x0));
      const [t2x, t2y] = c.toPixel(xMax, f0 + df * (xMax - x0));
      ctx.beginPath(); ctx.moveTo(t1x, t1y); ctx.lineTo(t2x, t2y); ctx.stroke();
      ctx.restore();

      // Secant line (x₀, f(x₀)) to (x₀+δ, f(x₀+δ))
      const x1 = x0 + delta;
      const f1 = f(x1);
      ctx.save();
      ctx.strokeStyle = '#e67e22';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 3]);
      const [s1x, s1y] = c.toPixel(x0, f0);
      const [s2x, s2y] = c.toPixel(x1, f1);
      ctx.beginPath(); ctx.moveTo(s1x, s1y); ctx.lineTo(s2x, s2y); ctx.stroke();
      ctx.setLineDash([]);
      const secSlope = (f1 - f0) / delta;
      ctx.fillStyle = '#e67e22';
      ctx.font = '11px sans-serif';
      ctx.fillText(`割线斜率 = ${secSlope.toFixed(2)}`, (s1x + s2x) / 2 + 4, (s1y + s2y) / 2 - 8);
      ctx.restore();

      // Points
      const [px0, py0] = c.toPixel(x0, f0);
      const [px1, py1] = c.toPixel(x1, f1);
      ctx.fillStyle = '#d93025';
      [px0, px1].forEach((px, i) => {
        ctx.beginPath();
        ctx.arc(px, i === 0 ? py0 : py1, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      ctx.fillStyle = '#1a73e8';
      ctx.font = '13px sans-serif';
      ctx.fillText(`切线斜率 f'(${x0.toFixed(1)}) = ${df.toFixed(1)}`, 10, h - 15);
      ctx.fillText(`当 ∆x → 0，割线 → 切线`, 10, h - 35);
    },
    [x0, delta]
  );

  return (
    <div className="visual-wrapper">
      <div className="visual-canvas">
        <MathCanvas width={650} height={400} draw={draw} />
      </div>
      <div className="visual-controls">
        <ControlPanel
          title="参数"
          sliders={[
            { label: 'x₀', min: -1, max: 2.5, step: 0.05, value: x0, onChange: setX0 },
            { label: '∆x', min: 0.05, max: 1.5, step: 0.05, value: delta, onChange: setDelta },
          ]}
        />
      </div>
    </div>
  );
}

// ChainRuleViz — composite function visualization
import { useCallback as uc2, useState as us2 } from 'react';

export function ChainRuleViz() {
  const [x, setX] = us2(1.0);

  const draw = uc2(
    (ctx: CanvasRenderingContext2D, _coord: ReturnType<typeof createCoordTransform>, w: number, h: number) => {
      // Three panels: x→g(x)→f(g(x))
      const thirdW = w / 3;
      const pad = 30;

      // Panel 1: g(x) = x²
      drawMiniPanel(ctx, 0, thirdW, h, -2, 2, 0, 4, pad, 'g(x)=x²', '#e67e22', (t) => t * t, x, x * x);

      // Panel 2: f(u) = sin(u)
      drawMiniPanel(ctx, thirdW, thirdW, h, 0, 4, -1.5, 1.5, pad, 'f(u)=sin(u)', '#2ecc71', Math.sin, x * x, Math.sin(x * x));

      // Panel 3: Composite f(g(x)) = sin(x²)
      drawMiniPanel(ctx, 2 * thirdW, thirdW, h, -2, 2, -1.5, 1.5, pad, 'sin(x²)', '#1a73e8', (t) => Math.sin(t * t), x, Math.sin(x * x));

      // Chain rule formula at bottom
      ctx.save();
      ctx.fillStyle = '#333';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(
        `链式法则: d/dx sin(x²) = cos(x²) · 2x = ${(Math.cos(x*x)*2*x).toFixed(3)}`,
        w / 2, h - 10
      );
      ctx.restore();
    },
    [x]
  );

  return (
    <div className="visual-wrapper">
      <div className="visual-canvas">
        <MathCanvas width={700} height={350} draw={draw} />
      </div>
      <div className="visual-controls">
        <ControlPanel
          title="探索"
          sliders={[
            { label: 'x', min: 0.1, max: 2, step: 0.05, value: x, onChange: setX },
          ]}
        />
      </div>
    </div>
  );
}

function drawMiniPanel(
  ctx: CanvasRenderingContext2D,
  offsetX: number, panelW: number, panelH: number,
  xMin: number, xMax: number, yMin: number, yMax: number,
  pad: number, label: string, color: string,
  f: (x: number) => number, markX: number, markY: number
) {
  const c = createCoordTransform(panelW, panelH, xMin, xMax, yMin, yMax, pad);
  // Offset all drawing by offsetX
  ctx.save();
  ctx.translate(offsetX, 0);

  // Axes
  const [ox1, oy] = c.toPixel(xMin, 0);
  const [ox2] = c.toPixel(xMax, 0);
  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 0.5;
  ctx.beginPath(); ctx.moveTo(ox1, oy); ctx.lineTo(ox2, oy); ctx.stroke();
  const [ox, oy1] = c.toPixel(0, yMin);
  const [, oy2] = c.toPixel(0, yMax);
  ctx.beginPath(); ctx.moveTo(ox, oy1); ctx.lineTo(ox, oy2); ctx.stroke();

  // Curve
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i <= 200; i++) {
    const t = xMin + (xMax - xMin) * i / 200;
    const y = f(t);
    if (!isFinite(y)) continue;
    const [px, py] = c.toPixel(t, y);
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.stroke();

  // Mark point
  const [mx, my] = c.toPixel(markX, markY);
  ctx.fillStyle = '#d93025';
  ctx.beginPath();
  ctx.arc(mx, my, 4, 0, Math.PI * 2);
  ctx.fill();

  // Label
  ctx.fillStyle = color;
  ctx.font = '11px sans-serif';
  ctx.fillText(label, 5, 15);

  ctx.restore();
}

// HigherDerivViz — Reuses the Taylor series visual approach
export function HigherDerivViz() {
  const [degree, setDegree] = useState(5);
  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _coord: ReturnType<typeof createCoordTransform>, w: number, h: number) => {
      const xMin = -Math.PI * 1.2, xMax = Math.PI * 1.2, yMin = -1.6, yMax = 1.6;
      const c = createCoordTransform(w, h, xMin, xMax, yMin, yMax, 40);
      drawAxes(ctx, c, w, h, xMin, xMax, yMin, yMax, 1);

      // sin(x) — dashed
      ctx.save();
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      for (let i = 0; i <= 400; i++) {
        const x = xMin + (xMax - xMin) * i / 400;
        const [px, py] = c.toPixel(x, Math.sin(x));
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#999';
      ctx.font = '12px sans-serif';
      ctx.fillText('sin(x)', 10, 20);
      ctx.restore();

      // Taylor polynomial
      ctx.save();
      ctx.strokeStyle = '#1a73e8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i <= 400; i++) {
        const x = xMin + (xMax - xMin) * i / 400;
        let y = 0;
        for (let k = 0; k <= degree; k++) {
          if (k % 2 === 1) {
            const sign = (k % 4 === 1) ? 1 : -1;
            let fact = 1;
            for (let j = 2; j <= k; j++) fact *= j;
            y += sign * Math.pow(x, k) / fact;
          }
        }
        const [px, py] = c.toPixel(x, y);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.fillStyle = '#1a73e8';
      ctx.fillText(`P${degree}(x)`, 10, 40);
      ctx.restore();

      ctx.fillStyle = '#333';
      ctx.font = '12px sans-serif';
      ctx.fillText(
        `泰勒: 高阶导数决定多项式系数。P_n(x) = 函数在基{1,x,x²,...}下的坐标`,
        10, h - 15
      );
    },
    [degree]
  );

  return (
    <div className="visual-wrapper">
      <div className="visual-canvas">
        <MathCanvas width={650} height={380} draw={draw} />
      </div>
      <div className="visual-controls">
        <ControlPanel
          title="泰勒阶数"
          sliders={[{ label: 'n', min: 1, max: 11, step: 2, value: degree, onChange: setDegree, format: (v) => v.toFixed(0) }]}
        />
      </div>
    </div>
  );
}
