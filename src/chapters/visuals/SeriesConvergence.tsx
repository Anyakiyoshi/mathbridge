import { useState, useCallback, useMemo } from 'react';
import MathCanvas, { createCoordTransform, drawAxes } from '../../components/MathCanvas';
import ControlPanel from '../../components/ControlPanel';

export function SeriesViz() {
  const [n, setN] = useState(10);
  const [seriesType, setSeriesType] = useState('geo');

  const partialSum = useMemo(() => {
    switch (seriesType) {
      case 'geo': {
        let s = 0;
        for (let i = 0; i <= n; i++) s += Math.pow(0.7, i);
        return s;
      }
      case 'harmonic': {
        let s = 0;
        for (let i = 1; i <= n; i++) s += 1 / i;
        return s;
      }
      case 'alt': {
        let s = 0;
        for (let i = 1; i <= n; i++) s += (i % 2 === 1 ? 1 : -1) / i;
        return s;
      }
      default: return 0;
    }
  }, [n, seriesType]);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _coord: ReturnType<typeof createCoordTransform>, w: number, h: number) => {
      const xMin = 0, xMax = 25, yMin = -1, yMax = 5;
      const c = createCoordTransform(w, h, xMin, xMax, yMin, yMax, 40);
      drawAxes(ctx, c, w, h, xMin, xMax, yMin, yMax, 5);

      // Draw partial sums
      ctx.save();
      ctx.strokeStyle = '#1a73e8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      let s = 0;
      for (let i = 0; i <= Math.min(n + 5, 24); i++) {
        switch (seriesType) {
          case 'geo': s += Math.pow(0.7, i); break;
          case 'harmonic': if (i > 0) s += 1 / i; break;
          case 'alt': if (i > 0) s += (i % 2 === 1 ? 1 : -1) / i; break;
        }
        const [px, py] = c.toPixel(i, s);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();

      // Dots for each term
      let s2 = 0;
      for (let i = 0; i <= Math.min(n + 5, 24); i++) {
        switch (seriesType) {
          case 'geo': s2 += Math.pow(0.7, i); break;
          case 'harmonic': if (i > 0) s2 += 1 / i; break;
          case 'alt': if (i > 0) s2 += (i % 2 === 1 ? 1 : -1) / i; break;
        }
        const [px, py] = c.toPixel(i, s2);
        ctx.fillStyle = i === n ? '#d93025' : '#1a73e8';
        ctx.beginPath();
        ctx.arc(px, py, i === n ? 6 : 3, 0, Math.PI * 2);
        ctx.fill();
      }

      const labels: Record<string, string> = {
        geo: '几何级数 Σ(0.7)^n → 1/(1−0.7) ≈ 3.33',
        harmonic: '调和级数 Σ1/n → ∞ (发散!)',
        alt: '交错调和 Σ(−1)^{n+1}/n → ln2 ≈ 0.693',
      };

      ctx.fillStyle = '#333';
      ctx.font = '13px sans-serif';
      ctx.fillText(`${labels[seriesType]}  S${n}=${partialSum.toFixed(4)}`, 10, h - 15);
    },
    [n, seriesType, partialSum]
  );

  return (
    <div className="visual-wrapper">
      <div className="visual-canvas">
        <MathCanvas width={650} height={380} draw={draw} />
      </div>
      <div className="visual-controls">
        <ControlPanel
          selects={[{
            label: '级数', value: seriesType,
            options: [
              { value: 'geo', label: '几何级数 Σ(0.7)^n' },
              { value: 'harmonic', label: '调和级数 Σ1/n' },
              { value: 'alt', label: '交错调和级数' },
            ],
            onChange: setSeriesType,
          }]}
          sliders={[{ label: 'n', min: 1, max: 20, step: 1, value: n, onChange: (v) => setN(Math.round(v)), format: (v) => v.toFixed(0) }]}
        />
      </div>
    </div>
  );
}
