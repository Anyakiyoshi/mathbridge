import type { Chapter } from '../store/useStore';
import Formula from '../components/Formula';
import { AntiderivViz } from './visuals/Antiderivative';
import { IntegrationViz } from './visuals/Integration';
import { SubstitutionViz } from './visuals/Substitution';
import PracticeProblem from '../components/PracticeProblem';

export const chapter04: Chapter = {
  id: 'ch04', number: 4, title: 'Indefinite Integrals', titleZh: '不定积分', volume: 1,
  sections: [
    // ── 4.1 ──
    {
      id: 'ch04-concept', title: 'Antiderivative & Indefinite Integral', titleZh: '原函数与不定积分概念',
      visual: AntiderivViz,
      content: () => (
        <div className="section-content">
          <h2>4.1 原函数与不定积分</h2>

          <div className="story-box">
            <h4>🔙 反向思维</h4>
            <p>导数告诉你函数的变化率。反过来：如果已知变化率，能还原出原始函数吗？</p>
            <p>比如，车速表显示 v(t)=2t，你能推出行驶里程 s(t)=t²+C 吗？——可以，但差一个常数。因为 s(0) 不知道（起点的里程表读数未知）。</p>
            <p>这个"反向求导"的过程就是<strong>不定积分</strong>。</p>
          </div>

          <div className="definition-box">
            <h4>📖 定义</h4>
            <p>若 F'(x)=f(x)，则称 F 是 f 的一个<strong>原函数</strong>。</p>
            <p><Formula latex="\int f(x)\,dx = F(x) + C" />，其中 C 是任意常数。</p>
          </div>

          <h3>基本积分公式（必须背）</h3>
          <table className="stats-table">
            <thead><tr><th>被积函数</th><th>不定积分</th></tr></thead>
            <tbody>
              <tr><td>xⁿ (n≠−1)</td><td>xⁿ⁺¹/(n+1) + C</td></tr>
              <tr><td>1/x</td><td>ln|x| + C</td></tr>
              <tr><td>eˣ</td><td>eˣ + C</td></tr>
              <tr><td>sin x</td><td>−cos x + C</td></tr>
              <tr><td>cos x</td><td>sin x + C</td></tr>
              <tr><td>1/(1+x²)</td><td>arctan x + C</td></tr>
              <tr><td>1/√(1−x²)</td><td>arcsin x + C</td></tr>
            </tbody>
          </table>

          <div className="insight-box highlight">
            <h4>💡 线性代数视角</h4>
            <p>不定积分的"+C"不是数学不严谨——它精确反映了<strong>导数映射的核空间 = 常值函数</strong>。就像 Ax=b 的解是 特解+齐次解，∫(2x)dx 的解是 x²+ker(d/dx)。</p>
          </div>

          <PracticeProblem
            context="第四章 不定积分 - 原函数概念"
            question="求不定积分 ∫(3x² − 4x + 5) dx。逐项使用幂函数积分公式。"
            hint="提示：∫3x²dx = x³+C₁, ∫(−4x)dx = −2x²+C₂, ∫5dx = 5x+C₃。最后合并常数为 C。"
          />
        </div>
      ),
    },
    // ── 4.2 换元法 ──
    {
      id: 'ch04-substitution', title: 'u-Substitution', titleZh: '第一类换元法（凑微分）',
      visual: SubstitutionViz,
      content: () => (
        <div className="section-content">
          <h2>4.2 第一类换元法（凑微分法）</h2>

          <div className="story-box">
            <h4>🧩 拼图游戏</h4>
            <p>不定积分不像求导——没有机械化的算法。它更像是<strong>识别模式</strong>：看到被积函数，在脑中搜索"有没有哪个函数的导数是这个？"</p>
            <p>换元法的核心技巧就是<strong>凑微分</strong>——把被积表达式"打扮"成某个基本积分公式的样子。</p>
          </div>

          <h3>基本思想</h3>
          <p>∫ f(g(x))·g'(x) dx = ∫ f(u) du，其中 u=g(x), du=g'(x)dx。</p>

          <div className="example-box">
            <h4>📝 例1：∫ 2x·cos(x²) dx</h4>
            <p><strong>步骤1：</strong>设 u = x²，则 du = 2x dx。观察到 2x dx 正好在积分中！</p>
            <p><strong>步骤2：</strong>∫ 2x·cos(x²) dx = ∫ cos(u) du = sin(u) + C = sin(x²) + C。</p>
            <p><strong>验证：</strong>d/dx [sin(x²)] = cos(x²)·2x ✓</p>
          </div>

          <div className="example-box">
            <h4>📝 例2：∫ (ln x / x) dx</h4>
            <p>设 u = ln x，则 du = (1/x) dx。积分中有 1/x dx = du。</p>
            <p>∫ (ln x / x) dx = ∫ u du = u²/2 + C = (ln x)²/2 + C。</p>
          </div>

          <h3>常见凑微分形式</h3>
          <table className="stats-table">
            <thead><tr><th>形式</th><th>设 u = ?</th></tr></thead>
            <tbody>
              <tr><td>∫ f(ax+b) dx</td><td>u = ax+b</td></tr>
              <tr><td>∫ f(x²)·x dx</td><td>u = x²</td></tr>
              <tr><td>∫ f(eˣ)·eˣ dx</td><td>u = eˣ</td></tr>
              <tr><td>∫ f(ln x)·(1/x) dx</td><td>u = ln x</td></tr>
              <tr><td>∫ f(sin x)·cos x dx</td><td>u = sin x</td></tr>
            </tbody>
          </table>

          <PracticeProblem
            context="第四章 不定积分 - 第一类换元法"
            question="用换元法求 ∫ x·e^(x²) dx。提示：令 u=x²。"
            hint="令 u=x²，则 du=2x dx。积分中 x dx = du/2，所以 ∫ x·e^(x²)dx = ∫ e^u·(du/2) = (1/2)e^u+C = (1/2)e^(x²)+C。"
          />
        </div>
      ),
    },
    // ── 4.3 分部积分与有理分式 ──
    {
      id: 'ch04-parts', title: 'Integration by Parts & Partial Fractions', titleZh: '分部积分法 & 有理函数积分',
      visual: IntegrationViz,
      content: () => (
        <div className="section-content">
          <h2>4.3 分部积分法</h2>

          <div className="theorem-box">
            <h4>📐 分部积分公式</h4>
            <p><Formula latex="\int u\,dv = uv - \int v\,du" /></p>
            <p>选择 u 的优先级口诀——<strong>LIATE</strong>：</p>
            <p>Log → Inverse trig → Algebraic → Trig → Exponential（越靠前越优先选为 u）</p>
          </div>

          <div className="example-box">
            <h4>📝 例1：∫ x·eˣ dx</h4>
            <p>设 u=x（Algebraic 优先），dv=eˣ dx。则 du=dx，v=eˣ。</p>
            <p>∫ x·eˣ dx = x·eˣ − ∫ eˣ dx = x·eˣ − eˣ + C = eˣ(x−1) + C。</p>
          </div>

          <div className="example-box">
            <h4>📝 例2：∫ ln x dx</h4>
            <p>设 u=ln x（Log 优先），dv=dx。则 du=1/x dx，v=x。</p>
            <p>∫ ln x dx = x·ln x − ∫ x·(1/x) dx = x·ln x − x + C。</p>
          </div>

          <div className="example-box">
            <h4>💰 经济学案例：消费者剩余的积分</h4>
            <p>需求函数 P=10e^(−0.5Q)。消费者剩余 CS = ∫₀^Q* P(Q)dQ − P*Q*。</p>
            <p>∫ 10e^(−0.5Q)dQ = 10·(−2)e^(−0.5Q) = −20e^(−0.5Q) + C（换元法）。</p>
            <p>分部积分和换元法是计算消费者剩余、生产者剩余、基尼系数的基础工具。</p>
          </div>

          <h3>有理函数的积分</h3>
          <p>形如 ∫ P(x)/Q(x) dx，其中 P、Q 为多项式。</p>
          <p><strong>方法：</strong>先用多项式除法降低分子次数，再对余项进行<strong>部分分式分解</strong>。</p>

          <div className="example-box">
            <h4>📝 例3：∫ 1/(x²−1) dx</h4>
            <p>分解：1/(x²−1) = 1/[(x−1)(x+1)] = A/(x−1) + B/(x+1)。</p>
            <p>解得 A=1/2, B=−1/2。</p>
            <p>∫ 1/(x²−1) dx = (1/2)ln|x−1| − (1/2)ln|x+1| + C = (1/2)ln|(x−1)/(x+1)| + C。</p>
          </div>

          <PracticeProblem
            context="第四章 不定积分 - 分部积分法与有理函数"
            question="用分部积分法计算 ∫ x·sin x dx。请遵循 LIATE 原则选择 u。"
            hint="设 u=x（Algebraic）, dv=sin x dx。则 du=dx, v=−cos x。∫ x sin x dx = −x cos x + ∫ cos x dx。"
          />
        </div>
      ),
    },
  ],
};
