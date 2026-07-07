import type { Chapter } from '../store/useStore';
import Formula from '../components/Formula';
import { SlopeFieldViz } from './visuals/SlopeField';
import { ODESystemsViz } from './visuals/ODESystems';

export const chapter07: Chapter = {
  id: 'ch07', number: 7, title: 'Differential Equations', titleZh: '微分方程', volume: 1,
  sections: [
    {
      id: 'ch07-slope', title: 'Slope Fields & Solutions', titleZh: '方向场 & 解的几何意义',
      visual: SlopeFieldViz,
      laBridgeZh: '一阶微分方程 dy/dx = f(x,y) 定义了一个方向场。解曲线就是沿着场方向走的"流线"。这在向量微积分中对应着梯度流和势函数的概念。',
      content: () => (
        <div className="section-content">
          <h2>7.1 微分方程的方向场</h2>
          <p>微分方程 <Formula latex="\frac{dy}{dx} = f(x, y)" /> 在平面上每个点规定了一个斜率。</p>
          <p><strong>方向场</strong>将这些斜率用小线段画出来，<strong>解曲线</strong>沿这些方向流动。</p>
          <div className="example-box">
            <p><strong>例：</strong> <Formula latex="\frac{dy}{dx} = x - y" /></p>
            <p>通解：<Formula latex="y = x - 1 + Ce^{-x}" /></p>
          </div>
        </div>
      ),
    },
    {
      id: 'ch07-linear', title: 'Linear ODEs', titleZh: '一阶线性 & 二阶常系数方程',
      content: () => (
        <div className="section-content">
          <h2>7.2 一阶线性微分方程</h2>
          <p><Formula latex="y' + p(x)y = q(x)" /></p>
          <p>通解公式：<Formula latex="y = e^{-\int p dx}\left[\int q e^{\int p dx}dx + C\right]" /></p>
          <h3>二阶常系数线性方程</h3>
          <p><Formula latex="y'' + ay' + by = 0" /></p>
          <p>特征方程：<Formula latex="r^2 + ar + b = 0" />。根的类型决定解的行为——这就是<strong>矩阵特征值</strong>在微分方程中的体现！</p>
        </div>
      ),
    },
    {
      id: 'ch07-systems', title: 'Systems of ODEs', titleZh: '微分方程组 — 特征值方法',
      visual: ODESystemsViz,
      laBridgeZh: '线性微分方程组 d𝐱/dt = A𝐱 的解是 e^(λt)𝐯，其中 λ 和 𝐯 是 A 的特征值和特征向量！这是微积分和线性代数最深刻的交汇——用特征值分解来解微分方程。',
      content: () => (
        <div className="section-content">
          <h2>7.3 微分方程组 = 矩阵指数</h2>
          <p>线性微分方程组：<Formula latex="\frac{d\mathbf{x}}{dt} = A\mathbf{x}" /></p>
          <p>解为：<Formula latex="\mathbf{x}(t) = e^{At}\mathbf{x}(0)" /></p>
          <p>若 A 可对角化 <Formula latex="A = PDP^{-1}" />，则 <Formula latex="e^{At} = P e^{Dt} P^{-1}" />。</p>
          <div className="insight-box highlight">
            <h4>💡 核心洞察</h4>
            <p>微分方程的特征值方法和你在线性代数中学的<strong>矩阵对角化</strong>完全是一回事！</p>
            <ul>
              <li>实负特征值 → 稳定结点（衰减）</li>
              <li>实正特征值 → 不稳定源（增长）</li>
              <li>复特征值 → 螺旋（振荡）</li>
              <li>纯虚特征值 → 中心（周期轨道）</li>
            </ul>
          </div>
        </div>
      ),
    },
  ],
};
