import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import MathScene, { SurfaceMesh } from '../../components/MathScene';
import ControlPanel, { MatrixInput2x2 } from '../../components/ControlPanel';
import Formula from '../../components/Formula';
import type { Matrix2D } from '../../utils/linearAlgebra';
import { eigen2x2 } from '../../utils/linearAlgebra';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

export default function GradientDescent() {
  const [a, setA] = useState(2);
  const [b, setB] = useState(0);
  const [c, setC] = useState(0);
  const [d, setD] = useState(0.5);
  const [lr, setLr] = useState(0.15);
  const [startX, setStartX] = useState(1.8);
  const [startY, setStartY] = useState(1.5);
  const [iterations, setIterations] = useState(20);
  const [running, setRunning] = useState(false);
  const [currentIter, setCurrentIter] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const ab = (b + c) / 2;
  const matrix: Matrix2D = [[a, ab], [ab, d]];
  const eigen = useMemo(() => eigen2x2(matrix), [matrix]);
  const condNumber = eigen.real && Math.abs(eigen.eigenvalues[1]) > 1e-10
    ? Math.abs(eigen.eigenvalues[0]) / Math.abs(eigen.eigenvalues[1])
    : Infinity;

  const f = useCallback(
    (x: number, y: number) => a * x * x + 2 * ab * x * y + d * y * y,
    [a, ab, d]
  );

  const grad = useCallback(
    (x: number, y: number): [number, number] => [
      2 * a * x + 2 * ab * y,
      2 * ab * x + 2 * d * y,
    ],
    [a, ab, d]
  );

  // Compute trajectory
  const trajectory = useMemo(() => {
    const points: [number, number, number][] = [];
    let x = startX, y = startY;
    points.push([x, y, f(x, y)]);
    for (let i = 0; i < iterations; i++) {
      const [gx, gy] = grad(x, y);
      x -= lr * gx;
      y -= lr * gy;
      const z = f(x, y);
      if (!isFinite(z)) break;
      points.push([x, y, z]);
      if (Math.hypot(gx, gy) < 1e-6) break;
    }
    return points;
  }, [startX, startY, lr, iterations, f, grad]);

  const displayedTraj = trajectory.slice(0, currentIter + 1);

  // Animation
  useEffect(() => {
    if (running) {
      setCurrentIter(0);
      let i = 1;
      intervalRef.current = window.setInterval(() => {
        setCurrentIter((prev) => {
          if (prev >= trajectory.length - 1) {
            setRunning(false);
            return prev;
          }
          return prev + 1;
        });
        i++;
      }, 300);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, trajectory.length]);

  // 3D trajectory line points
  const linePoints = useMemo(() => {
    return displayedTraj.map(([x, y, z]) => new THREE.Vector3(x, z, y));
  }, [displayedTraj]);

  return (
    <div className="module-container">
      <div className="module-canvas-area" style={{ flex: 2 }}>
        <MathScene className="math-scene-full" cameraPosition={[3, 4, 5]} showGrid>
          <SurfaceMesh
            f={f}
            xMin={-2}
            xMax={2}
            yMin={-2}
            yMax={2}
            resolution={60}
            color="#4da6ff"
            opacity={0.7}
          />
          {/* Trajectory */}
          {linePoints.length > 1 && (
            <Line
              points={linePoints}
              color="#ff4500"
              lineWidth={3}
            />
          )}
          {/* Current point */}
          {displayedTraj.length > 0 && (() => {
            const [x, y, z] = displayedTraj[displayedTraj.length - 1];
            return (
              <mesh position={[x, z + 0.05, y]}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color="#ff0000" />
              </mesh>
            );
          })()}
        </MathScene>
      </div>
      <div className="module-sidebar">
        <ControlPanel title="二次型 (Hessian)">
          <MatrixInput2x2
            values={[a, b, c, d]}
            labels={['a₁₁', 'a₁₂', 'a₂₁', 'a₂₂']}
            onChange={([na, nb, nc, nd]) => {
              setA(na); setB(nb); setC(nc); setD(nd);
            }}
          />
        </ControlPanel>

        <ControlPanel
          title="梯度下降参数"
          sliders={[
            { label: '学习率 α', min: 0.01, max: 0.5, step: 0.01, value: lr, onChange: setLr },
            { label: '初始 x₀', min: -2, max: 2, step: 0.1, value: startX, onChange: setStartX },
            { label: '初始 y₀', min: -2, max: 2, step: 0.1, value: startY, onChange: setStartY },
            { label: '迭代次数', min: 5, max: 50, step: 1, value: iterations, onChange: (v) => setIterations(Math.round(v)), format: (v) => v.toFixed(0) },
            { label: '进度', min: 0, max: trajectory.length - 1, step: 1, value: currentIter, onChange: setCurrentIter, format: (v) => v.toFixed(0) },
          ]}
          buttons={[
            { label: running ? '⏸ 停止' : '▶ 动画', active: running, onClick: () => setRunning(!running) },
          ]}
        />

        <div className="insight-box">
          <h4>📊 收敛分析</h4>
          <table className="stats-table">
            <tbody>
              <tr><td>Hessian 条件数</td><td>{condNumber.toFixed(2)}</td></tr>
              <tr>
                <td>特征值 λ₁, λ₂</td>
                <td>
                  {eigen.real
                    ? `${eigen.eigenvalues[0].toFixed(3)}, ${eigen.eigenvalues[1].toFixed(3)}`
                    : '复数'}
                </td>
              </tr>
              <tr><td>当前迭代</td><td>{currentIter} / {trajectory.length - 1}</td></tr>
              <tr><td>当前位置</td><td>
                {displayedTraj.length > 0
                  ? `(${displayedTraj[displayedTraj.length - 1][0].toFixed(3)}, ${displayedTraj[displayedTraj.length - 1][1].toFixed(3)})`
                  : '—'}
              </td></tr>
            </tbody>
          </table>
        </div>

        <div className="insight-box highlight">
          <h4>💡 线性代数视角</h4>
          <p>
            梯度下降的迭代 <Formula latex="\mathbf{x}_{k+1} = \mathbf{x}_k - \alpha A\mathbf{x}_k" />{' '}
            本质上是<strong>幂迭代</strong>的变体！
          </p>
          <p>
            条件数 κ = λ_max / λ_min 越大，收敛越慢。
            极端各向异性 → 锯齿形下降路径。
          </p>
        </div>
      </div>
    </div>
  );
}
