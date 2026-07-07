import { useState, useCallback, useMemo } from 'react';
import MathCanvas, { createCoordTransform, drawAxes } from '../../components/MathCanvas';
import ControlPanel from '../../components/ControlPanel';
import Formula from '../../components/Formula';

// Generate some sample data
function generateData(slope = 1.5, intercept = 0.5, noise = 0.8, n = 20): [number, number][] {
  const data: [number, number][] = [];
  for (let i = 0; i < n; i++) {
    const x = (Math.random() - 0.5) * 8;
    const y = intercept + slope * x + (Math.random() - 0.5) * noise * 2;
    data.push([x, y]);
  }
  return data;
}

export default function LeastSquares() {
  const slopeTrue = 1.2;
  const interceptTrue = 0.8;
  const [data, setData] = useState(() => generateData(slopeTrue, interceptTrue, 1.0, 18));

  // OLS estimates
  const { beta0, beta1, rss } = useMemo(() => {
    const n = data.length;
    let sx = 0, sy = 0, sxy = 0, sxx = 0;
    for (const [x, y] of data) {
      sx += x;
      sy += y;
      sxy += x * y;
      sxx += x * x;
    }
    const b1 = (n * sxy - sx * sy) / (n * sxx - sx * sx);
    const b0 = (sy - b1 * sx) / n;
    let rssVal = 0;
    for (const [x, y] of data) rssVal += (y - b0 - b1 * x) ** 2;
    return { beta0: b0, beta1: b1, rss: rssVal };
  }, [data]);

  const [viewMode, setViewMode] = useState<'scatter' | 'rss-surface'>('scatter');
  const [rssBeta0, setRssBeta0] = useState(beta0);
  const [rssBeta1, setRssBeta1] = useState(beta1);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, _coord: ReturnType<typeof createCoordTransform>, w: number, h: number) => {
      const pad = 60;
      if (viewMode === 'scatter') {
        // Scatter + fitted line + residual lines
        const xMin = -5, xMax = 5, yMin = -4, yMax = 8;
        const c = createCoordTransform(w, h, xMin, xMax, yMin, yMax, pad);
        drawAxes(ctx, c, w, h, xMin, xMax, yMin, yMax, 1);

        // Draw fitted line
        ctx.save();
        ctx.strokeStyle = '#1a73e8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const [lx1, ly1] = c.toPixel(xMin, beta0 + beta1 * xMin);
        const [lx2, ly2] = c.toPixel(xMax, beta0 + beta1 * xMax);
        ctx.moveTo(lx1, ly1);
        ctx.lineTo(lx2, ly2);
        ctx.stroke();

        // Draw data points + residuals
        data.forEach(([x, y]) => {
          const [px, py] = c.toPixel(x, y);
          const yFit = beta0 + beta1 * x;
          const [, pfy] = c.toPixel(x, yFit);

          // Residual line
          ctx.strokeStyle = 'rgba(220, 50, 30, 0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px, pfy);
          ctx.stroke();

          // Data point
          ctx.fillStyle = '#333';
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fill();
        });

        ctx.restore();

        // Legend
        ctx.fillStyle = '#1a73e8';
        ctx.font = '14px sans-serif';
        ctx.fillText(
          `ŷ = ${beta0.toFixed(3)} + ${beta1.toFixed(3)}·x    RSS = ${rss.toFixed(3)}`,
          10, h - 15
        );

      } else if (viewMode === 'rss-surface') {
        // RSS(β₀, β₁) as contour plot
        const b0Min = beta0 - 3, b0Max = beta0 + 3;
        const b1Min = beta1 - 1.5, b1Max = beta1 + 1.5;
        const c = createCoordTransform(w, h, b1Min, b1Max, b0Min, b0Max, pad);

        // Draw axes
        ctx.save();
        ctx.strokeStyle = '#aaa';
        ctx.lineWidth = 0.5;
        for (let b0 = Math.ceil(b0Min); b0 <= b0Max; b0++) {
          const [px1, py] = c.toPixel(b1Min, b0);
          const [px2] = c.toPixel(b1Max, b0);
          ctx.beginPath(); ctx.moveTo(px1, py); ctx.lineTo(px2, py); ctx.stroke();
          ctx.fillText(b0.toFixed(0), px1 - 25, py + 3);
        }
        for (let b1 = Math.ceil(b1Min); b1 <= b1Max; b1 += 0.5) {
          const [px, py1] = c.toPixel(b1, b0Min);
          const [, py2] = c.toPixel(b1, b0Max);
          ctx.beginPath(); ctx.moveTo(px, py1); ctx.lineTo(px, py2); ctx.stroke();
          ctx.fillText(b1.toFixed(1), px - 15, py2 + 12);
        }

        // Contour fill: RSS
        const resolution = 100;
        const rssValues: number[] = [];
        let rssMin = Infinity, rssMax = -Infinity;
        for (let i = 0; i < resolution; i++) {
          for (let j = 0; j < resolution; j++) {
            const b0 = b0Min + (b0Max - b0Min) * j / resolution;
            const b1 = b1Min + (b1Max - b1Min) * i / resolution;
            let r = 0;
            for (const [x, y] of data) r += (y - b0 - b1 * x) ** 2;
            if (r < rssMin) rssMin = r;
            if (r > rssMax) rssMax = r;
            rssValues.push(r);
          }
        }

        for (let i = 0; i < resolution; i++) {
          for (let j = 0; j < resolution; j++) {
            const r = rssValues[i * resolution + j];
            const t = (r - rssMin) / Math.max(rssMax - rssMin, 0.001);
            const b0 = b0Min + (b0Max - b0Min) * j / resolution;
            const b1 = b1Min + (b1Max - b1Min) * i / resolution;
            const [px, py] = c.toPixel(b1, b0);
            const red = Math.floor(255 * (1 - t));
            const blue = Math.floor(255 * t);
            ctx.fillStyle = `rgba(${red}, 50, ${blue}, 0.5)`;
            ctx.fillRect(px, py, Math.ceil((b0Max - b0Min) / resolution * c.scale), Math.ceil((b0Max - b0Min) / resolution * c.scale));
          }
        }

        // Mark OLS optimum
        const [ox, oy] = c.toPixel(beta1, beta0);
        ctx.fillStyle = '#d93025';
        ctx.beginPath();
        ctx.arc(ox, oy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.fillStyle = '#d93025';
        ctx.font = '12px sans-serif';
        ctx.fillText('OLS 最优解', ox + 8, oy - 6);

        // Mark draggable point
        const [dx, dy] = c.toPixel(rssBeta1, rssBeta0);
        ctx.fillStyle = '#ff9800';
        ctx.beginPath();
        ctx.arc(dx, dy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.stroke();

        ctx.restore();

        // Label
        const currentRss = data.reduce((s, [x, y]) => s + (y - rssBeta0 - rssBeta1 * x) ** 2, 0);
        ctx.fillStyle = '#333';
        ctx.font = '13px sans-serif';
        ctx.fillText(
          `RSS(β₀, β₁) 等高线  β₀=${rssBeta0.toFixed(2)} β₁=${rssBeta1.toFixed(2)} RSS=${currentRss.toFixed(2)}`,
          10, h - 15
        );
        ctx.fillText(`x轴: β₁ (斜率)  y轴: β₀ (截距)`, 10, h - 33);
      }
    },
    [data, beta0, beta1, rss, viewMode, rssBeta0, rssBeta1]
  );

  const regenerateData = () => {
    setData(generateData(slopeTrue, interceptTrue, 0.8 + Math.random()));
  };

  return (
    <div className="module-container">
      <div className="module-canvas-area">
        <MathCanvas width={700} height={500} xMin={-5} xMax={5} yMin={-4} yMax={8} draw={draw} />
      </div>
      <div className="module-sidebar">
        <ControlPanel
          title="视图"
          buttons={[
            { label: '散点 + 拟合线', active: viewMode === 'scatter', onClick: () => setViewMode('scatter') },
            { label: 'RSS 曲面', active: viewMode === 'rss-surface', onClick: () => setViewMode('rss-surface') },
          ]}
        />
        <button className="regenerate-btn" onClick={regenerateData}>🔄 重新生成数据</button>

        {viewMode === 'rss-surface' && (
          <ControlPanel
            title="探索 RSS 曲面"
            sliders={[
              { label: 'β₀ (截距)', min: beta0 - 2, max: beta0 + 2, step: 0.05, value: rssBeta0, onChange: setRssBeta0 },
              { label: 'β₁ (斜率)', min: beta1 - 1, max: beta1 + 1, step: 0.01, value: rssBeta1, onChange: setRssBeta1 },
            ]}
          />
        )}

        <div className="insight-box">
          <h4>📊 OLS 估计结果</h4>
          <table className="stats-table">
            <tbody>
              <tr><td>β̂₀ (截距)</td><td>{beta0.toFixed(4)}</td></tr>
              <tr><td>β̂₁ (斜率)</td><td>{beta1.toFixed(4)}</td></tr>
              <tr><td>RSS</td><td>{rss.toFixed(4)}</td></tr>
              <tr><td>n</td><td>{data.length}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="insight-box highlight">
          <h4>💡 微积分 × 线代汇合</h4>
          <p>
            <strong>微积分视角</strong>：RSS 对 β₀, β₁ 求偏导 = 0，解正规方程。
          </p>
          <p>
            <strong>线性代数视角</strong>：<Formula latex="\hat{\boldsymbol{\beta}} = (X^T X)^{-1} X^T \mathbf{y}" />{' '}
            — 将 y 投影到 X 的列空间上！
          </p>
          <p>
            残差 <Formula latex="\mathbf{e} = \mathbf{y} - \hat{\mathbf{y}}" /> 与列空间正交 —
            这是所有线性模型的核心几何直觉。
          </p>
        </div>
      </div>
    </div>
  );
}
