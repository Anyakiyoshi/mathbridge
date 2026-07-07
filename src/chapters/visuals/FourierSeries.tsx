import { useState, useCallback } from 'react';
import MathCanvas, { createCoordTransform, drawAxes } from '../../components/MathCanvas';
import ControlPanel from '../../components/ControlPanel';

export function FourierViz() {
  const [n, setN] = useState(5);
  const [waveType, setWaveType] = useState('square');

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _coord: ReturnType<typeof createCoordTransform>, w: number, h: number) => {
      const xMin = -Math.PI, xMax = Math.PI, yMin = -1.5, yMax = 1.5;
      const c = createCoordTransform(w, h, xMin, xMax, yMin, yMax, 40);
      drawAxes(ctx, c, w, h, xMin, xMax, yMin, yMax, 0.5);

      // Target function (dashed)
      ctx.save();
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([5, 3]);
      ctx.beginPath();
      for (let i = 0; i <= 400; i++) {
        const x = xMin + (xMax - xMin) * i / 400;
        const y = waveType === 'square'
          ? (x > 0 ? 1 : -1)
          : x; // sawtooth
        const [px, py] = c.toPixel(x, y);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#999';
      ctx.font = '12px sans-serif';
      ctx.fillText(waveType === 'square' ? '方波' : '锯齿波', 10, 20);
      ctx.restore();

      // Fourier approximation
      ctx.save();
      ctx.strokeStyle = '#1a73e8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let i = 0; i <= 500; i++) {
        const x = xMin + (xMax - xMin) * i / 500;
        let y = 0;
        if (waveType === 'square') {
          for (let k = 0; k < n; k++) {
            const m = 2 * k + 1;
            y += (4 / (Math.PI * m)) * Math.sin(m * x);
          }
        } else {
          // Sawtooth: -2/π Σ(−1)ⁿ/n sin(nx)
          for (let k = 1; k <= n; k++) {
            y += -(2 / (Math.PI * k)) * (k % 2 === 0 ? -1 : 1) * Math.sin(k * x);
          }
        }
        const [px, py] = c.toPixel(x, y);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.fillStyle = '#1a73e8';
      ctx.fillText(`Fourier: n=${n}项`, 10, 40);
      ctx.restore();

      // Basis functions in small
      ctx.fillStyle = '#666';
      ctx.font = '11px sans-serif';
      ctx.fillText('基函数: sin(x), sin(3x), sin(5x), ... (正交!)', 10, h - 15);
    },
    [n, waveType]
  );

  return (
    <div className="visual-wrapper">
      <div className="visual-canvas">
        <MathCanvas width={650} height={380} draw={draw} />
      </div>
      <div className="visual-controls">
        <ControlPanel
          selects={[{
            label: '波形', value: waveType,
            options: [
              { value: 'square', label: '方波' },
              { value: 'sawtooth', label: '锯齿波' },
            ],
            onChange: setWaveType,
          }]}
          sliders={[{ label: '傅里叶项数 n', min: 1, max: 15, step: 1, value: n, onChange: (v) => setN(Math.round(v)), format: (v) => v.toFixed(0) }]}
        />
      </div>
    </div>
  );
}
