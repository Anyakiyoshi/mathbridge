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
      laBridgeZh: '级数收敛判别（比值、根值）本质上是在衡量序列在某种"范数"下的行为。幂级数定义了一个以多项式基 {1, x, x², ...} 展开的"坐标系"——每个解析函数都是该基下的一个点。',
      content: () => (
        <div className="section-content">
          <h2>10.1 无穷级数</h2>
          <p>数项级数 <Formula latex="\sum a_n" /> 是否收敛？</p>
          <div className="theorem-box">
            <h4>判别法</h4>
            <ul>
              <li>比值判别：<Formula latex="\lim |a_{n+1}/a_n| = \rho" />，&rho; &lt; 1 收敛</li>
              <li>根值判别：<Formula latex="\lim \sqrt[n]{|a_n|} = \rho" /></li>
              <li>比较判别：和已知级数比较</li>
              <li>交错级数的莱布尼茨判别</li>
            </ul>
          </div>
          <h3>幂级数</h3>
          <p><Formula latex="\sum c_n (x-a)^n" /> 在收敛半径内表示一个函数。</p>
          <p>泰勒级数就是幂级数！收敛半径取决于函数奇点的位置。</p>

          <PracticeProblem context="第十章 无穷级数 - 数项级数收敛与幂级数" />
        </div>
      ),
    },
    {
      id: 'ch10-fourier', title: 'Fourier Series', titleZh: '傅里叶级数 — 正交基',
      visual: FourierViz,
      laBridgeZh: 'Fourier 级数把函数展开为 {1, sin(nx), cos(nx)} 的线性组合——这是一个正交基！三角函数在 L² 内积下的正交性 (∫sin(mx)sin(nx)dx = 0 for m≠n) 使得系数可独立计算。这和你在线代中学的"正交基中坐标 = 内积"完全相同。函数空间 = 无限维内积空间。',
      content: () => (
        <div className="section-content">
          <h2>10.2 傅里叶级数</h2>
          <p><Formula latex="f(x) = \frac{a_0}{2} + \sum_{n=1}^{\infty} [a_n \cos(nx) + b_n \sin(nx)]" /></p>
          <p>其中：<Formula latex="a_n = \frac{1}{\pi}\int_{-\pi}^{\pi} f(x)\cos(nx)dx" />，<Formula latex="b_n = \frac{1}{\pi}\int_{-\pi}^{\pi} f(x)\sin(nx)dx" /></p>

          <div className="insight-box highlight">
            <h4>💡 线性代数的终极关联</h4>
            <p>傅里叶系数 <Formula latex="a_n" /> 和 <Formula latex="b_n" /> 就是<strong>函数在三角基下的坐标</strong>！</p>
            <p>计算公式 <Formula latex="a_n = \langle f, \cos(nx) \rangle / \langle \cos(nx), \cos(nx) \rangle" />{' '}
              和线代中 <Formula latex="c_i = \langle v, e_i \rangle" /> 一模一样。</p>
            <p><strong>函数空间 = 无限维希尔伯特空间</strong>。有限维向量空间的每一件事——基、坐标、内积、正交投影——在函数空间中都有对应。</p>
          </div>

          <PracticeProblem context="第十章 无穷级数 - 傅里叶级数与正交基" />
        </div>
      ),
    },
  ],
};
