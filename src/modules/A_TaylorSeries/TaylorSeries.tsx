import { useState, useCallback, useMemo } from 'react';
import MathCanvas, { createCoordTransform, drawAxes } from '../../components/MathCanvas';
import ControlPanel from '../../components/ControlPanel';
import Formula from '../../components/Formula';
import type { FuncName } from '../../utils/calculus';
import {
  getTaylorCoeffs,
  evalTaylor,
  evalOriginal,
  originalDomain,
} from '../../utils/calculus';

const FUNC_OPTIONS = [
  { value: 'sin', label: 'f(x) = sin(x)' },
  { value: 'cos', label: 'f(x) = cos(x)' },
  { value: 'exp', label: 'f(x) = eˣ' },
  { value: 'ln1px', label: 'f(x) = ln(1+x)' },
  { value: 'arctan', label: 'f(x) = arctan(x)' },
];

const FUNC_COLORS: Record<string, string> = {
  sin: '#e74c3c',
  cos: '#2ecc71',
  exp: '#3498db',
  ln1px: '#9b59b6',
  arctan: '#e67e22',
};

export default function TaylorSeries() {
  const [funcName, setFuncName] = useState<FuncName>('sin');
  const [degree, setDegree] = useState(5);
  const [expandA, setExpandA] = useState(0);
  const funcColor = FUNC_COLORS[funcName] || '#e74c3c';

  const domain = useMemo(() => originalDomain(funcName), [funcName]);
  const [xMin, xMax] = domain;
  const yMin = -2.5;
  const yMax = 2.5;
  const padding = 60;

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _coord: ReturnType<typeof createCoordTransform>, w: number, h: number) => {
      const errorH = 120; // pixel height for error subplot

      // ---------- Top: Function + Taylor ----------
      const topH = h - errorH;
      const topCoord = createCoordTransform(w, topH, xMin, xMax, yMin, yMax, padding);

      drawAxes(ctx, topCoord, w, topH, xMin, xMax, yMin, yMax, 1);

      // Draw original function
      ctx.save();
      ctx.strokeStyle = funcColor;
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 3]);
      ctx.beginPath();
      const samples = 800;
      for (let i = 0; i <= samples; i++) {
        const x = xMin + (xMax - xMin) * i / samples;
        const y = evalOriginal(funcName, x);
        if (!isFinite(y)) continue;
        const [px, py] = topCoord.toPixel(x, y);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      // Get Taylor coefficients
      const coeffs = getTaylorCoeffs(funcName, degree);

      // Draw Taylor polynomial
      ctx.strokeStyle = '#1a73e8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      let firstPoint = true;
      for (let i = 0; i <= samples; i++) {
        const x = xMin + (xMax - xMin) * i / samples;
        const y = evalTaylor(x, expandA, coeffs);
        if (!isFinite(y)) { firstPoint = true; continue; }
        const [px, py] = topCoord.toPixel(x, y);
        if (firstPoint) { ctx.moveTo(px, py); firstPoint = false; }
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();

      // Expansion point marker
      const [axPx, axPy] = topCoord.toPixel(expandA, evalOriginal(funcName, expandA));
      ctx.save();
      ctx.fillStyle = '#1a73e8';
      ctx.beginPath();
      ctx.arc(axPx, axPy, 6, 0, 2 * Math.PI);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();

      // Legend
      ctx.save();
      ctx.font = '13px sans-serif';
      ctx.fillStyle = funcColor;
      ctx.fillText('f(x) (原函数)', 10, 20);
      ctx.fillStyle = '#1a73e8';
      ctx.fillText(`P${degree}(x) (泰勒)`, 10, 40);
      ctx.restore();

      // ---------- Bottom: Error plot ----------
      const errCoeffs = getTaylorCoeffs(funcName, degree);
      let errMax = 0;
      // Pre-scan error
      for (let i = 0; i <= 200; i++) {
        const x = xMin + (xMax - xMin) * i / 200;
        const actual = evalOriginal(funcName, x);
        const approx = evalTaylor(x, expandA, errCoeffs);
        if (!isFinite(actual) || !isFinite(approx)) continue;
        const err = Math.abs(actual - approx);
        if (err > errMax) errMax = err;
      }
      errMax = Math.max(errMax, 0.01);
      const errYMax = errMax * 1.2;
      const errYMin = -errYMax * 0.1;
      const errCoord = createCoordTransform(w, errorH, xMin, xMax, errYMin, errYMax, padding);
      // simplified axes for error plot
      const [eox1, eoy] = errCoord.toPixel(xMin, 0);
      const [eox2] = errCoord.toPixel(xMax, 0);
      ctx.save();
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(eox1, eoy); ctx.lineTo(eox2, eoy); ctx.stroke();
      // Fill area under error curve
      ctx.fillStyle = 'rgba(26, 115, 232, 0.15)';
      ctx.beginPath();
      const errSamples = 800;
      for (let i = 0; i <= errSamples; i++) {
        const x = xMin + (xMax - xMin) * i / errSamples;
        const actual = evalOriginal(funcName, x);
        const approx = evalTaylor(x, expandA, errCoeffs);
        const err = isFinite(actual) && isFinite(approx) ? Math.abs(actual - approx) : 0;
        const [px, py] = errCoord.toPixel(x, err);
        if (i === 0) ctx.moveTo(px, eoy);
        ctx.lineTo(px, py);
      }
      const [lastPx] = errCoord.toPixel(xMax, 0);
      ctx.lineTo(lastPx, eoy);
      ctx.closePath();
      ctx.fill();
      // Error curve
      ctx.strokeStyle = '#d93025';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i <= errSamples; i++) {
        const x = xMin + (xMax - xMin) * i / errSamples;
        const actual = evalOriginal(funcName, x);
        const approx = evalTaylor(x, expandA, errCoeffs);
        const err = isFinite(actual) && isFinite(approx) ? Math.abs(actual - approx) : 0;
        const [px, py] = errCoord.toPixel(x, err);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.fillStyle = '#d93025';
      ctx.font = '12px sans-serif';
      ctx.fillText(`|f(x) − P${degree}(x)|`, 10, h - errorH + 20);
      ctx.restore();
    },
    [funcName, degree, expandA, funcColor, xMin, xMax]
  );

  const coeffs = useMemo(() => getTaylorCoeffs(funcName, degree), [funcName, degree]);
  const coeffStr = useMemo(() => {
    const parts: string[] = [];
    for (let i = 0; i <= Math.min(degree, 6); i++) {
      if (Math.abs(coeffs[i]) < 1e-10) continue;
      const c = coeffs[i];
      const cStr = Math.abs(c) < 0.01 ? c.toExponential(2) : c.toFixed(4);
      parts.push(`${c > 0 && i > 0 ? '+ ' : i > 0 ? '− ' : ''}${i > 0 ? Math.abs(parseFloat(cStr)) : cStr}${i > 0 ? `(x${expandA ? `−${expandA}` : ''})${i > 1 ? `^{${i}}`: ''}` : ''}`);
    }
    return parts.join(' ') || '0';
  }, [coeffs, expandA]);

  return (
    <div className="module-container">
      <div className="module-canvas-area">
        <MathCanvas width={700} height={550} xMin={xMin} xMax={xMax} yMin={yMin} yMax={yMax} draw={draw} />
      </div>
      <div className="module-sidebar">
        <ControlPanel
          title="控制面板"
          selects={[{
            label: '函数',
            value: funcName,
            options: FUNC_OPTIONS,
            onChange: (v) => setFuncName(v as FuncName),
          }]}
          sliders={[
            {
              label: '展开阶数 n',
              min: 1,
              max: 12,
              step: 1,
              value: degree,
              onChange: setDegree,
              format: (v) => v.toFixed(0),
            },
            {
              label: '展开点 a',
              min: -3,
              max: 3,
              step: 0.1,
              value: expandA,
              onChange: setExpandA,
              format: (v) => v.toFixed(1),
            },
          ]}
        />

        <div className="insight-box">
          <h4>📐 多项式系数 = 基坐标</h4>
          <p className="insight-text">
            <Formula latex={`P_{${degree}}(x) = ${coeffStr}`} />
          </p>
          <p className="insight-text">
            系数向量 <Formula latex={`[c_0, c_1, \\ldots, c_{${Math.min(degree, 6)}}]`} />{' '}
            就是函数在基 <Formula latex={`\\{1, x, x^2, \\ldots\\}`} /> 下的坐标。
          </p>
        </div>

        <div className="insight-box highlight">
          <h4>💡 理解线代桥梁</h4>
          <p>
            泰勒展开本质上是<b>向量空间</b>中的坐标变换。
            每个多项式 <Formula latex="P_n(x)" /> 是基函数 <Formula latex="\{1, x, x^2, \dots\}" />{' '}
            的<b>线性组合</b> — 这正是线代的核心思想！
          </p>
        </div>
      </div>
    </div>
  );
}
