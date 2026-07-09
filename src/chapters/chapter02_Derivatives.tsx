import type { Chapter } from '../store/useStore';
import Formula from '../components/Formula';
import { TangentViz } from './visuals/TangentSecant';
import { ChainRuleViz } from './visuals/ChainRule';
import { HigherDerivViz } from './visuals/HigherDerivatives';

export const chapter02: Chapter = {
  id: 'ch02', number: 2, title: 'Derivatives & Differentials', titleZh: '导数与微分', volume: 1,
  sections: [
    {
      id: 'ch02-tangent', title: 'Definition of Derivative', titleZh: '导数定义 — 从割线到切线',
      visual: TangentViz,
      laBridgeZh: '导数 f\'(x₀) 是一个 1×1 矩阵——把 Δx 线性映射到 Δy。微分 df = f\'(x₀)dx 是一个线性映射。这就是 Jacobian 矩阵在 1D 的特例——所有多元微积分都是这个思想的推广。',
      content: () => (
        <div className="section-content">
          <h2>2.1 导数定义</h2>

          <div className="story-box">
            <h4>🚗 车速表的秘密</h4>
            <p>你开车从北京到天津，全程 120 公里，用了 1.5 小时。平均速度 = 80 km/h。但车速表上显示的瞬时速度一直在变——80、95、110、60……车速表到底在测什么？</p>
            <p>它在测<strong>瞬时速度</strong>：在一段<strong>无穷短</strong>的时间内，位移与时间的比值。这就是导数。</p>
            <p>牛顿发明微积分的原始动机，就是描述运动物体的瞬时速度。</p>
          </div>

          <h3>从平均变化率到瞬时变化率</h3>
          <p>函数 f(x) 在区间 [x₀, x₀+Δx] 上的<strong>平均变化率</strong>：<Formula latex="\frac{f(x_0+\Delta x) - f(x_0)}{\Delta x}" /></p>
          <p>让 Δx → 0，平均变化率的极限就是<strong>瞬时变化率</strong>——导数。</p>

          <div className="definition-box">
            <h4>📖 导数定义</h4>
            <p><Formula latex="f'(x_0) = \lim_{\Delta x \to 0} \frac{f(x_0 + \Delta x) - f(x_0)}{\Delta x}" /></p>
            <p>若该极限存在，称 f 在 x₀ 处<strong>可导</strong>。</p>
          </div>

          <div className="example-box">
            <h4>💰 经济学核心：边际成本</h4>
            <p>设总成本函数 TC(Q) = 100 + 5Q + 0.1Q²（固定成本 100，线性成本 5Q，递增的边际成本 0.2Q）。</p>
            <p>边际成本 MC = TC'(Q) = 5 + 0.2Q。当 Q=10 时，MC = 7——第 10 件产品的额外成本约 7 元。</p>
            <p><strong>边际成本递增</strong>（MC' = 0.2 &gt; 0）是经济学的基本假设——生产越多，每多生产一件的成本越高（报酬递减）。这来自二阶导数为正。</p>
          </div>

          <h3>三种等价记号</h3>
          <table className="stats-table">
            <thead><tr><th>记号</th><th>提出者</th><th>适用场景</th></tr></thead>
            <tbody>
              <tr><td>f'(x)</td><td>Lagrange</td><td>简洁，单变量</td></tr>
              <tr><td>dy/dx</td><td>Leibniz</td><td>直观，链式法则</td></tr>
              <tr><td>ẏ</td><td>Newton</td><td>物理（对时间求导）</td></tr>
            </tbody>
          </table>

          <div className="misconception-box">
            <h4>⚠ 常见误区</h4>
            <p><strong>"导数是切线的斜率，仅此而已"</strong> —— 不对。导数是线性变换的矩阵表示。在一维中碰巧是一个数，在多元中就是 Jacobian 矩阵。理解这一点，多元微积分就自然了。</p>
            <p><strong>"可导就是光滑"</strong> —— 不完全是。可导意味着没有尖角，但 f'(x) 本身不一定连续。存在处处可导但导数不连续的函数。</p>
          </div>
        </div>
      ),
    },
    {
      id: 'ch02-chain', title: 'Derivative Rules & Chain Rule', titleZh: '求导法则 & 链式法则',
      visual: ChainRuleViz,
      laBridgeZh: '链式法则 d/dx f(g(x)) = f\'(g(x))·g\'(x) 是矩阵乘法的 1D 版本。多元推广：D(f∘g) = Df·Dg，其中 Df 和 Dg 是 Jacobian 矩阵，乘法是矩阵乘法。',
      content: () => (
        <div className="section-content">
          <h2>2.2 求导法则</h2>

          <div className="theorem-box">
            <h4>📐 基本法则</h4>
            <ul>
              <li>(u ± v)' = u' ± v'</li>
              <li>(uv)' = u'v + uv'（莱布尼茨法则）</li>
              <li>(u/v)' = (u'v − uv')/v²（v ≠ 0）</li>
              <li>(Cu)' = C·u'（常数可提出）</li>
            </ul>
          </div>

          <h3>🔗 链式法则</h3>
          <p><Formula latex="\frac{dy}{dx} = \frac{dy}{du} \cdot \frac{du}{dx}" /></p>
          <p>复合函数的导数 = 外层导数 × 内层导数。</p>

          <div className="example-box">
            <h4>📊 经济学案例：需求的价格弹性</h4>
            <p>需求量 Q 是价格 P 的函数：Q = Q(P)。但价格受税收 t 影响：P = P(t)。</p>
            <p>想知道税收对需求量的影响——链式法则：dQ/dt = (dQ/dP)·(dP/dt)。</p>
            <p>第一项是需求对价格的敏感度（需求函数的斜率），第二项是税收转嫁率。两者相乘得总效应——这就是<strong>税收归宿分析</strong>的数学基础。</p>
          </div>

          <div className="example-box">
            <h4>🌡️ 物理学案例：热胀冷缩</h4>
            <p>金属棒的长度 L 是温度 T 的函数 L(T)。温度 T 是时间 t 的函数 T(t)。</p>
            <p>长度随时间的变化率：dL/dt = (dL/dT)·(dT/dt)。</p>
            <p>第一项是材料的热膨胀系数，第二项是升温速率。两者独立可测，乘起来得到总效应——这就是链式法则的威力。</p>
          </div>
        </div>
      ),
    },
    {
      id: 'ch02-higher', title: 'Higher Derivatives & Taylor', titleZh: '高阶导数 & 泰勒展开',
      visual: HigherDerivViz,
      laBridgeZh: '泰勒展开 f(x) = Σ f⁽ⁿ⁾(a)(x−a)ⁿ/n! 把函数表示为多项式基 {1, x, x², ...} 的线性组合。系数向量 (f(a), f\'(a), f\'\'(a)/2!, ...) 就是函数在多项式空间中的坐标——这就是"基展开"思想。傅里叶级数只是换了一组基。',
      content: () => (
        <div className="section-content">
          <h2>2.3 高阶导数与泰勒公式</h2>

          <div className="story-box">
            <h4>📈 从位置到加速度——三阶递进</h4>
            <p>一辆汽车在高速公路上行驶：</p>
            <ul>
              <li><strong>位置 s(t)：</strong>在时刻 t 汽车在哪</li>
              <li><strong>速度 v(t) = s'(t)：</strong>位置的变化率——车速表读数</li>
              <li><strong>加速度 a(t) = v'(t) = s''(t)：</strong>速度的变化率——踩油门/刹车的感觉</li>
              <li><strong>加加速度 j(t) = a'(t) = s'''(t)：</strong>加速度的变化率——乘坐舒适度</li>
            </ul>
            <p>一阶导数是变化，二阶导数是变化的变化。经济学中这对应着<strong>边际效用递减</strong>（一阶 &gt; 0，二阶 &lt; 0）。</p>
          </div>

          <h3>二阶导数的经济学意义</h3>
          <table className="stats-table">
            <thead><tr><th>函数</th><th>一阶导数</th><th>二阶导数</th><th>经济含义</th></tr></thead>
            <tbody>
              <tr><td>效用 U(x)</td><td>边际效用 MU</td><td>MU'</td><td>MU' &lt; 0：边际效用递减</td></tr>
              <tr><td>生产 f(L)</td><td>边际产量 MP</td><td>MP'</td><td>MP' &lt; 0：报酬递减</td></tr>
              <tr><td>成本 TC(Q)</td><td>边际成本 MC</td><td>MC'</td><td>MC' &gt; 0：成本加速上升</td></tr>
            </tbody>
          </table>

          <h3>泰勒公式——用多项式逼近一切</h3>
          <div className="theorem-box">
            <h4>📐 泰勒公式（带拉格朗日余项）</h4>
            <p><Formula latex="f(x) = f(a) + f'(a)(x-a) + \frac{f''(a)}{2!}(x-a)^2 + \cdots + \frac{f^{(n)}(a)}{n!}(x-a)^n + R_n" /></p>
          </div>
          <p>一阶泰勒 f(x) ≈ f(a) + f'(a)(x−a) 就是<strong>线性近似</strong>。二阶泰勒加上了<strong>曲率修正</strong>。阶数越高，近似越好。</p>
          <div className="example-box">
            <p><strong>经济学应用：</strong>最优化的二阶条件——判断极值点是极大还是极小，靠的就是二阶导数（Hessian 矩阵）的正负号。泰勒展开到二阶就是二次型逼近，回到模块 D 的 Hessian 分析。</p>
          </div>
        </div>
      ),
    },
  ],
};
