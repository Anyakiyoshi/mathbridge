import { useState, useMemo, useCallback } from 'react';
import MathScene, { SurfaceMesh } from '../../components/MathScene';
import ControlPanel, { MatrixInput2x2 } from '../../components/ControlPanel';
import Formula from '../../components/Formula';
import type { Matrix2D } from '../../utils/linearAlgebra';
import { eigen2x2 } from '../../utils/linearAlgebra';

const PRESETS: { label: string; matrix: [number, number, number, number]; desc: string }[] = [
  { label: '正定 (碗)', matrix: [2, 0, 0, 2], desc: 'λ₁>0, λ₂>0 — 严格极小值' },
  { label: '负定 (倒碗)', matrix: [-2, 0, 0, -2], desc: 'λ₁<0, λ₂<0 — 严格极大值' },
  { label: '不定 (马鞍)', matrix: [2, 0, 0, -2], desc: 'λ₁>0, λ₂<0 — 鞍点' },
  { label: '半正定 (U形)', matrix: [2, 0, 0, 0], desc: 'λ₁>0, λ₂=0 — 退化' },
  { label: '倾斜鞍', matrix: [2, 1.5, 1.5, -1], desc: '含交叉项 — 仍然不定' },
];

export default function QuadraticForm() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [c, setC] = useState(1);
  const [d, setD] = useState(-1);
  const [showWireframe, setShowWireframe] = useState(false);

  // Ensure symmetric: use upper triangle + shared cross-term
  const ab = (b + c) / 2; // symmetrize
  const matrix: Matrix2D = [[a, ab], [ab, d]];

  const eigen = useMemo(() => eigen2x2(matrix), [matrix]);

  // Quadratic form: f(x,y) = ax^2 + 2b_xy + dy^2  where b_ is the symmetrized cross-term
  const f = useCallback(
    (x: number, y: number) => a * x * x + 2 * ab * x * y + d * y * y,
    [a, ab, d]
  );

  const definiteness = useMemo(() => {
    const det = a * d - ab * ab;
    if (a > 0 && det > 0) return '正定 (positive definite) — 碗形/极小值';
    if (a < 0 && det > 0) return '负定 (negative definite) — 倒碗/极大值';
    if (det < 0) return '不定 (indefinite) — 马鞍形/鞍点';
    if (det === 0) return '半定 (semidefinite) — 退化';
    return '不定';
  }, [a, ab, d]);

  return (
    <div className="module-container">
      <div className="module-canvas-area" style={{ flex: 2 }}>
        <MathScene className="math-scene-full" cameraPosition={[3, 5, 4]} showGrid>
          <SurfaceMesh
            f={f}
            xMin={-2}
            xMax={2}
            yMin={-2}
            yMax={2}
            resolution={80}
            color="#4da6ff"
            wireframe={showWireframe}
            opacity={0.8}
          />
        </MathScene>
      </div>
      <div className="module-sidebar">
        <ControlPanel title="对称矩阵 A (二次型系数)">
          <p className="hint-text">二次型: <Formula latex="q(\mathbf{x}) = \mathbf{x}^T A \mathbf{x}" /></p>
          <MatrixInput2x2
            values={[a, ab, ab, d]}
            labels={['a', 'b', 'b', 'd']}
            onChange={([na, nb, nc, nd]) => {
              setA(na);
              setB(nb);
              setC(nc);
              setD(nd);
            }}
          />
          <label className="checkbox-label">
            <input type="checkbox" checked={showWireframe} onChange={(e) => setShowWireframe(e.target.checked)} />
            显示线框
          </label>
        </ControlPanel>

        <ControlPanel
          title="预设"
          buttons={PRESETS.map((p) => ({
            label: p.label,
            onClick: () => {
              setA(p.matrix[0]);
              setB(p.matrix[1]);
              setC(p.matrix[2]);
              setD(p.matrix[3]);
            },
          }))}
        />

        <div className="insight-box">
          <h4>📊 矩阵分析</h4>
          <table className="stats-table">
            <tbody>
              <tr><td>类型</td><td>{definiteness}</td></tr>
              <tr>
                <td>特征值</td>
                <td>
                  {eigen.real
                    ? `λ₁=${eigen.eigenvalues[0].toFixed(3)}, λ₂=${eigen.eigenvalues[1].toFixed(3)}`
                    : '复数特征值'}
                </td>
              </tr>
              <tr><td>行列式</td><td>{(a * d - ab * ab).toFixed(3)}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="insight-box highlight">
          <h4>💡 Hessian 判据</h4>
          <p>
            在极值点处，<strong>Hessian 矩阵</strong>即该点的二次型：
          </p>
          <ul className="insight-list">
            <li>正定 → 局部极小值</li>
            <li>负定 → 局部极大值</li>
            <li>不定 → 鞍点</li>
            <li>半定 → 需要更高阶信息</li>
          </ul>
          <p>
            特征向量指示主曲率方向，特征值的模是曲率大小。
          </p>
        </div>
      </div>
    </div>
  );
}
