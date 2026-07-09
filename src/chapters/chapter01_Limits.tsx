import type { Chapter } from '../store/useStore';
import Formula from '../components/Formula';
import { EpsilonDeltaViz } from './visuals/EpsilonDelta';
import { LimitLawsViz } from './visuals/LimitLaws';
import { ContinuityViz } from './visuals/Continuity';

export const chapter01: Chapter = {
  id: 'ch01', number: 1, title: 'Functions & Limits', titleZh: '函数与极限', volume: 1,
  sections: [
    {
      id: 'ch01-limits', title: 'Limit Definition (ε-δ)', titleZh: '极限的 ε-δ 定义',
      visual: EpsilonDeltaViz,
      laBridgeZh: 'ε-δ 定义中的逻辑结构——"对任意 ε>0, 存在 δ>0"——是分析学的标志性语言。在泛函分析中，这个定义被推广为度量空间中的收敛：d(f(x), L)→0。极限、连续、收敛本质上都是"距离趋于零"——线性代数中的范数正是用来度量这种距离的工具。',
      content: () => (
        <div className="section-content">
          <h2>1.1 极限的 ε-δ 定义</h2>

          <div className="story-box">
            <h4>🏃 从芝诺悖论说起</h4>
            <p>古希腊哲学家芝诺提出：一个人要从 A 点走到 B 点，必须先走到中点，再走到剩余距离的中点……无穷无尽，所以永远到不了终点。</p>
            <p>这个悖论困惑了数学家两千多年。直到极限概念的提出才被彻底解决：<strong>无穷多个步骤的"终点"是一个确定的数</strong>——这就是极限。</p>
            <p><Formula latex="\frac{1}{2} + \frac{1}{4} + \frac{1}{8} + \cdots = 1" /> —— 无限逼近，但和恰好等于 1。</p>
          </div>

          <h3>为什么经济学需要极限？</h3>
          <p>设想你开了一家奶茶店。你知道卖 100 杯时总成本是 800 元，卖 101 杯时总成本是 807 元。那么第 101 杯的<strong>边际成本</strong>大约是 7 元。</p>
          <p>但"第 101 杯"的精确成本应该是：当产量增量趋于零时，成本增量与产量增量之比的极限。这就是导数——而导数建立在极限之上。</p>
          <div className="example-box">
            <p><strong>经济学直觉：</strong></p>
            <p>边际成本 MC = <Formula latex="\lim_{\Delta Q \to 0} \frac{\Delta TC}{\Delta Q}" /></p>
            <p>没有极限，就没有边际分析。没有边际分析，就没有微观经济学。</p>
          </div>

          <h2>直觉 → 严格定义</h2>
          <p>直觉上：<Formula latex="\lim_{x \to x_0} f(x) = L" /> 意思是"x 靠近 x₀ 时，f(x) 靠近 L"。</p>
          <p>但什么叫"靠近"？多近算近？数学家需要一个<strong>不容置疑</strong>的标准。</p>

          <div className="definition-box">
            <h4>📖 ε-δ 定义</h4>
            <p><Formula latex="\forall \varepsilon > 0,\ \exists \delta > 0" />，使得当 <Formula latex="0 < |x - x_0| < \delta" /> 时，恒有 <Formula latex="|f(x) - L| < \varepsilon" />。</p>
          </div>

          <h3>逐词翻译</h3>
          <table className="stats-table">
            <thead><tr><th>符号</th><th>读作</th><th>含义</th></tr></thead>
            <tbody>
              <tr><td>∀ε &gt; 0</td><td>"对任意正数 ε"</td><td>你给我一个任意小的误差标准</td></tr>
              <tr><td>∃δ &gt; 0</td><td>"存在正数 δ"</td><td>我总能找到对应的 x 的控制范围</td></tr>
              <tr><td>0 &lt; |x−x₀| &lt; δ</td><td>"x 在 x₀ 的去心 δ 邻域内"</td><td>x 离 x₀ 足够近但不等于 x₀</td></tr>
              <tr><td>|f(x)−L| &lt; ε</td><td>"f(x) 落在 L 的 ε 邻域内"</td><td>函数值落在误差允许范围内</td></tr>
            </tbody>
          </table>

          <h3>博弈论类比</h3>
          <p>极限定义像一场博弈：</p>
          <ul>
            <li><strong>挑战者</strong>（你）提出任意 ε——"我要 f(x) 离 L 不超过 0.001"</li>
            <li><strong>回应者</strong>（我）回应以 δ——"那你把 x 控制在 x₀ 旁边 0.0003 范围内就行"</li>
            <li><strong>胜利条件</strong>：无论挑战者提出的 ε 多小，回应者总能找到 δ 应对</li>
          </ul>
          <p>这就是"极限存在"的精确含义。在经济学中，这对应着"均衡存在性"证明的标准结构。</p>

          <div className="interactive-hint">
            <h4>🎮 交互演示</h4>
            <p>上方可视化中，拖动 <strong>ε 滑块</strong>缩小误差范围，观察 δ 如何自动调整。矩形重叠区就是所有满足条件的 (x, f(x)) 点。ε → 0 时 δ → 0——这就是极限的本质。</p>
          </div>

          <div className="example-box">
            <h4>📝 例题：证明 lim(x→2) (3x−1) = 5</h4>
            <p><strong>分析：</strong>我们要找到 δ，使得 |x−2| &lt; δ 时 |(3x−1)−5| &lt; ε。</p>
            <p>化简：|3x−6| = 3|x−2|。所以只要 3|x−2| &lt; ε，即 |x−2| &lt; ε/3。</p>
            <p><strong>证明：</strong>任给 ε &gt; 0，取 δ = ε/3。当 0 &lt; |x−2| &lt; δ 时：</p>
            <p>|(3x−1)−5| = |3x−6| = 3|x−2| &lt; 3δ = ε。∎</p>
            <p><strong>关键观察：</strong>δ = ε/3——线性函数中 δ 和 ε 成正比。这在线性变换中对应着矩阵范数的有界性。</p>
          </div>

          <div className="misconception-box">
            <h4>⚠ 常见误区</h4>
            <p><strong>误区 1："f(x) 最终等于 L"</strong> —— 不！极限描述的是<strong>趋近</strong>行为，f(x) 可以永远不等于 L，甚至可以在 x₀ 处没有定义。比如 f(x) = (x²−1)/(x−1) 在 x=1 处无定义，但极限是 2。</p>
            <p><strong>误区 2："x 必须到达 x₀"</strong> —— 不！定义中的 0 &lt; |x−x₀| 明确排除了 x=x₀。我们只关心 <strong>x₀ 附近</strong> 的行为。</p>
            <p><strong>误区 3："极限总是函数值"</strong> —— 不！只有<strong>连续函数</strong>才有极限值等于函数值。区分极限和函数值是理解微积分的关键。</p>
          </div>
        </div>
      ),
    },

    // ── 1.2 极限运算法则 ──
    {
      id: 'ch01-laws', title: 'Limit Laws & Important Limits', titleZh: '极限运算法则 & 两个重要极限',
      visual: LimitLawsViz,
      laBridgeZh: '极限的四则运算表明极限运算和代数运算可交换——这在泛函分析中对应着"极限算子是有界线性算子"。夹逼准则暗示了序结构与拓扑结构的相容性，这是 Riesz 空间理论的基础。两个重要极限则揭示了指数函数和三角函数的深层联系——e^(iπ)+1=0 的雏形。',
      content: () => (
        <div className="section-content">
          <h2>1.2 极限运算法则 & 两个重要极限</h2>

          <h3>极限的四则运算</h3>
          <div className="theorem-box">
            <h4>📐 运算法则</h4>
            <p>若 lim f(x) = A，lim g(x) = B，则：</p>
            <ul>
              <li>lim [f(x) ± g(x)] = A ± B</li>
              <li>lim [f(x)·g(x)] = A·B</li>
              <li>lim [f(x)/g(x)] = A/B （B ≠ 0）</li>
              <li>lim [k·f(x)] = k·A （k 为常数）</li>
            </ul>
            <p>这意味着<strong>极限运算和代数运算可以交换顺序</strong>——先取极限再加减 = 先加减再取极限。</p>
          </div>

          <div className="story-box">
            <h4>💹 经济学案例：复利与 e</h4>
            <p>你把 1 元钱存入银行，年利率 100%：</p>
            <ul>
              <li>每年计息 1 次：年底得 (1+1)¹ = 2 元</li>
              <li>每半年计息：年底得 (1+1/2)² = 2.25 元</li>
              <li>每月计息：年底得 (1+1/12)¹² ≈ 2.613 元</li>
              <li>每天计息：年底得 (1+1/365)³⁶⁵ ≈ 2.715 元</li>
              <li>连续复利（每时每刻）：lim(1+1/n)^n = e ≈ 2.71828</li>
            </ul>
            <p>这就是第二个重要极限的经济学来源——<strong>连续复利</strong>是金融数学的基石。</p>
          </div>

          <h3>🔑 两个重要极限</h3>
          <div className="theorem-box">
            <h4>重要极限 Ⅰ</h4>
            <p><Formula latex="\displaystyle\lim_{x \to 0} \frac{\sin x}{x} = 1" /></p>
            <p><strong>证明思路：</strong>利用几何不等式 cos x &lt; sin x / x &lt; 1（x &gt; 0 时），然后用夹逼准则。</p>
            <p><strong>应用：</strong>所有涉及 sin x 的小角度近似都基于此极限。物理学中单摆的周期公式推导就用到它。</p>
          </div>
          <div className="theorem-box">
            <h4>重要极限 Ⅱ</h4>
            <p><Formula latex="\displaystyle\lim_{x \to \infty} \left(1 + \frac{1}{x}\right)^x = e" /> 或 <Formula latex="\lim_{x \to 0} (1 + x)^{1/x} = e" /></p>
            <p><strong>应用：</strong>连续复利、人口增长模型、放射性衰变——所有指数增长/衰减模型的核心常数。</p>
          </div>

          <h3>夹逼准则（三明治定理）</h3>
          <p>若 g(x) ≤ f(x) ≤ h(x) 在 x₀ 附近成立，且 lim g(x) = lim h(x) = L，则 lim f(x) = L。</p>
          <div className="example-box">
            <p><strong>经典应用：</strong>证明 lim(x→0) x·sin(1/x) = 0。</p>
            <p>因为 −|x| ≤ x·sin(1/x) ≤ |x|，且 lim(−|x|) = lim(|x|) = 0，由夹逼准则得证。</p>
          </div>

          <div className="misconception-box">
            <h4>⚠ 常见误区</h4>
            <p><strong>不要分开取极限！</strong>lim [f(x)/g(x)] 不能拆成 lim f(x) / lim g(x) 如果分母极限为 0。比如 lim(x→0) sin x / x ≠ (lim sin x)/(lim x) = 0/0——这恰好是"不定式"。</p>
          </div>
        </div>
      ),
    },

    // ── 1.3 连续性 ──
    {
      id: 'ch01-continuity', title: 'Continuity & Discontinuities', titleZh: '连续性 & 间断点',
      visual: ContinuityViz,
      laBridgeZh: '连续函数构成一个无穷维向量空间 C[a,b]——这是泛函分析中最基本的研究对象。紧集上的连续函数可以被多项式一致逼近（Weierstrass 逼近定理）——这和泰勒级数、傅里叶级数一样，都是"用基函数线性组合逼近任意函数"的思想。连续性和线性的交汇是数学分析的永恒主题。',
      content: () => (
        <div className="section-content">
          <h2>1.3 函数的连续性</h2>

          <div className="story-box">
            <h4>🌡️ 温度是连续的</h4>
            <p>把温度计从 20°C 的水移到 80°C 的水中，温度计读数不会瞬间跳变——它<strong>连续</strong>地从 20 上升到 80。这就是连续性的物理直觉：<strong>没有跳跃、没有断裂、一笔画完</strong>。</p>
            <p>经济学中，效用函数通常假设为连续的——如果对苹果的偏好和对橘子的偏好"接近"，那么它们的效用值也应该"接近"。否则就会出现不合理的偏好逆转。</p>
          </div>

          <div className="definition-box">
            <h4>📖 连续性的三种等价定义</h4>
            <ol>
              <li><strong>极限定义：</strong>lim(x→x₀) f(x) = f(x₀) —— 极限值 = 函数值</li>
              <li><strong>ε-δ 定义：</strong>|x−x₀| &lt; δ ⇒ |f(x)−f(x₀)| &lt; ε</li>
              <li><strong>邻域定义：</strong>对 f(x₀) 的任意邻域 V，存在 x₀ 的邻域 U 使得 f(U) ⊆ V</li>
            </ol>
            <p>三层递进：直觉 → 计算 → 拓扑。数学家最终偏爱第三种，因为它可以推广到一般拓扑空间。</p>
          </div>

          <h3>连续 vs 可导</h3>
          <p>可导 ⇒ 连续（导数存在意味着函数光滑）</p>
          <p>连续 ⇏ 可导（例如 f(x)=|x| 在 x=0 处连续但不可导——有尖角）</p>
          <div className="example-box">
            <p><strong>经济学直觉：</strong>生产函数通常是连续的（多投入一点，产出多一点点）。但在某些点上可能不可导——比如固定成本导致的分段函数，在临界产能处有"拐角"。</p>
            <p>Leontief 生产函数 f(K,L) = min(aK, bL) 在每个 K/L = b/a 的点上都连续但不可导——这是"里昂惕夫无替代弹性"的数学根源。</p>
          </div>

          <h3>间断点分类</h3>
          <table className="stats-table">
            <thead><tr><th>类型</th><th>特征</th><th>经济学例子</th></tr></thead>
            <tbody>
              <tr><td>可去间断</td><td>极限存在 ≠ 函数值</td><td>价格上限管制下的供需模型</td></tr>
              <tr><td>跳跃间断</td><td>左右极限存在但不相等</td><td>阶梯税率、累进税制</td></tr>
              <tr><td>无穷间断</td><td>极限趋于无穷</td><td>Cobb-Douglas 在 K=0 或 L=0 处</td></tr>
              <tr><td>振荡间断</td><td>极限不存在（振荡）</td><td>高频交易的波动率函数</td></tr>
            </tbody>
          </table>

          <h3>闭区间上连续函数的性质</h3>
          <div className="theorem-box">
            <h4>📐 三大定理</h4>
            <ul>
              <li><strong>有界性定理：</strong>闭区间上连续函数必有界</li>
              <li><strong>最值定理：</strong>闭区间上连续函数必取到最大值和最小值</li>
              <li><strong>介值定理：</strong>若 f(a) &lt; 0 &lt; f(b)，则 ∃c∈(a,b) 使 f(c)=0</li>
            </ul>
          </div>
          <div className="example-box">
            <p><strong>经济学应用——均衡存在性：</strong></p>
            <p>设超额需求函数 E(p) 在价格 p 处连续。若 E(1) &lt; 0（价格太高，供过于求）且 E(100) &gt; 0（价格太低，供不应求），由介值定理，存在均衡价格 p* 使 E(p*) = 0。</p>
            <p>这证明了<strong>瓦尔拉斯均衡的存在性</strong>——一般均衡理论的数学基础就是一个连续函数的介值定理。</p>
          </div>
        </div>
      ),
    },
  ],
};
