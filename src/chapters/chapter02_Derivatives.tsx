import type { Chapter } from '../store/useStore';
import Formula from '../components/Formula';
import { TangentViz } from './visuals/TangentSecant';
import { ChainRuleViz } from './visuals/ChainRule';
import { HigherDerivViz } from './visuals/HigherDerivatives';

export const chapter02: Chapter = {
  id: 'ch02',
  number: 2,
  title: 'Derivatives & Differentials',
  titleZh: '导数与微分',
  volume: 1,
  sections: [
    {
      id: 'ch02-tangent',
      title: 'Definition of Derivative',
      titleZh: '导数定义 — 从割线到切线',
      visual: TangentViz,
      laBridgeZh: '导数 f\'(x₀) 是一个 1×1 矩阵——它把 Δx 线性映射到 Δy。这是局部线性化思想，也是 Jacobian 矩阵在 1D 的特殊情况。',
      content: () => (
        <div className="section-content">
          <h2>2.1 导数定义</h2>
          <div className="definition-box">
            <h4>📖 定义</h4>
            <p><Formula latex="f'(x_0) = \lim_{\Delta x \to 0} \frac{f(x_0 + \Delta x) - f(x_0)}{\Delta x}" /></p>
            <p>若该极限存在，称 <Formula latex="f" /> 在 <Formula latex="x_0" /> 处<strong>可导</strong>。</p>
          </div>
          <p><strong>几何意义</strong>：导数 = 曲线在 <Formula latex="x_0" /> 处的切线斜率。</p>
          <p><strong>物理意义</strong>：导数 = 瞬时变化率（速度、边际成本……）。</p>
          <div className="insight-box highlight">
            <h4>💡 线代视角</h4>
            <p>导数 <Formula latex="f'(x_0)" />{' '}是函数在 <Formula latex="x_0" /> 附近的<strong>最佳线性逼近</strong>：</p>
            <p><Formula latex="f(x) \approx f(x_0) + f'(x_0)(x - x_0)" /></p>
            <p>这一思想推广到多元函数就是 Jacobian 矩阵！</p>
          </div>
        </div>
      ),
    },
    {
      id: 'ch02-chain',
      title: 'Derivative Rules & Chain Rule',
      titleZh: '求导法则 & 链式法则',
      visual: ChainRuleViz,
      laBridgeZh: '链式法则就是矩阵乘法的 1D 版本！f(g(x))\' = g\'(x) · f\'(g(x))——两个 1×1 矩阵的乘积。在多元情况下就是 Jacobian 矩阵的乘法。',
      content: () => (
        <div className="section-content">
          <h2>2.2 求导法则</h2>
          <div className="theorem-box">
            <h4>基本法则</h4>
            <ul>
              <li><Formula latex="(u \pm v)' = u' \pm v'" /></li>
              <li><Formula latex="(uv)' = u'v + uv'" /> （莱布尼茨法则）</li>
              <li><Formula latex="\left(\frac{u}{v}\right)' = \frac{u'v - uv'}{v^2}" /></li>
            </ul>
          </div>
          <h3>链式法则（Chain Rule）</h3>
          <p><Formula latex="\frac{dy}{dx} = \frac{dy}{du} \cdot \frac{du}{dx}" /></p>
          <p>复合函数的导数 = 外层导数 × 内层导数。这正是<strong>矩阵乘法的结合性</strong>在 1D 中的体现。</p>
        </div>
      ),
    },
    {
      id: 'ch02-higher',
      title: 'Higher Derivatives & Taylor',
      titleZh: '高阶导数 & 泰勒展开',
      visual: HigherDerivViz,
      laBridgeZh: '泰勒展开把任意光滑函数表示为多项式基 {1, x, x², x³, ...} 的线性组合。系数向量 (f(0), f\'(0), f\'\'(0)/2!, ...) 就是函数在多项式空间中的"坐标"。这是微积分→线代的关键桥梁！',
      content: () => (
        <div className="section-content">
          <h2>2.3 高阶导数与泰勒公式</h2>
          <p>二阶导数 <Formula latex="f''(x)" /> 描述曲率——曲线弯曲的程度。经济学中，边际效用递减就是二阶导数 &lt; 0。</p>
          <div className="theorem-box">
            <h4>📐 泰勒公式（带拉格朗日余项）</h4>
            <p><Formula latex="f(x) = f(a) + f'(a)(x-a) + \frac{f''(a)}{2!}(x-a)^2 + \cdots + \frac{f^{(n)}(a)}{n!}(x-a)^n + R_n" /></p>
          </div>
          <p>这就是我们在之前泰勒级数模块中看到的内容——阶数越高，逼近越好。<strong>系数就是"多项式基"下的坐标。</strong></p>
        </div>
      ),
    },
  ],
};
