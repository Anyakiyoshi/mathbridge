import { useState, useCallback } from 'react';
import MathCanvas, { createCoordTransform, drawAxes } from '../../components/MathCanvas';
import ControlPanel from '../../components/ControlPanel';
import Formula from '../../components/Formula';
import { numericalDerivative, numericalGradient } from '../../utils/calculus';

// Simple 2D function examples
const FUNC_1D_OPTIONS = [
  { value: 'x2', label: 'f(x) = x²' },
  { value: 'x3', label: 'f(x) = x³' },
  { value: 'sin', label: 'f(x) = sin(x)' },
  { value: 'exp', label: 'f(x) = eˣ' },
];

function f1d(name: string, x: number): number {
  switch (name) {
    case 'x2': return x * x;
    case 'x3': return x * x * x;
    case 'sin': return Math.sin(x);
    case 'exp': return Math.exp(x);
    default: return x * x;
  }
}

const FUNC_2D_OPTIONS = [
  { value: 'paraboloid', label: 'f(x,y) = x² + y²' },
  { value: 'saddle', label: 'f(x,y) = x² − y²' },
  { value: 'rosenbrock', label: 'f(x,y) = (1−x)² + 100(y−x²)²' },
];

function f2d(name: string, x: number, y: number): number {
  switch (name) {
    case 'paraboloid': return x * x + y * y;
    case 'saddle': return x * x - y * y;
    case 'rosenbrock': return (1 - x) ** 2 + 100 * (y - x * x) ** 2;
    default: return x * x + y * y;
  }
}

type SubView = '1d' | '2d-1d' | '2d-2d';

