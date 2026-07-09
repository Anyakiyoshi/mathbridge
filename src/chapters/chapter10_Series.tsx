import type { Chapter } from '../store/useStore';
import Formula from '../components/Formula';
import { SeriesViz } from './visuals/SeriesConvergence';
import { FourierViz } from './visuals/FourierSeries';
import PracticeProblem from '../components/PracticeProblem';

export const chapter10: Chapter = {
  id: 'ch10', number: 10, title: 'Infinite Series', titleZh: '无穷级数', volume: 2,
  sections: [
    {
      id: 'ch10-series', title: 'Convergence & Power Series', titleZh: '数项级数收敛 & 幂级数',
      visual: SeriesViz,
      content: () => (
        <div className="section-content">
          <h2>10.1 无穷级数——无穷多项加起来等于多少？</h2>

          <div className="story-box">
            <h4>🏃 回到芝诺：阿喀琉斯追乌龟</h4>
            <p>阿喀琉斯速度是乌龟的 10 倍，让乌龟先跑 100 米。阿喀琉斯跑 100 米时乌龟又跑了 10 米，阿喀琉斯跑 10 米时乌龟又跑了 1 米……无穷无尽，永远追不上？</p>
            <p>这一悖论折磨了数学家两千年。解决的钥匙是<strong>无穷级数</strong>：</p>
            <p>100 + 10 + 1 + 0.1 + 0.01 + ... = 100/(1−0.1) = 111.111... 米——阿喀琉斯在 111.111... 米处追上乌龟。无穷多项加起来可以是<strong>有限值</strong>！</p>
          </div>

          <div className="definition-box">
            <h4>📖 级数收敛</h4>
            <p>级数 Σ a_n <strong>收敛</strong>到 S，如果部分和序列 S_n = Σ_i₌_1^n a_i 的极限是 S。</p>
            <p><strong>发散</strong>：部分和的极限不存在或为无穷。</p>
          </div>

          <h3>判别法全家福——哪个好用用哪个</h3>
          <table className="stats-table">
            <thead><tr><th>判别法</th><th>条件</th><th>结论</th><th>适用场景</th></tr></thead>
            <tbody>
              <tr><td>通项趋于零</td><td>若 a_n↛0</td><td><strong>发散</strong></td><td>最快排除发散级数</td></tr>
              <tr><td>几何级数</td><td>|r|&lt;1</td><td>收敛到 a/(1−r)</td><td>等比数列</td></tr>
              <tr><td>p-级数</td><td>Σ 1/nᵖ</td><td>p&gt;1 收敛，p≤1 发散</td><td>调和型级数</td></tr>
              <tr><td>比值判别</td><td>lim |a_n_+_1/a_n|=ρ</td><td>ρ&lt;1 收敛，ρ&gt;1 发散</td><td>阶乘、指数</td></tr>
              <tr><td>根值判别</td><td>lim ^n√|a_n|=ρ</td><td>ρ&lt;1 收敛，ρ&gt;1 发散</td><td>幂指型</td></tr>
              <tr><td>比较判别</td><td>0≤a_n≤b_n</td><td>若 Σb_n 收敛则 Σa_n 收敛</td><td>与已知级数比较</td></tr>
              <tr><td>交错级数</td><td>|a_n|↓0, 交错变号</td><td>收敛（莱布尼茨）</td><td>符号交替</td></tr>
            </tbody>
          </table>

          <div className="example-box">
            <h4>📝 例1：Σ 1/n² —— 收敛！</h4>
            <p>p-级数 p=2&gt;1 → 收敛。且精确和 = π²/6 ≈ 1.645（Euler 的杰作）。</p>
          </div>
          <div className="example-box">
            <h4>📝 例2：Σ n!/n^n —— 比值判别</h4>
            <p>a_n_+_1/a_n = [(n+1)!/(n+1)^n^+¹] / [n!/n^n] = (n+1)·n^n/(n+1)^n^+¹ = [n/(n+1)]^n → 1/e &lt; 1。收敛！</p>
          </div>
          <div className="example-box">
            <h4>📝 例3：Σ (−1)^n/n —— 交错调和级数</h4>
            <p>通项递减趋于 0 ✓ → 莱布尼茨判别法→收敛。和 = ln 2 ≈ 0.693。</p>
            <p>但 Σ 1/n（正项调和级数）发散！交错拯救了它。</p>
          </div>

          <h3>幂级数——函数"出生证明"上的序列号</h3>
          <p>幂级数 <Formula latex="\sum c_n (x-a)^n" /> 在收敛半径 R 内定义了一个函数。R 怎么求？</p>
          <p><Formula latex="R = \lim |c_n/c_{n+1}|" /> 或 <Formula latex="R = 1/\lim \sqrt[n]{|c_n|}" />。</p>

          <div className="insight-box highlight">
            <h4>🧮 幂级数 = 无限维向量</h4>
            <p>系数序列 (c_0,c_1,c_2,...) <strong>唯一确定</strong>一个解析函数。系数就是函数在多项式基下的坐标。泰勒级数、傅里叶级数、洛朗级数——都是同一个思想的不同"基"实现。</p>
            <p><strong>收敛半径 R = 复平面上离展开点最近的奇点距离</strong>。为什么 1/(1+x²) 在 x=0 展开的收敛半径只有 1？因为在复平面上 x=±i 处有奇点，距离展开点 0 恰好是 1。幂级数的收敛半径不是"巧合"，是由函数在<strong>复平面</strong>上的奇点位置决定的。</p>
          </div>

          <PracticeProblem context="第十章 无穷级数 - 数项级数收敛与幂级数" />
        </div>
      ),
    },
    {
      id: 'ch10-fourier', title: 'Fourier Series — Orthogonal Basis', titleZh: '傅里叶级数 — 函数空间的正交基',
      visual: FourierViz,
      content: () => (
        <div className="section-content">
          <h2>10.2 傅里叶级数——换一组基表示函数</h2>

          <div className="story-box">
            <h4>🎵 声音的配方</h4>
            <p>按下钢琴的中央 C 键——你听到的不只是一个频率，而是基频(261.6Hz) + 2倍频 + 3倍频 + ... 的混合。不同乐器的"配方"不同——小提琴的 2 倍频很强，长笛的基频占绝对主导。</p>
            <p>傅里叶的惊人发现：<strong>任何一个周期函数都可以分解为 sin 和 cos 的无穷和</strong>——就像每种音色都是纯音的配方。配方表中的系数就是<strong>傅里叶系数</strong>。</p>
          </div>

          <div className="definition-box">
            <h4>📖 傅里叶级数</h4>
            <p><Formula latex="f(x) = \frac{a_0}{2} + \sum_{n=1}^{\infty} [a_n \cos(nx) + b_n \sin(nx)]" /></p>
            <p>其中系数 = 函数与基函数的内积：<Formula latex="a_n = \frac{1}{\pi}\int_{-\pi}^{\pi} f(x)\cos(nx)dx" />，<Formula latex="b_n = \frac{1}{\pi}\int_{-\pi}^{\pi} f(x)\sin(nx)dx" />。</p>
          </div>

          <div className="insight-box highlight">
            <h4>🧮 为什么傅里叶系数公式长这样？因为正交基！</h4>
            <p>在线性代数中，如果 &#123;e_1, e_2, ...&#125; 是<strong>标准正交基</strong>，任意向量 v 的坐标 = v·e_i（内积）。</p>
            <p>三角函数族 &#123;1, cos nx, sin nx&#125; 在 L^2[−π,π] 上恰好是<strong>正交的</strong>：∫ cos(mx)cos(nx) dx = 0 (m≠n)，∫ sin(mx)cos(nx) dx = 0。</p>
            <p>所以傅里叶系数 = ⟨f, 基函数⟩ / ⟨基函数, 基函数⟩——和内积空间中的坐标计算公式<strong>完全一致</strong>。唯一的区别：这个内积空间是<strong>无穷维</strong>的。</p>
          </div>

          <h3>Gibbs 现象——"一直有点偏差"</h3>
          <p>用傅里叶级数逼近方波时，在跳跃处会出现约 9% 的过冲，无论取多少项都不会消失。这是因为 sin 和 cos 是<strong>光滑函数</strong>的基，用它们逼近有跳跃的不连续函数时必然有误差——就像用有限的线性组合去逼近一个不在子空间中的向量。</p>

          <div className="example-box">
            <h4>📊 经济学案例：时间序列的频谱分解</h4>
            <p>GDP 季度数据是一个时间序列 f(t)。它的傅里叶变换告诉你：GDP 波动中有多少来自<strong>季节性周期</strong>（年频率）、多少来自<strong>商业周期</strong>（3-5 年）、多少来自<strong>长期趋势</strong>（低频）。</p>
            <p>这就是<strong>频谱分析 (Spectral Analysis)</strong>——现代宏观经济学中分离周期和趋势的核心工具。Baxter-King 滤波器和 Hodrick-Prescott 滤波器都是傅里叶分析的应用。</p>
          </div>

          <PracticeProblem context="第十章 无穷级数 - 傅里叶级数与正交基" />
        </div>
      ),
    },
  ],
};
