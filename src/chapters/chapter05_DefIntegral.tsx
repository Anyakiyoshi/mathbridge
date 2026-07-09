import type { Chapter } from '../store/useStore';
import Formula from '../components/Formula';
import { RiemannViz } from './visuals/RiemannSum';
import { FTCViz } from './visuals/FTC';

export const chapter05: Chapter = {
  id: 'ch05', number: 5, title: 'Definite Integrals', titleZh: '定积分', volume: 1,
  sections: [
    {
      id: 'ch05-riemann', title: 'Riemann Sum → Integral', titleZh: '黎曼和 → 定积分',
      visual: RiemannViz,
      laBridgeZh: '黎曼和 = Σ f(ξᵢ)Δxᵢ 是函数 f 和区间划分的"内积"。当划分无限细密，这个和收敛到定积分 ∫f dx。这和线性代数中的点积 ⟨a,b⟩ = Σ aᵢbᵢ 完全同构——定积分就是无穷维内积。',
      content: () => (
        <div className="section-content">
          <h2>5.1 从面积到积分</h2>

          <div className="story-box">
            <h4>🏛️ 阿基米德的穷竭法</h4>
            <p>公元前 250 年，阿基米德用<strong>穷竭法</strong>计算了抛物线与直线围成的面积。他把区域切成 n 个三角形，证明当三角形越来越小时面积和逼近 4/3。这比牛顿早了 1900 年！</p>
            <p>穷竭法的核心思想和黎曼和完全一致：切成小块 → 求和 → 取极限。只是阿基米德没有极限这个工具，每次都要用反证法。</p>
          </div>

          <h3>黎曼和的构造</h3>
          <ol>
            <li><strong>划分区间</strong> [a,b]：插入分点 a = x₀ &lt; x₁ &lt; ... &lt; xₙ = b</li>
            <li><strong>取样</strong>：在每段 [xᵢ₋₁, xᵢ] 中任取一点 ξᵢ</li>
            <li><strong>求和</strong>：Σ f(ξᵢ)·Δxᵢ，其中 Δxᵢ = xᵢ − xᵢ₋₁</li>
            <li><strong>取极限</strong>：让最长的 Δxᵢ → 0，若和的极限存在，称为 f 在 [a,b] 上的定积分</li>
          </ol>

          <div className="definition-box">
            <h4>📖 定积分定义</h4>
            <p><Formula latex="\int_a^b f(x)\,dx = \lim_{\max \Delta x_i \to 0} \sum_{i=1}^{n} f(\xi_i)\Delta x_i" /></p>
          </div>

          <div className="example-box">
            <h4>💰 经济学案例：消费者剩余</h4>
            <p>需求曲线 P = D(Q) 告诉你消费者愿意为第 Q 件商品支付的最高价格。</p>
            <p>消费者剩余 = ∫₀^Q* D(Q) dQ − P*·Q*</p>
            <p>= 消费者愿意支付的总金额 − 实际支付的金额</p>
            <p>= 需求曲线下方、价格线上方的面积。</p>
            <p>没有定积分，就无法精确度量"消费者福利"——整个福利经济学的数学基础就是定积分。</p>
          </div>

          <div className="interactive-hint">
            <h4>🎮 交互演示</h4>
            <p>拖动 n 滑块增加矩形数量——n=4 时近似很粗糙，n=40 时几乎看不出误差。注意左端点和右端点的偏差方向不同，中点采样收敛最快。</p>
          </div>
        </div>
      ),
    },
    {
      id: 'ch05-ftc', title: 'Fundamental Theorem of Calculus', titleZh: '微积分基本定理 (FTC)',
      visual: FTCViz,
      laBridgeZh: 'FTC 说微分和积分是互逆运算：d/dx ∫ₐˣ f = f(x)。在线性代数中，这对应着线性变换和它的逆。求导算子和积分算子是互逆的线性算子——这正是现代泛函分析中"无界算子理论"的起点。',
      content: () => (
        <div className="section-content">
          <h2>5.2 牛顿-莱布尼茨公式</h2>

          <div className="story-box">
            <h4>⚔️ 微积分之争</h4>
            <p>牛顿在 1660 年代发明了"流数术"（微积分），莱布尼茨在 1670 年代独立发明了微积分并给出了我们今天使用的 ∫ 和 dx 符号。两人及其追随者陷入了长达数十年的优先权之争。</p>
            <p>但两人都独立发现了一个惊人的事实：<strong>求切线的运算（微分）和求面积的运算（积分）是互逆的。</strong>这个发现被称为"微积分基本定理"——数学史上最深刻的洞察之一。</p>
          </div>

          <div className="theorem-box">
            <h4>📐 微积分基本定理 (FTC)</h4>
            <p><strong>第一形式（积分上限函数）：</strong>定义 A(x) = ∫ₐˣ f(t) dt，则 A'(x) = f(x)。</p>
            <p><strong>第二形式（牛顿-莱布尼茨公式）：</strong>∫ₐᵇ f(x) dx = F(b) − F(a)，其中 F' = f。</p>
          </div>

          <h3>FTC 的意义：统一微分和积分</h3>
          <p>在 FTC 之前，求面积（积分）和求切线（微分）是两个完全不同的问题，需要完全不同的技巧。FTC 告诉我们：它们是<strong>同一个问题的两个方向</strong>，像加法和减法一样互逆。</p>
          <p>从牛顿-莱布尼茨公式之后，计算定积分的问题简化为<strong>找原函数</strong>——一个远比构造黎曼和简单的问题。</p>

          <div className="example-box">
            <h4>📈 经济学案例：从边际到总量</h4>
            <p>已知边际成本函数 MC(Q) = 5 + 0.2Q，求产量从 0 到 100 的总可变成本。</p>
            <p>TVC = ∫₀¹⁰⁰ MC(Q) dQ = ∫₀¹⁰⁰ (5 + 0.2Q) dQ = [5Q + 0.1Q²]₀¹⁰⁰ = 500 + 1000 = 1500。</p>
            <p>只要知道边际函数，积分就能还原总函数（差一个常数——固定成本）。这就是<strong>微积分在经济学中的核心工作流</strong>：总 → 边际（求导），边际 → 总（积分）。</p>
          </div>
        </div>
      ),
    },
  ],
};