export default function DerivativeLinearMap() {
  const [subView, setSubView] = useState<SubView>('1d');
  const [func1dName, setFunc1dName] = useState('x2');
  const [x0, setX0] = useState(1.0);
  const [delta, setDelta] = useState(0.8);
  const [func2dName, setFunc2dName] = useState('paraboloid');
  const [xy0, setXy0] = useState<[number, number]>([1.0, 0.5]);
  const [dxy] = useState<[number, number]>([0.4, 0.3]);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _coord: ReturnType<typeof createCoordTransform>, w: number, h: number) => {
      const pad = 50;
      if (subView === '1d') {
        const xMin = -3, xMax = 3, yMin = -2, yMax = 6;
        const c = createCoordTransform(w, h, xMin, xMax, yMin, yMax, pad);
        drawAxes(ctx, c, w, h, xMin, xMax, yMin, yMax, 1);

        // Draw f(x)
        ctx.save();
        ctx.strokeStyle = '#555';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i <= 500; i++) {
          const x = xMin + (xMax - xMin) * i / 500;
          const y = f1d(func1dName, x);
          if (!isFinite(y)) continue;
          const [px, py] = c.toPixel(x, y);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.restore();

        const f0 = f1d(func1dName, x0);
        const df = numericalDerivative((x) => f1d(func1dName, x), x0);

        // Tangent line
        const [p0x, p0y] = c.toPixel(x0, f0);
        const [tx1, ty1] = c.toPixel(xMin, f0 + df * (xMin - x0));
        const [tx2, ty2] = c.toPixel(xMax, f0 + df * (xMax - x0));
        ctx.save();
        ctx.strokeStyle = '#1a73e8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(tx1, ty1);
        ctx.lineTo(tx2, ty2);
        ctx.stroke();

        // Δx → Δy arrows
        const x1 = x0 + delta;
        const approx_y = f0 + df * delta;

        // Horizontal arrow Δx on x-axis
        const [dx_sx, dx_sy] = c.toPixel(x0, 0);
        const [dx_ex, dx_ey] = c.toPixel(x1, 0);
        drawArrow(ctx, dx_sx, dx_sy, dx_ex, dx_ey, '#e67e22', 'Δx');

        // Δy tangent
        const [dy_sx, dy_sy] = c.toPixel(x1, f0);
        const [dy_ex, dy_ey] = c.toPixel(x1, approx_y);
        drawArrow(ctx, dy_sx, dy_sy, dy_ex, dy_ey, '#1a73e8', 'f\'(x₀)·Δx');

        // Point marker
        ctx.fillStyle = '#d93025';
        ctx.beginPath();
        ctx.arc(p0x, p0y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.stroke();

        ctx.fillStyle = '#d93025';
        ctx.font = '12px sans-serif';
        ctx.fillText(`x₀=${x0.toFixed(1)}`, p0x + 8, p0y - 8);

        // Matrix display: f'(x₀) = [df]  (1×1)
        ctx.fillStyle = '#1a73e8';
        ctx.font = '14px sans-serif';
        ctx.fillText(`f'(x₀) = [${df.toFixed(3)}]`, 10, h - 15);
        ctx.fillText('(1×1 线性变换)', 10, h - 35);
        ctx.restore();
      } else if (subView === '2d-2d') {
        // Vector field Jacobian
        const xMin = -2, xMax = 2, yMin = -2, yMax = 2;
        const c = createCoordTransform(w, h, xMin, xMax, yMin, yMax, pad);
        drawAxes(ctx, c, w, h, xMin, xMax, yMin, yMax, 0.5);

        // Draw vector field as small arrows
        const step = 0.4;
        ctx.save();
        for (let x = xMin; x <= xMax; x += step) {
          for (let y = yMin; y <= yMax; y += step) {
            void f2d(func2dName, x, y);
            const [dfx, dfy] = numericalGradient((a, b) => f2d(func2dName, a, b), x, y);
            const mag = Math.hypot(dfx, dfy);
            if (mag < 0.01) continue;
            const scale = 0.12 / mag;
            const [sx, sy] = c.toPixel(x, y);
            const [ex, ey] = c.toPixel(x + dfx * scale, y + dfy * scale);
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(ex, ey);
            ctx.strokeStyle = '#ff6600';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // At the selected point, show the local linear approximation
        const [gx, gy] = numericalGradient((a, b) => f2d(func2dName, a, b), xy0[0], xy0[1]);
        const [px0, py0] = c.toPixel(xy0[0], xy0[1]);

        // Circle neighborhood → ellipse under Jacobian
        const radius = 0.3;
        // For 2D→2D, we'd need a proper vector field; let's draw a few rays
        ctx.strokeStyle = 'rgba(26, 115, 232, 0.5)';
        ctx.lineWidth = 1;
        for (let angle = 0; angle < 2 * Math.PI; angle += Math.PI / 6) {
          const dx = radius * Math.cos(angle);
          const dy = radius * Math.sin(angle);
          const [sx, sy] = c.toPixel(xy0[0] + dx, xy0[1] + dy);
          const [ex, ey] = c.toPixel(xy0[0] + dx + gx * dx + gy * dy, xy0[1] + dy);
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
          ctx.stroke();
        }

        // Point marker
        ctx.fillStyle = '#d93025';
        ctx.beginPath();
        ctx.arc(px0, py0, 5, 0, 2 * Math.PI);
        ctx.fill();

        // Jacobian as matrix display
        ctx.fillStyle = '#1a73e8';
        ctx.font = '13px sans-serif';
        ctx.fillText(`J = ∇f = [${gx.toFixed(2)}, ${gy.toFixed(2)}]  (1×2 矩阵)`, 10, h - 15);
        ctx.restore();
      }
    },
    [subView, func1dName, x0, delta, func2dName, xy0, dxy]
  );

  return (
    <div className="module-container">
      <div className="module-canvas-area">
        <MathCanvas width={700} height={500} xMin={-3} xMax={3} yMin={-2} yMax={6} draw={draw} />
      </div>
      <div className="module-sidebar">
        <ControlPanel
          title="视图选择"
          buttons={[
            { label: '1D → 1D', active: subView === '1d', onClick: () => setSubView('1d') },
            { label: '2D → 1D (梯度)', active: subView === '2d-1d', onClick: () => setSubView('2d-1d') },
            { label: '2D → 2D (向量场)', active: subView === '2d-2d', onClick: () => setSubView('2d-2d') },
          ]}
        />

        {subView === '1d' && (
          <ControlPanel
            title="1D 参数"
            selects={[{
              label: '函数',
              value: func1dName,
              options: FUNC_1D_OPTIONS,
              onChange: setFunc1dName,
            }]}
            sliders={[
              { label: 'x₀', min: -2.5, max: 2.5, step: 0.05, value: x0, onChange: setX0 },
              { label: 'Δx', min: 0.05, max: 1.5, step: 0.05, value: delta, onChange: setDelta },
            ]}
          />
        )}
        {subView === '2d-1d' && (
          <ControlPanel
            title="2D → 1D 参数"
            selects={[{
              label: '二元函数',
              value: func2dName,
              options: FUNC_2D_OPTIONS,
              onChange: setFunc2dName,
            }]}
            sliders={[
              { label: 'x₀', min: -2, max: 2, step: 0.05, value: xy0[0], onChange: (v) => setXy0([v, xy0[1]]) },
              { label: 'y₀', min: -2, max: 2, step: 0.05, value: xy0[1], onChange: (v) => setXy0([xy0[0], v]) },
            ]}
          />
        )}
        {subView === '2d-2d' && (
          <ControlPanel
            title="向量场（梯度场）参数"
            selects={[{
              label: '函数',
              value: func2dName,
              options: FUNC_2D_OPTIONS,
              onChange: setFunc2dName,
            }]}
            sliders={[
              { label: 'x₀', min: -1.5, max: 1.5, step: 0.05, value: xy0[0], onChange: (v) => setXy0([v, xy0[1]]) },
              { label: 'y₀', min: -1.5, max: 1.5, step: 0.05, value: xy0[1], onChange: (v) => setXy0([xy0[0], v]) },
            ]}
          />
        )}

        <div className="insight-box highlight">
          <h4>💡 核心洞察</h4>
          <p>
            <strong>导数就是一个线性变换！</strong><br />
            1D: <Formula latex="f'(x_0)" /> 是 1×1 矩阵<br />
            2D→1D: <Formula latex="\\nabla f = [\\partial f/\\partial x, \\partial f/\\partial y]" /> 是 1×2 矩阵<br />
            2D→2D: Jacobian 是 2×2 矩阵
          </p>
          <p>
            这条线直通模块 C 的 2×2 线性变换可视化 →{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); /* navigate */ }}>
              去看看
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number, fromY: number,
  toX: number, toY: number,
  color: string,
  label?: string
) {
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const headLen = 8;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
  // Arrowhead
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
  if (label) {
    ctx.font = '11px sans-serif';
    ctx.fillText(label, (fromX + toX) / 2 + 4, (fromY + toY) / 2 - 6);
  }
  ctx.restore();
}
