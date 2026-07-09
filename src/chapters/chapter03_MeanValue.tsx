import type { Chapter } from '../store/useStore';
import Formula from '../components/Formula';
import { RolleLagrangeViz } from './visuals/RolleLagrange';
import PracticeProblem from '../components/PracticeProblem';

export const chapter03: Chapter = {
  id: 'ch03', number: 3, title: 'Mean Value Theorems', titleZh: '微分中值定理', volume: 1,
  sections: [
    {
      id: 'ch03-mvt', title: "Rolle & Lagrange's MVT", titleZh: '罗尔定理 & 拉格朗日中值定理',
      visual: RolleLagrangeViz,
      laBridgeZh: '中值定理保证了"存在性"——这是一种典型的分析学工具。在数值线性代数中，许多迭代方法（如共轭梯度法）也依赖类似的"存在性"保证。',
      content: () => (
        <div className="section-content">
          <h2>3.1 微分中值定理</h2>
          <div className="theorem-box">
            <h4>📐 罗尔定理</h4>
            <p>若 f 在 [a,b] 连续，在 (a,b) 可导，且 f(a)=f(b)，则 ∃ ξ∈(a,b) 使得 f'(ξ)=0。</p>
          </div>
          <div className="theorem-box">
            <h4>📐 拉格朗日中值定理</h4>
            <p>若 f 在 [a,b] 连续，在 (a,b) 可导，则 ∃ ξ∈(a,b) 使得</p>
            <p><Formula latex="f'(\xi) = \frac{f(b) - f(a)}{b - a}" /></p>
            <p>某点的切线斜率 = 割线斜率。这是<strong>微分学最重要的定理之一</strong>。</p>
          </div>
          <h3>推论</h3>
          <ul>
            <li>若 f'(x) ≡ 0，则 f 为常值函数</li>
            <li>若 f'(x) &gt; 0，则 f 严格递增（经济学中"边际 &gt; 0"的理论基础）</li>
          </ul>

          <PracticeProblem context="第三章 微分中值定理 - 罗尔定理与拉格朗日中值定理" />
        </div>
      ),
    },
    {
      id: 'ch03-lhopital', title: "L'Hôpital & Taylor's Theorem", titleZh: '洛必达法则 & 泰勒中值定理',
      content: () => (
        <div className="section-content">
          <h2>3.2 洛必达法则</h2>
          <p>用于解决 <Formula latex="\frac{0}{0}" /> 或 <Formula latex="\frac{\infty}{\infty}" /> 型不定式。</p>
          <div className="theorem-box">
            <h4>📐 洛必达法则</h4>
            <p><Formula latex="\lim \frac{f(x)}{g(x)} = \lim \frac{f'(x)}{g'(x)}" /></p>
          </div>
          <h3>泰勒中值定理</h3>
          <p>拉格朗日余项：<Formula latex="R_n(x) = \frac{f^{(n+1)}(\xi)}{(n+1)!}(x-a)^{n+1}" /></p>
          <p>柯西余项和皮亚诺余项各有用途。泰勒定理是分析函数局部行为的核心工具。</p>
        </div>
      ),
    },
  ],
};
