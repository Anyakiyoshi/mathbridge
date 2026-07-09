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
      content: () => (
        <div className="section-content">
          <h2>3.1 微分中值定理：存在一个人，他的速度和平均速度一样</h2>

          <div className="story-box">
            <h4>🚗 高速公路上的数学</h4>
            <p>你从北京开到天津，全程 120 公里，用时 1.2 小时。收费站记录显示平均速度 = 100 km/h。</p>
            <p><strong>交警给你开了超速罚单。</strong>你没有在任何测速点被抓到超速，但交警用数学告诉你：<em>一定存在某个时刻</em>，你的瞬时速度恰好等于平均速度 100 km/h——而且那个时刻你肯定超速了（限速 120 且平均 100，中间必然有超过 120 的时刻吗？不对...但思路是对的）。</p>
            <p>这不是猜测，是<strong>定理</strong>——拉格朗日中值定理保证的。</p>
          </div>

          <h3>从罗尔到拉格朗日：一个几何变换</h3>

          <div className="definition-box">
            <h4>📖 罗尔定理（Rolle's Theorem, 1691）</h4>
            <p>若 f 在 [a,b] 连续、(a,b) 可导，且 <strong>f(a)=f(b)</strong>，则 ∃ ξ∈(a,b) 使 f'(ξ)=0。</p>
            <p><strong>直觉：</strong>起点和终点一样高 → 中间必有至少一个水平切线（极大/极小值点）。</p>
          </div>

          <div className="insight-box highlight">
            <h4>🧮 几何/代数视角：罗尔→拉格朗日 = 旋转变换</h4>
            <p>罗尔定理要求两端等高。如果不等高怎么办？<strong>把函数"旋转"一下</strong>，让两端对齐。</p>
            <p>构造 g(x) = f(x) − [f(a) + (f(b)−f(a))/(b−a)·(x−a)]。g(a)=g(b)=0，对 g 用罗尔→存在 ξ 使 g'(ξ)=0→f'(ξ)=(f(b)−f(a))/(b−a)。</p>
            <p><strong>这个辅助函数的构造就是一次仿射变换</strong>——减去一个线性函数（割线）。这和你在线代中"平移坐标系使原点对齐"的思路完全一致。中值定理 = 罗尔定理 + 线性变换。</p>
          </div>

          <div className="theorem-box">
            <h4>📐 拉格朗日中值定理（Lagrange MVT）</h4>
            <p><Formula latex="\exists \xi \in (a,b):\quad f'(\xi) = \frac{f(b)-f(a)}{b-a}" /></p>
            <p>存在一点，该点的<strong>瞬时变化率 = 平均变化率</strong>。</p>
          </div>

          <div className="example-box">
            <h4>📝 例题1：验证拉格朗日定理</h4>
            <p>f(x) = x³−3x 在 [0,2] 上。f(0)=0, f(2)=2。平均斜率 = (2−0)/(2−0)=1。</p>
            <p>f'(x) = 3x²−3。令 3x²−3=1 → x²=4/3 → ξ = 2/√3 ≈ 1.155 ∈ (0,2)。</p>
            <p>在 ξ = 2/√3 处切线斜率恰好为 1。注意：有两个解但只有一个在区间内——定理只保证<strong>存在</strong>一个。</p>
          </div>

          <div className="example-box">
            <h4>📝 例题2：用中值定理证明不等式</h4>
            <p>证明：对 x&gt;0，有 ln(1+x) &lt; x。</p>
            <p>令 f(t)=ln(1+t) 在 [0,x] 上。f'(t)=1/(1+t)。由拉格朗日：</p>
            <p>ln(1+x)−ln(1) = f'(ξ)·(x−0) = x/(1+ξ) 其中 ξ∈(0,x)。</p>
            <p>由于 0&lt;ξ&lt;x，所以 1/(1+ξ) &lt; 1，故 x/(1+ξ) &lt; x。因此 ln(1+x) &lt; x。∎</p>
          </div>

          <h3>推论：导数的符号决定单调性</h3>
          <ul>
            <li>f'(x) &gt; 0 在区间上 → f 严格递增（用 MVT 证明）</li>
            <li>f'(x) = 0 在区间上 → f 是常值函数</li>
            <li>f'(x) &lt; 0 在区间上 → f 严格递减</li>
          </ul>
          <p>这三个推论是<strong>所有最优化理论</strong>的根基。你看到的"令导数等于0→求极值"流程，其合法性就来自中值定理。</p>

          <div className="example-box">
            <h4>📊 经济学案例：成本函数的单调性</h4>
            <p>短期成本函数 C(Q) 的导数 MC(Q)=C'(Q) 是边际成本。若对所有 Q&gt;0 有 MC(Q)&gt;0，由 MVT 推论，C(Q) 严格递增——多生产一定导致总成本上升。</p>
            <p>这个"显然"的结论在数学上需要 MVT 保证：C(Q_2)−C(Q_1) = MC(ξ)·(Q_2−Q_1) &gt; 0（当 Q_2&gt;Q_1）。</p>
          </div>

          <h3>柯西中值定理——拉格朗日的参数化版本</h3>
          <div className="theorem-box">
            <h4>📐 柯西中值定理</h4>
            <p><Formula latex="\frac{f(b)-f(a)}{g(b)-g(a)} = \frac{f'(\xi)}{g'(\xi)}" />，其中 g'(x) ≠ 0。</p>
          </div>
          <p>拉格朗日是 g(x)=x 的特殊情况。柯西 MVT 是洛必达法则的<strong>理论基础</strong>。把 f 和 g 看作参数曲线的两个分量，定理说：<strong>参数曲线上存在一点，其切线方向与割线方向平行</strong>——这是拉格朗日 MVT 在参数曲线上的几何推广。</p>

          <PracticeProblem context="第三章 微分中值定理 - 罗尔定理与拉格朗日中值定理" />
        </div>
      ),
    },
    {
      id: 'ch03-lhopital', title: "L'Hôpital & Taylor's Theorem", titleZh: '洛必达法则 & 泰勒中值定理',
      content: () => (
        <div className="section-content">
          <h2>3.2 洛必达法则——用导数算极限</h2>

          <div className="story-box">
            <h4>🔢 0/0 困境</h4>
            <p>lim(x→0) sin x / x = ? 分子分母都趋于 0——直接代入没有意义。但直觉上 sin x 和 x 在 0 附近"长得差不多"，比值应该趋近于 1。</p>
            <p>洛必达法则把这个直觉精确化了：<strong>0/0 型的极限 = 分子分母各自导数的极限</strong>。因为导数刻画了函数在一点附近的<strong>线性近似</strong>，而线性函数的比值就是斜率的比值。</p>
          </div>

          <div className="insight-box highlight">
            <h4>🧮 为什么洛必达法则是"线性近似"的推论？</h4>
            <p>在 x→a 时：f(x)≈f(a)+f'(a)(x−a)=f'(a)(x−a)（因为 f(a)=0），同样 g(x)≈g'(a)(x−a)。</p>
            <p>所以 f(x)/g(x) ≈ [f'(a)(x−a)]/[g'(a)(x−a)] = f'(a)/g'(a)。</p>
            <p>洛必达法则的本质：<strong>把两个函数的比值，换成它们的最佳线性近似的比值</strong>。这就是为什么导数和极限在这里交汇——导数是局部线性化工具。</p>
          </div>

          <div className="theorem-box">
            <h4>📐 洛必达法则（完整版）</h4>
            <p><strong>0/0 型：</strong>若 lim f(x)=lim g(x)=0，且极限 lim f'(x)/g'(x) 存在（或为无穷），则 <Formula latex="\lim\frac{f(x)}{g(x)} = \lim\frac{f'(x)}{g'(x)}" />。</p>
            <p><strong>∞/∞ 型：</strong>同样适用，条件改为 lim f(x)=lim g(x)=∞。</p>
            <p><strong>使用前检查：</strong>必须是 0/0 或 ∞/∞ 型！0·∞、∞−∞、1^∞、∞^0、0^0 等需要先变形。</p>
          </div>

          <h3>不定式分类与策略</h3>
          <table className="stats-table">
            <thead><tr><th>类型</th><th>策略</th><th>例子</th></tr></thead>
            <tbody>
              <tr><td>0/0</td><td>直接洛必达</td><td>lim sin x/x</td></tr>
              <tr><td>∞/∞</td><td>直接洛必达</td><td>lim e^+/x</td></tr>
              <tr><td>0·∞</td><td>改写为 0/(1/∞) 或 ∞/(1/0)</td><td>lim x·ln x (x→0^+)</td></tr>
              <tr><td>∞−∞</td><td>通分或有理化</td><td>lim (1/x − 1/sin x)</td></tr>
              <tr><td>1^∞, 0^0, ∞^0</td><td>取对数化为 0·∞</td><td>lim (1+1/x)^+</td></tr>
            </tbody>
          </table>

          <div className="example-box">
            <h4>📝 例题1：经典 0/0</h4>
            <p>lim(x→0) (e^+−1)/x。f(0)=g(0)=0 ✓。f'(x)=e^+, g'(x)=1。lim f'/g' = e^0/1 = 1。</p>
          </div>

          <div className="example-box">
            <h4>📝 例题2：需要多次洛必达</h4>
            <p>lim(x→0) (x−sin x)/x³。第一次洛必达 → (1−cos x)/(3x²) 仍是 0/0。</p>
            <p>第二次洛必达 → sin x/(6x) → 用重要极限 = 1/6。</p>
            <p><strong>诀窍：</strong>每次洛必达后都要检查是否仍是 0/0 或 ∞/∞，如果不是就不能再用！</p>
          </div>

          <div className="example-box">
            <h4>📝 例题3：洛必达失效的情况</h4>
            <p>lim(x→∞) (x+sin x)/x。用洛必达 → (1+cos x)/1，极限不存在！但原极限 = lim(1+sin x/x) = 1。</p>
            <p><strong>教训：</strong>洛必达法则要求 lim f'/g' <strong>存在</strong>。如果导数比的极限振荡不存在，法则不能用——但原极限可能仍存在。这时需要别的方法。</p>
          </div>

          <div className="example-box">
            <h4>📊 经济学案例：CES 生产函数的替代弹性</h4>
            <p>CES 生产函数当替代弹性 ρ→0 时收敛到 Cobb-Douglas。这个极限涉及 0/0 型不定式，需要用洛必达法则（或等价的对数变换）计算：</p>
            <p>lim(ρ→0) [αK^ρ+(1−α)L^ρ]^(1/ρ) = K^α L^(1−α)。</p>
            <p>这就是为什么 Cobb-Douglas 是 CES 的特例——不是直觉，是洛必达法则的结论。</p>
          </div>

          <h3>泰勒中值定理——洛必达的推广</h3>
          <p>洛必达法则只能比较<strong>一阶</strong>逼近。泰勒中值定理给出了<strong>任意阶</strong>逼近的精确误差界：</p>
          <div className="theorem-box">
            <h4>📐 泰勒中值定理（拉格朗日余项）</h4>
            <p><Formula latex="f(x) = \sum_{k=0}^{n} \frac{f^{(k)}(a)}{k!}(x-a)^k + \frac{f^{(n+1)}(\xi)}{(n+1)!}(x-a)^{n+1}" /></p>
            <p>余项 R_n 告诉你<strong>用 n 次多项式逼近的误差不会超过多少</strong>——这个误差界是由 n+1 阶导数在区间内某点的值决定的。</p>
          </div>

          <div className="insight-box highlight">
            <h4>🧮 泰勒中值定理 = 高维线性近似的阶梯</h4>
            <p>一阶泰勒 = 线性近似（导数 = 1×1 矩阵）。二阶泰勒 = 线性项 + 二次型修正（Hessian）。每加一阶，逼近精度提高一个数量级——这是在<strong>多项式基 &#123;1, x, x^2, ...&#125; 中逐步增加坐标分量</strong>。</p>
            <p>泰勒中值定理保证了这种逼近的合法性和误差可控性——它就像是无穷维向量空间中的"投影定理"：用前 n 个基向量张成的子空间去逼近目标函数。</p>
          </div>

          <PracticeProblem context="第三章 微分中值定理 - 洛必达法则与泰勒中值定理" />
        </div>
      ),
    },
  ],
};
