import type { Chapter } from '../store/useStore';
import Formula from '../components/Formula';
import { RiemannViz } from './visuals/RiemannSum';
import { FTCViz } from './visuals/FTC';

export const chapter05: Chapter = {
  id: 'ch05', number: 5, title: 'Definite Integrals', titleZh: '定积分', volume: 1,
  sections: [
    {
      id: 'ch05-riemann', title: 'Riemann Sum → Integral', titleZh: '黎曼和 → 定积分收敛',
      visual: RiemannViz,
      laBridgeZh: '黎曼和本质上是一个内积:把函数值和区间长度相乘再求和。定积分是无穷维的内积——⟨f, 1⟩。这和线性代数中的点积是同构的:都是"分量乘积累加"。',
      content: () => (
        <div className="section-content">
          <h2>5.1 从黎曼和到定积分</h2>
          <p><Formula latex="\int_a^b f(x)dx = \lim_{n \to \infty} \sum_{i=1}^{n} f(\xi_i) \Delta x_i" /></p>
          <p>将区间 [a,b] 划分成 n 份，每份取一点计算矩形面积，n→∞ 时矩形面积之和逼近曲线下方真实面积。</p>
          <div className="interactive-hint"><h4>🎮 交互</h4><p>拖动 n 滑块增大分区数，观察矩形和如何收敛。</p></div>
        </div>
      ),
    },
    {
      id: 'ch05-ftc', title: 'Newton-Leibniz (FTC)', titleZh: '牛顿-莱布尼茨公式',
      visual: FTCViz,
      laBridgeZh: 'FTC 说微分和积分互为逆运算——这在形式上与"线性变换和它的逆"完全一致。求导 d/dx 和积分 ∫ 是一对互逆的线性算子。',
      content: () => (
        <div className="section-content">
          <h2>5.2 微积分基本定理 (FTC)</h2>
          <div className="theorem-box">
            <h4>📐 牛顿-莱布尼茨公式</h4>
            <p><Formula latex="\int_a^b f(x)dx = F(b) - F(a)" /></p>
            <p>其中 <Formula latex="F'(x) = f(x)" />。</p>
          </div>
          <p>这一定理把<strong>微分和积分统一</strong>为互逆的运算——微积分因此得名。</p>
          <p>经济学应用：边际成本曲线下的面积 = 总可变成本。消费者剩余 = ∫ 需求曲线。</p>
        </div>
      ),
    },
  ],
};
