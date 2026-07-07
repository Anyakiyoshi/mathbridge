import { useState, useCallback } from 'react';
import MathCanvas, { createCoordTransform, drawAxes } from '../../components/MathCanvas';
import ControlPanel, { MatrixInput2x2 } from '../../components/ControlPanel';
import { eigen2x2 } from '../../utils/linearAlgebra';
import type { Matrix2D } from '../../utils/linearAlgebra';

export function ODESystemsViz() {
  const [a, setA] = useState(-1);
  const [b, setB] = useState(2);
  const [c, setC] = useState(-2);
  const [d, setD] = useState(-1);

  const matrix: Matrix2D = [[a, b], [c, d]];
  const eigen = useCallback(() => eigen2x2(matrix), [matrix])();

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _coord: ReturnType<typeof createCoordTransform>, w: number, h: number) => {
      const xMin = -4, xMax = 4, yMin = -4, yMax = 4;
      const coord = createCoordTransform(w, h, xMin, xMax, yMin, yMax, 30);
      drawAxes(ctx, coord, w, h, xMin, xMax, yMin, yMax, 1);

      // Vector field: A·[x,y]
      const step = 0.6;
      ctx.save();
      for (let x = xMin; x <= xMax; x += step) {
        for (let y = yMin; y <= yMax; y += step) {
          const dx = a * x + b * y;
          const dy = c * x + d * y;
          const mag = Math.hypot(dx, dy);
          if (mag < 0.05) continue;
          const scale = 0.15 / mag;
          const [sx, sy] = coord.toPixel(x, y);
          const [ex, ey] = coord.toPixel(x + dx * scale, y + dy * scale);
          const angle = Math.atan2(ey - sy, ex - sx);
          ctx.strokeStyle = 'rgba(80, 80, 80, 0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(ex, ey);
          ctx.stroke();
          // Arrowhead
          const hl = 5;
          ctx.fillStyle = 'rgba(80, 80, 80, 0.4)';
          ctx.beginPath();
          ctx.moveTo(ex, ey);
          ctx.lineTo(ex - hl * Math.cos(angle - 0.5), ey - hl * Math.sin(angle - 0.5));
          ctx.lineTo(ex - hl * Math.cos(angle + 0.5), ey - hl * Math.sin(angle + 0.5));
          ctx.closePath();
          ctx.fill();
        }
      }

      // Eigenvectors
      if (eigen.real && eigen.eigenvectors) {
        eigen.eigenvectors.forEach((ev, idx) => {
          const lambda = eigen.eigenvalues[idx];
          [1, -1].forEach((sign) => {
            const [ex, ey] = coord.toPixel(ev[0] * sign * 3, ev[1] * sign * 3);
            const [ox, oy] = coord.toPixel(0, 0);
            ctx.strokeStyle = idx === 0 ? '#e74c3c' : '#3498db';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 3]);
            ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ex, ey); ctx.stroke();
            ctx.setLineDash([]);
          });
          ctx.fillStyle = idx === 0 ? '#e74c3c' : '#3498db';
          ctx.font = '11px sans-serif';
          ctx.fillText(`λ${idx+1}=${lambda.toFixed(1)}`, coord.toPixel(ev[0] * 2 + 0.2, ev[1] * 2)[0], coord.toPixel(ev[0] * 2, ev[1] * 2)[1] - 10);
        });
      }

      // Classification
      let phaseType = '';
      if (eigen.real) {
        const [l1, l2] = eigen.eigenvalues;
        if (l1 < 0 && l2 < 0) phaseType = '稳定结点 (Stable Node)';
        else if (l1 > 0 && l2 > 0) phaseType = '不稳定源 (Unstable Source)';
        else if (l1 * l2 < 0) phaseType = '鞍点 (Saddle)';
        else phaseType = '退化结点';
      } else {
        const realPart = eigen.eigenvalues[0];
        if (realPart < 0) phaseType = '稳定焦点 (Stable Spiral)';
        else if (realPart > 0) phaseType = '不稳定焦点 (Unstable Spiral)';
        else phaseType = '中心 (Center)';
      }

      ctx.fillStyle = '#333';
      ctx.font = '14px sans-serif';
      ctx.fillText(`相图类型: ${phaseType}`, 10, h - 10);

      ctx.restore();
    },
    [a, b, c, d, eigen]
  );

  return (
    <div className="visual-wrapper">
      <div className="visual-canvas">
        <MathCanvas width={550} height={480} draw={draw} />
      </div>
      <div className="visual-controls">
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>系统: x' = Ax</p>
        <MatrixInput2x2 values={[a, b, c, d]} onChange={([na, nb, nc, nd]) => { setA(na); setB(nb); setC(nc); setD(nd); }} labels={['a₁₁', 'a₁₂', 'a₂₁', 'a₂₂']} />
      </div>
    </div>
  );
}
