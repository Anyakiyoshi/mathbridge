import { useState, useCallback, useMemo } from 'react';
import MathCanvas, { createCoordTransform } from '../../components/MathCanvas';
import ControlPanel, { MatrixInput2x2 } from '../../components/ControlPanel';
import type { Matrix2D, Vector2D } from '../../utils/linearAlgebra';
import {
  mat2dMult,
  determinant,
  trace,
  rank,
  eigen2x2,
  generateGridPoints,
  rotationMatrix,
  scaleMatrix,
  shearMatrix,
  projectionMatrix,
  reflectionMatrix,
} from '../../utils/linearAlgebra';

const PRESETS: { label: string; matrix: Matrix2D }[] = [
  { label: '单位 (I)', matrix: [[1, 0], [0, 1]] },
  { label: '旋转 45°', matrix: rotationMatrix(Math.PI / 4) },
  { label: '缩放 (2,1)', matrix: scaleMatrix(2, 1) },
  { label: '剪切', matrix: shearMatrix(1) },
  { label: '投影到 x', matrix: projectionMatrix(0) },
  { label: '反射 y=x', matrix: reflectionMatrix(Math.PI / 4) },
  { label: '90° 旋转', matrix: rotationMatrix(Math.PI / 2) },
  { label: '拉伸旋转', matrix: [[1.5, 0.5], [0.3, 1.2]] },
  { label: '奇异 (秩1)', matrix: [[1, 2], [2, 4]] },
  { label: '负行列式', matrix: [[-1, 1], [0, 2]] },
];

