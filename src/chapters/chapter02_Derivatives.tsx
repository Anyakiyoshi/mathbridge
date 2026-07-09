import type { Chapter } from '../store/useStore';
import Formula from '../components/Formula';
import { TangentViz } from './visuals/TangentSecant';
import { ChainRuleViz } from './visuals/ChainRule';
import { HigherDerivViz } from './visuals/HigherDerivatives';
import PracticeProblem from '../components/PracticeProblem';

export const chapter02: Chapter = {
  id: 'ch02', number: 2, title: 'Derivatives & Differentials', titleZh: '导数与微分', volume: 1,
  sections: [
    {
      id: 'ch02-tangent', title: 'Derivative = Linear Approximation', titleZh: '导数——最佳的线性逼近',
      visual: TangentViz,
      content: () => (
        <div className="section-content">
          <h2>2.1 导数：用直线替代曲线</h2>

          <div className="story-box">
            <h4>🔬 放大的艺术</h4>
            <p>把一条光滑曲线放到显微镜下一直放大——放大到足够大时，曲线看起来就是<strong>一条直线</strong>。</p>
            <p>这就是导数的本质：<strong>在一点附近，用最简单的线性函数来替代复杂的非线性函数</strong>。</p>
          </div>

          <h3>线性逼近 = 微积分的核心思想</h3>
          <p>给定函数 f(x) 和点 x₀，我们想找一个<strong>线性函数</strong> L(Δx) = k·Δx，使得：</p>
          <p><Formula latex="f(x_0 + \Delta x) \approx f(x_0) + k \cdot \Delta x" /></p>
          <p>当 Δx → 0 时误差也 → 0。这个 k 就是<strong>导数</strong> f'(x₀)。</p>

          <div className="definition-box">
            <h4>📖 定义（线性逼近视角）</h4>
            <p>f 在 x₀ 处可导 ⟺ 存在常数 k，使得</p>
            <p><Formula latex="f(x_0+\Delta x) = f(x_0) + k\cdot\Delta x + o(\Delta x)" /></p>
            <p>其中 o(Δx) 是比 Δx 更高阶的无穷小。这个 k 记作 f'(x₀)。</p>
          </div>

          <div className="insight-box highlight">
            <h4>🧮 代数视角</h4>
            <p>导数 f'(x₀) 是一个 <strong>1×1 的矩阵</strong>——它把输入的变化量 Δx（一个标量）线性地映射为输出的变化量 Δy ≈ f'(x₀)·Δx。</p>
            <p>在一维情况下这看起来平凡，但思想是普适的：<strong>导数 = 线性变换</strong>。多元情况下它就是一个 m×n 的 Jacobian 矩阵。所有微积分的第一章都始于同一个思想——用线性的东西逼近非线性的东西。</p>
          </div>

          <h3>割线 → 切线的几何语言</h3>
          <p>连接 (x₀, f(x₀)) 和 (x₀+Δx, f(x₀+Δx)) 的割线斜率 = [f(x₀+Δx)−f(x₀)]/Δx。</p>
          <p>随着 Δx → 0，割线旋转逼近于<strong>切线</strong>。切线是曲线在该点的<strong>最佳线性近似</strong>。</p>

          <div className="example-box">
            <h4>📝 例：f(x)=x^2 在 x₀=1 处</h4>
            <p>f'(1) = lim [ (1+Δx)² − 1 ] / Δx = lim (2Δx + Δx^2)/Δx = 2。</p>
            <p>线性近似：f(1+Δx) ≈ 1 + 2Δx。当 Δx=0.1 时，真实值 1.21，近似值 1.2——误差仅 0.01。</p>
            <p>这就是导数的意义：给你一个<strong>便携的简化模型</strong>，在局部好用。</p>
          </div>

          <PracticeProblem
            context="第二章 导数与微分 - 导数作为线性逼近"
            question="用线性逼近估计 √4.1。提示：令 f(x)=√x，在 x₀=4 处展开，f(4)=2，f'(4)=1/(2√4)=1/4。"
            hint="√4.1 ≈ f(4) + f'(4)·0.1 = 2 + (1/4)·0.1 = 2.025。真实值 ≈ 2.0248。"
          />
        </div>
      ),
    },
    {
      id: 'ch02-chain', title: 'The Chain Rule = Matrix Multiplication', titleZh: '链式法则 = 矩阵乘法',
      visual: ChainRuleViz,
      content: () => (
        <div className="section-content">
          <h2>2.2 链式法则：线性变换的复合</h2>

          <div className="story-box">
            <h4>🎯 为什么链式法则是乘？</h4>
            <p>设 y = f(u), u = g(x)。x 变一点 → u 变一点 → y 变一点。</p>
            <p>x→u 的线性近似：Δu ≈ g'(x)·Δx。u→y 的线性近似：Δy ≈ f'(u)·Δu。</p>
            <p><strong>复合的线性近似 = 两个线性近似的复合：Δy ≈ f'(u)·g'(x)·Δx。</strong></p>
            <p>两个线性变换的复合 = 矩阵相乘。在一维中就是普通的数乘，所以 dy/dx = (dy/du)·(du/dx)。</p>
          </div>

          <div className="insight-box highlight">
            <h4>🧮 代数视角</h4>
            <p>链式法则 (f∘g)'(x) = f'(g(x))·g'(x) 就是 <strong>Jacobian 矩阵的乘法</strong>。</p>
            <p>如果 g: ℝᵐ→ℝⁿ，f: ℝⁿ→ℝᵖ，则 D(f∘g) = Df·Dg（p×n 矩阵 × n×m 矩阵 = p×m 矩阵）。</p>
            <p>这就是为什么链式法则的形式如此优雅——它不是在"背公式"，而是在做<strong>矩阵乘法</strong>。</p>
          </div>

          <div className="example-box">
            <h4>📊 经济学案例：税收归宿</h4>
            <p>设需求量 Q 是含税价格 P 的函数：Q = 100 − 2P。含税价格 P 是税率 t 的函数：P = 10 + 0.6t（税负 60% 转嫁给消费者）。</p>
            <p>dQ/dt = (dQ/dP)·(dP/dt) = (−2)·(0.6) = −1.2。</p>
            <p>税率每提高 1 元，需求量下降 1.2 件。第一项 −2 是需求的价格弹性（纯经济因素），第二项 0.6 是税负转嫁率（制度因素）。链式法则将它们<strong>解耦为可独立分析的因素</strong>——这就是线性代数中"矩阵分解"的思想。</p>
          </div>

          <PracticeProblem context="第二章 导数与微分 - 链式法则" />
        </div>
      ),
    },
    {
      id: 'ch02-higher', title: 'Taylor Series = Change of Basis', titleZh: '泰勒公式——基变换',
      visual: HigherDerivViz,
      content: () => (
        <div className="section-content">
          <h2>2.3 泰勒公式：把函数写成多项式的线性组合</h2>

          <div className="story-box">
            <h4>📐 坐标变换</h4>
            <p>在平面上，同一个向量可以在不同基下表示：v = x·e₁ + y·e₂，也可以 v = a·u₁ + b·u₂。</p>
            <p><strong>泰勒公式做的事情一模一样</strong>——把函数 f(x) 用"多项式基" &#123;1, x, x^2, x^3, ...&#125; 表示出来：</p>
            <p><Formula latex="f(x) = f(a)\cdot 1 + f'(a)\cdot (x-a) + \frac{f''(a)}{2!}\cdot (x-a)^2 + \cdots" /></p>
            <p>系数 (f(a), f'(a), f''(a)/2!, ...) 就是函数在多项式基下的<strong>坐标</strong>。</p>
          </div>

          <div className="insight-box highlight">
            <h4>🧮 代数视角</h4>
            <p>考虑无穷维向量空间 V = &#123;光滑函数&#125;。多项式 &#123;1, x, x^2, ...&#125; 是 V 的一组基（在解析函数子空间中是线性无关的）。</p>
            <p>泰勒系数 = f⁽ⁿ⁾(a)/n! 就是 f 在这组基下的<strong>坐标</strong>。换一组基（比如三角函数基 &#123;1, sin nx, cos nx&#125;），就是傅里叶级数。</p>
            <p><strong>同一个函数，不同基下的不同坐标——这就是线性代数的核心思想，直接推广到无穷维。</strong></p>
          </div>

          <h3>一阶泰勒 = 线性逼近，二阶泰勒 = 二次型逼近</h3>
          <p>一阶：f(x) ≈ f(a) + f'(a)(x−a) → 切线（仿射函数）</p>
          <p>二阶：f(x) ≈ f(a) + f'(a)(x−a) + ½f''(a)(x−a)² → 抛物线（二次型）</p>
          <p>二阶项告诉你曲线是"向上弯"还是"向下弯"——这在优化中决定了极值点是极大还是极小。这正是 Hessian 矩阵的正定性判据在 1D 的原型。</p>

          <PracticeProblem context="第二章 导数与微分 - 泰勒展开与基变换" />
        </div>
      ),
    },
  ],
};
