import type { Chapter } from '../store/useStore';
import Formula from '../components/Formula';
import { EpsilonDeltaViz } from './visuals/EpsilonDelta';
import { LimitLawsViz } from './visuals/LimitLaws';
import { ContinuityViz } from './visuals/Continuity';

export const chapter01: Chapter = {
  id: 'ch01',
  number: 1,
  title: 'Functions & Limits',
  titleZh: '函数与极限',
  volume: 1,
  sections: [
    // ── 1.1 ──
    {
      id: 'ch01-limits',
      title: 'Limit Definition (ε-δ)',
      titleZh: '极限的 ε-δ 定义',
      visual: EpsilonDeltaViz,
      laBridgeZh: '极限概念是"无限逼近"的严格描述。注意这里的逻辑结构——对任意 ε>0, 存在 δ>0——这其实就是函数空间中的一种"距离"关系。到了泛函分析你会发现,ε-δ 定义本质上就是度量空间中的收敛。',
      content: () => (
        <div className="section-content">
          <h2>1.1 极限的 ε-δ 定义</h2>
          <p>
            极限是微积分的基石。直觉上，<Formula latex="\lim_{x \to x_0} f(x) = L" />{' '}
            意味着当 <Formula latex="x" /> 无限接近 <Formula latex="x_0" /> 时，
            <Formula latex="f(x)" /> 无限接近 <Formula latex="L" />。
          </p>

          <div className="definition-box">
            <h4>📖 定义（ε-δ 语言）</h4>
            <p>
              <Formula latex="\forall \varepsilon > 0,\ \exists \delta > 0" />，
              使得当 <Formula latex="0 < |x - x_0| < \delta" /> 时，
              恒有 <Formula latex="|f(x) - L| < \varepsilon" />。
            </p>
          </div>

          <h3>几何解释</h3>
          <p>
            ε 是 <strong>函数值</strong>的允许误差范围——你希望 <Formula latex="f(x)" /> 离 <Formula latex="L" /> 多近？
            δ 是 <strong>自变量</strong>的允许偏离范围——需要让 <Formula latex="x" /> 离 <Formula latex="x_0" /> 多近来保证？
          </p>
          <p>
            <strong>关键逻辑</strong>：你先提出挑战（任意 ε），我再给出对策（找到 δ）。
            无论你的 ε 多小，我总能找到 δ 使函数值落在误差范围内。
          </p>

          <div className="interactive-hint">
            <h4>🎮 交互演示</h4>
            <p>在上方可视化中拖动 <strong>ε 滑块</strong>，观察对应的 δ 范围如何变化。
            你能看到：ε 越小，需要的 δ 也越小——这就是"逼近"的严格含义。</p>
          </div>

          <h3>典型例题</h3>
          <div className="example-box">
            <p><strong>证明</strong> <Formula latex="\lim_{x \to 2} (3x - 1) = 5" /></p>
            <p><strong>证：</strong>任给 <Formula latex="\varepsilon > 0" />，</p>
            <p>
              令 <Formula latex="\delta = \varepsilon / 3" />。
              当 <Formula latex="0 < |x-2| < \delta" /> 时，
              <Formula latex="|(3x-1) - 5| = |3x - 6| = 3|x-2| < 3\delta = \varepsilon" />
            </p>
            <p>这就完成了证明。注意线性函数中 δ 和 ε 的简单正比关系。</p>
          </div>
        </div>
      ),
    },

    // ── 1.2 ──
    {
      id: 'ch01-laws',
      title: 'Limit Laws',
      titleZh: '极限运算法则 & 夹逼准则',
      visual: LimitLawsViz,
      laBridgeZh: '极限的四则运算本质上与向量空间的线性运算同构——函数空间也是一个向量空间,其上的"加"和"数乘"就是逐点运算。夹逼准则则暗示了"序结构",这在泛函中对应着序 Banach 空间。',
      content: () => (
        <div className="section-content">
          <h2>1.2 极限运算法则</h2>

          <div className="theorem-box">
            <h4>📐 四则运算法则</h4>
            <p>若 <Formula latex="\lim f(x) = A" />，<Formula latex="\lim g(x) = B" />，则：</p>
            <ul>
              <li><Formula latex="\lim [f(x) \pm g(x)] = A \pm B" /></li>
              <li><Formula latex="\lim [f(x) \cdot g(x)] = A \cdot B" /></li>
              <li><Formula latex="\lim \frac{f(x)}{g(x)} = \frac{A}{B}" /> （<Formula latex="B \neq 0" />）</li>
            </ul>
          </div>

          <h3>夹逼准则（三明治定理）</h3>
          <p>
            若在 <Formula latex="x_0" /> 附近，<Formula latex="g(x) \leq f(x) \leq h(x)" />，
            且 <Formula latex="\lim g(x) = \lim h(x) = L" />，则 <Formula latex="\lim f(x) = L" />。
          </p>

          <div className="example-box">
            <p><strong>经典应用：</strong></p>
            <p><Formula latex="\lim_{x \to 0} \frac{\sin x}{x} = 1" /></p>
            <p>利用几何不等式 <Formula latex="\cos x < \frac{\sin x}{x} < 1" /> 和夹逼准则即可证明。</p>
          </div>

          <h3>两个重要极限</h3>
          <ol>
            <li><Formula latex="\displaystyle\lim_{x \to 0} \frac{\sin x}{x} = 1" /></li>
            <li><Formula latex="\displaystyle\lim_{x \to \infty} \left(1 + \frac{1}{x}\right)^x = e" /></li>
          </ol>
        </div>
      ),
    },

    // ── 1.3 ──
    {
      id: 'ch01-continuity',
      title: 'Continuity',
      titleZh: '函数的连续性',
      visual: ContinuityViz,
      laBridgeZh: '连续函数构成一个向量空间 C(X)! 线性变换（矩阵）代表了一种"离散的连续":A·x 的定义域和值域都是有限维空间。连续性和线性性的交汇产生了泛函分析。',
      content: () => (
        <div className="section-content">
          <h2>1.3 函数的连续性</h2>

          <div className="definition-box">
            <h4>📖 定义</h4>
            <p>
              函数 <Formula latex="f(x)" /> 在 <Formula latex="x_0" /> 处连续 ⇔{' '}
              <Formula latex="\lim_{x \to x_0} f(x) = f(x_0)" />
            </p>
            <p>翻译：极限值等于函数值。三个条件缺一不可——</p>
            <ol>
              <li><Formula latex="f(x_0)" /> 有定义</li>
              <li><Formula latex="\lim_{x \to x_0} f(x)" /> 存在</li>
              <li>两者相等</li>
            </ol>
          </div>

          <h3>间断点分类</h3>
          <div className="table-wrapper">
            <table className="stats-table">
              <thead><tr><th>类型</th><th>特征</th><th>例子</th></tr></thead>
              <tbody>
                <tr><td>第一类（可去）</td><td>极限存在 ≠ 函数值</td><td><Formula latex="\frac{\sin x}{x}" /> 在 x=0</td></tr>
                <tr><td>第一类（跳跃）</td><td>左右极限存在但不相等</td><td>符号函数 sgn(x)</td></tr>
                <tr><td>第二类（无穷）</td><td>极限趋于无穷</td><td><Formula latex="\frac{1}{x}" /> 在 x=0</td></tr>
                <tr><td>第二类（振荡）</td><td>极限不存在（振荡）</td><td><Formula latex="\sin\frac{1}{x}" /> 在 x=0</td></tr>
              </tbody>
            </table>
          </div>

          <div className="insight-box highlight">
            <h4>💡 线性代数关联</h4>
            <p>
              连续函数集合 <Formula latex="C[a,b]" /> 构成一个<strong>无限维向量空间</strong>！
              这和我们之前在泰勒级数中看到的"基"概念一脉相承——
              多项式的基 <Formula latex="\{1, x, x^2, \ldots\}" /> 正是 <Formula latex="C[a,b]" /> 中的一组线性无关向量。
            </p>
          </div>
        </div>
      ),
    },
  ],
};