export default function LinearTransform() {
  const [a, setA] = useState(1.5);
  const [b, setB] = useState(0.5);
  const [c_, setC_] = useState(0.3);
  const [d, setD] = useState(1.2);

  const matrix: Matrix2D = [[a, b], [c_, d]];

  const det = determinant(matrix);
  const tr = trace(matrix);
  const rk = rank(matrix);
  const eigen = useMemo(() => eigen2x2(matrix), [matrix]);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _coord: ReturnType<typeof createCoordTransform>, w: number, h: number) => {
      const xMin = -4, xMax = 4, yMin = -4, yMax = 4;
      const c = createCoordTransform(w, h, xMin, xMax, yMin, yMax, 30);

      // Draw transformed grid
      const { hLines, vLines } = generateGridPoints(-3, 3, -3, 3, 0.5);

      ctx.save();

      // Horizontal lines after transformation
      ctx.strokeStyle = 'rgba(100, 100, 255, 0.25)';
      ctx.lineWidth = 0.5;
      hLines.forEach((line) => {
        ctx.beginPath();
        let first = true;
        line.forEach(([x, y]) => {
          const [tx, ty] = mat2dMult(matrix, [x, y]);
          const [px, py] = c.toPixel(tx, ty);
          if (first) { ctx.moveTo(px, py); first = false; }
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
      });

      // Vertical lines after transformation
      ctx.strokeStyle = 'rgba(100, 100, 255, 0.25)';
      vLines.forEach((line) => {
        ctx.beginPath();
        let first = true;
        line.forEach(([x, y]) => {
          const [tx, ty] = mat2dMult(matrix, [x, y]);
          const [px, py] = c.toPixel(tx, ty);
          if (first) { ctx.moveTo(px, py); first = false; }
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
      });

      // Unit square after transformation
      const sq = [[0, 0], [1, 0], [1, 1], [0, 1]] as Vector2D[];
      const sqT = sq.map((v) => mat2dMult(matrix, v));
      ctx.fillStyle = 'rgba(26, 115, 232, 0.15)';
      ctx.strokeStyle = '#1a73e8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      sqT.forEach(([x, y], i) => {
        const [px, py] = c.toPixel(x, y);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Basis vectors after transformation (e1 → col1, e2 → col2)
      const e1T = mat2dMult(matrix, [1, 0]);
      const e2T = mat2dMult(matrix, [0, 1]);
      const [oPx, oPy] = c.toPixel(0, 0);

      // e1' (red)
      const [e1x, e1y] = c.toPixel(e1T[0], e1T[1]);
      drawVector(ctx, oPx, oPy, e1x, e1y, '#e74c3c', 'A·e₁', 3);

      // e2' (blue)
      const [e2x, e2y] = c.toPixel(e2T[0], e2T[1]);
      drawVector(ctx, oPx, oPy, e2x, e2y, '#3498db', 'A·e₂', 3);

      // Faint original grid
      ctx.strokeStyle = 'rgba(150, 150, 150, 0.15)';
      ctx.lineWidth = 0.3;
      hLines.forEach((line) => {
        ctx.beginPath();
        line.forEach(([x, y], i) => {
          const [px, py] = c.toPixel(x, y);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        });
        ctx.stroke();
      });
      vLines.forEach((line) => {
        ctx.beginPath();
        line.forEach(([x, y], i) => {
          const [px, py] = c.toPixel(x, y);
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        });
        ctx.stroke();
      });

      // Faint original basis
      const [e1ox, e1oy] = c.toPixel(1, 0);
      const [e2ox, e2oy] = c.toPixel(0, 1);
      ctx.strokeStyle = 'rgba(231, 76, 60, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(oPx, oPy); ctx.lineTo(e1ox, e1oy); ctx.stroke();
      ctx.strokeStyle = 'rgba(52, 152, 219, 0.3)';
      ctx.beginPath(); ctx.moveTo(oPx, oPy); ctx.lineTo(e2ox, e2oy); ctx.stroke();
      ctx.setLineDash([]);

      // Draw eigenvectors if real
      if (eigen.real && eigen.eigenvectors) {
        eigen.eigenvectors.forEach((ev, idx) => {
          const lambda = eigen.eigenvalues[idx];
          const [ex, ey] = c.toPixel(ev[0] * 2.5, ev[1] * 2.5);
          const [ex2, ey2] = c.toPixel(-ev[0] * 2.5, -ev[1] * 2.5);
          ctx.strokeStyle = '#9b59b6';
          ctx.lineWidth = 1;
          ctx.setLineDash([6, 3]);
          ctx.beginPath();
          ctx.moveTo(ex2, ey2);
          ctx.lineTo(ex, ey);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.fillStyle = '#9b59b6';
          ctx.font = '12px sans-serif';
          ctx.fillText(`λ${idx+1}=${lambda.toFixed(2)}`, ex + 5, ey - 5);
          // Arrow on eigenvector direction
          const arrowX = oPx + (ex - oPx) * 0.6;
          const arrowY = oPy + (ey - oPy) * 0.6;
          ctx.fillStyle = '#9b59b6';
          ctx.beginPath();
          ctx.arc(arrowX, arrowY, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      ctx.restore();
    },
    [matrix, a, b, c_, d]
  );

  return (
    <div className="module-container">
      <div className="module-canvas-area">
        <MathCanvas width={650} height={550} xMin={-4} xMax={4} yMin={-4} yMax={4} draw={draw} />
      </div>
      <div className="module-sidebar">
        <ControlPanel title="矩阵输入">
          <MatrixInput2x2 values={[a, b, c_, d]} onChange={([a, b_, c, d]) => {
            setA(a); setB(b_); setC_(c); setD(d);
          }} />
        </ControlPanel>

        <ControlPanel
          title="预设变换"
          buttons={PRESETS.map((p) => ({
            label: p.label,
            onClick: () => {
              setA(p.matrix[0][0]);
              setB(p.matrix[0][1]);
              setC_(p.matrix[1][0]);
              setD(p.matrix[1][1]);
            },
          }))}
        />

        <div className="insight-box">
          <h4>📊 矩阵属性</h4>
          <table className="stats-table">
            <tbody>
              <tr><td>行列式 det(A)</td><td>{det.toFixed(3)} <span className="hint">{det < 0 ? '⚠ 翻转!' : det === 0 ? '⚠ 降维!' : '✓ 保向'}</span></td></tr>
              <tr><td>迹 tr(A)</td><td>{tr.toFixed(3)}</td></tr>
              <tr><td>秩 rank(A)</td><td>{rk} {rk < 2 ? '(降维)' : ''}</td></tr>
              <tr>
                <td>特征值</td>
                <td>
                  {eigen.real
                    ? `${eigen.eigenvalues[0].toFixed(3)}, ${eigen.eigenvalues[1].toFixed(3)}`
                    : `${eigen.eigenvalues[0].toFixed(2)} ± ${eigen.eigenvalues[1].toFixed(2)}i`}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="insight-box highlight">
          <h4>💡 关键洞察</h4>
          <ul className="insight-list">
            <li><strong>列向量</strong> = 变换后基向量位置（红色 = Col₁, 蓝色 = Col₂）</li>
            <li><strong>det = 面积缩放因子</strong>，|det| &lt; 1 压缩，|det| &gt; 1 放大，det &lt; 0 翻转</li>
            <li><strong>特征向量</strong> = 方向不变的紫色虚线</li>
            <li>导数就是局部线性变换 — <strong>Jacobian 矩阵!</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function drawVector(
  ctx: CanvasRenderingContext2D,
  fx: number, fy: number,
  tx: number, ty: number,
  color: string,
  label?: string,
  lineWidth = 2
) {
  const angle = Math.atan2(ty - fy, tx - fx);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(fx, fy);
  ctx.lineTo(tx, ty);
  ctx.stroke();
  const headLen = 10;
  ctx.beginPath();
  ctx.moveTo(tx, ty);
  ctx.lineTo(tx - headLen * Math.cos(angle - Math.PI / 6), ty - headLen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(tx - headLen * Math.cos(angle + Math.PI / 6), ty - headLen * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fill();
  if (label) {
    ctx.font = '12px sans-serif';
    ctx.fillText(label, tx + 6, ty - 4);
  }
  ctx.restore();
}
