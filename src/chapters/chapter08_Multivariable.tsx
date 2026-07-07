import type { Chapter } from '../store/useStore';
import Formula from '../components/Formula';
import { PartialDerivViz } from './visuals/PartialDerivative';
import { GradientDescentViz } from './visuals/GradientDescentViz';

export const chapter08: Chapter = {
  id: 'ch08', number: 8, title: 'Multivariable Calculus', titleZh: '多元函数微分学', volume: 2,
  sections: [
    {
      id: 'ch08-partial', title: 'Partial Derivatives & Tangent Plane', titleZh: '偏导数 & 全微分',
      visual: PartialDerivViz,
      laBridgeZh: '偏导数 ∂f/∂x 是沿 x 轴方向的变化率。全部偏导数组成梯度向量 ∇f，它是一个 1×n 的 Jacobian 矩阵。切平面方程 z = f(x₀,y₀) + ∇f·(Δx,Δy) 正是局部线性逼近。',
      content: () => (
        <div className="section-content">
          <h2>8.1 偏导数与全微分</h2>
          <p>多元函数的偏导数衡量"沿着一个坐标轴方向"的变化率：</p>
          <p><Formula latex="\frac{\partial f}{\partial x} = \lim_{h \to 0}\frac{f(x+h,y)-f(x,y)}{h}" /></p>
          <p><strong>全微分</strong>：<Formula latex="dz = \frac{\partial f}{\partial x}dx + \frac{\partial f}{\partial y}dy" /></p>
          <p>这意味着微小变化可以线性近似——这正是<strong>Jacobian 矩阵</strong>的思想。</p>
        </div>
      ),
    },
    {
      id: 'ch08-gradient', title: 'Gradient & Directional Derivative', titleZh: '方向导数 & 梯度下降',
      visual: GradientDescentViz,
      laBridgeZh: '梯度 ∇f 指向函数增长最快的方向。梯度下降迭代 x_{k+1} = x_k − α∇f(x_k) 本质上是求二次型极值——这直接导向了数值线性代数中的共轭梯度法和优化理论。',
      content: () => (
        <div className="section-content">
          <h2>8.2 梯度与方向导数</h2>
          <p>方向导数：<Formula latex="D_{\mathbf{u}}f = \nabla f \cdot \mathbf{u}" /></p>
          <p>梯度 <Formula latex="\nabla f = (\partial f/\partial x, \partial f/\partial y)" /> 是函数值增长最快的方向。</p>
          <p><strong>梯度下降</strong>：沿负梯度方向迭代寻找极小值。这是机器学习最基本的优化算法。</p>
        </div>
      ),
    },
    {
      id: 'ch08-extrema', title: 'Extrema & Lagrange Multipliers', titleZh: '极值 & 拉格朗日乘数法',
      content: () => (
        <div className="section-content">
          <h2>8.3 多元极值</h2>
          <p>无条件极值：<Formula latex="\nabla f = 0" />，再用 Hessian 矩阵判正定性。</p>
          <h3>拉格朗日乘数法</h3>
          <p>约束优化：<Formula latex="\nabla f = \lambda \nabla g" />，<Formula latex="g(x,y) = 0" /></p>
          <p>经济学核心应用：效用最大化（预算约束）、成本最小化（产量约束）。</p>
        </div>
      ),
    },
  ],
};
