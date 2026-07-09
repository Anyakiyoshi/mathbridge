import type { Chapter } from '../store/useStore';
import Formula from '../components/Formula';
import { RiemannViz } from './visuals/RiemannSum';
import { FTCViz } from './visuals/FTC';
import PracticeProblem from '../components/PracticeProblem';

export const chapter05: Chapter = {
  id: 'ch05', number: 5, title: 'Definite Integrals', titleZh: '定积分', volume: 1,
  sections: [
    {
      id: 'ch05-riemann', title: 'Riemann Sum = Discrete Inner Product', titleZh: '黎曼和——离散的内积',
      visual: RiemannViz,
      content: () => (
        <div className="section-content">
          <h2>5.1 积分 = 无穷维的内积</h2>

          <div className="story-box">
            <h4>🧮 从点积到积分</h4>
            <p>在线性代数中，两个向量的内积是分量乘积累加：⟨a, b⟩ = a₁b₁ + a₂b₂ + ... + aₙbₙ。</p>
            <p>现在把"分量"换成"函数在每一点的值"——由于点是连续的、有无穷多个，求和必须变成<strong>积分</strong>。</p>
            <p>函数 f 在区间 [a,b] 上的"总和" = 把每个点的 f(x)·dx 累加起来。这个累加就是<strong>定积分</strong>。</p>
          </div>

          <div className="definition-box">
            <h4>📖 定积分定义</h4>
            <p><Formula latex="\int_a^b f(x)\,dx = \lim_{\max\Delta x_i\to 0} \sum_{i=1}^{n} f(\xi_i)\Delta x_i" /></p>
          </div>

          <div className="insight-box highlight">
            <h4>🧮 代数视角：黎曼和 = 内积</h4>
            <p>把区间切成 n 段，函数值组成向量 <strong>f</strong> = (f(ξ₁), ..., f(ξₙ))，每段的宽度组成向量 <strong>Δx</strong> = (Δx₁, ..., Δxₙ)。</p>
            <p>黎曼和 = <strong>f</strong>·<strong>Δx</strong> = Σ f(ξᵢ)Δxᵢ —— 这就是两个向量的<strong>点积</strong>。</p>
            <p>当 n→∞，这就是<strong>无穷维的内积</strong>：⟨f, 1⟩ = ∫ f(x)·1·dx。把 f 和常函数 1 做内积就是求面积。同样，⟨f, x⟩ = ∫ xf(x)dx 就是 f 对 x 的一阶矩（重心）。</p>
          </div>

          <div className="example-box">
            <h4>📊 经济学案例：基尼系数</h4>
            <p>洛伦兹曲线 L(p) 表示最穷 p% 的人口拥有的收入比例。基尼系数 G = 1 − 2∫₀¹ L(p) dp。</p>
            <p>这个积分就是洛伦兹曲线下的面积——理解为 L 和常数 1 的内积。G 越大，不平等越严重。</p>
          </div>

          <PracticeProblem context="第五章 定积分 - 黎曼和与离散内积" />
        </div>
      ),
    },
    {
      id: 'ch05-ftc', title: 'FTC: Differentiation & Integration are Inverse Operators', titleZh: 'FTC——微分与积分互为逆算子',
      visual: FTCViz,
      content: () => (
        <div className="section-content">
          <h2>5.2 牛顿-莱布尼茨公式</h2>

          <div className="story-box">
            <h4>🔄 互逆的线性变换</h4>
            <p>在线性代数中，如果矩阵 A 的逆是 A⁻¹，那么 A(A⁻¹x) = x。微分算子 D 和积分算子 ∫ 也满足类似的关系：</p>
            <p>D(∫ₐˣ f(t)dt) = f(x) —— 先积分再求导，回到原函数。</p>
            <p>∫ₐᵇ f'(x)dx = f(b)−f(a) —— 先求导再积分，回到原函数（差边界值）。</p>
            <p>D 和 ∫ 是<strong>互逆的线性算子</strong>——这就是 FTC 的代数本质。</p>
          </div>

          <div className="theorem-box">
            <h4>📐 微积分基本定理</h4>
            <p><strong>形式一：</strong>d/dx ∫ₐˣ f(t)dt = f(x)。即积分上限函数的导数等于被积函数。</p>
            <p><strong>形式二：</strong>∫ₐᵇ f(x)dx = F(b)−F(a)，其中 F'=f。即定积分等于原函数在端点的差。</p>
          </div>

          <div className="insight-box highlight">
            <h4>🧮 代数视角：积分 = 微分算子的逆</h4>
            <p>如果把"求导"看作一个线性变换 D: C¹→C⁰，它把每个可导函数映射到它的导函数。这个变换有<strong>核</strong>（kernel）：ker(D) = {常值函数}——因为只有常函数的导数是零。</p>
            <p>"不定积分"∫ f dx = F + C 中的 +C，反映的正是 D 的核是一维的。这和 Ax=b 的解 = 特解 + 齐次解 的结构完全一致。</p>
            <p>FTC 说：在商掉核之后，D 和 ∫ 互为逆映射。这是泛函分析中 Fredholm 二择一定理在一维的原型。</p>
          </div>

          <PracticeProblem context="第五章 定积分 - FTC与逆算子" />
        </div>
      ),
    },
  ],
};
