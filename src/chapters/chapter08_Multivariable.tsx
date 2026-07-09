import type { Chapter } from '../store/useStore';
import Formula from '../components/Formula';
import { PartialDerivViz } from './visuals/PartialDerivative';
import { GradientDescentViz } from './visuals/GradientDescentViz';
import PracticeProblem from '../components/PracticeProblem';

export const chapter08: Chapter = {
  id: 'ch08', number: 8, title: 'Multivariable Calculus', titleZh: '多元函数微分学', volume: 2,
  sections: [
    {
      id: 'ch08-partial', title: 'The Jacobian Matrix', titleZh: 'Jacobian 矩阵——多维线性逼近',
      visual: PartialDerivViz,
      content: () => (
        <div className="section-content">
          <h2>8.1 从单变量到多变量：线性变换的矩阵变大了</h2>

          <div className="story-box">
            <h4>📐 一维回忆</h4>
            <p>f(x₀+Δx) ≈ f(x₀) + f'(x₀)·Δx。f'(x₀) 是一个 1×1 矩阵。</p>
            <p>现在 f 从 ℝⁿ 映射到 ℝᵐ。x 附近的最佳线性近似由 <strong>m×n 的 Jacobian 矩阵</strong>给出。</p>
          </div>

          <div className="definition-box">
            <h4>📖 Jacobian 矩阵</h4>
            <p><Formula latex="J_f = \begin{pmatrix} \partial f_1/\partial x_1 & \cdots & \partial f_1/\partial x_n \\ \vdots & \ddots & \vdots \\ \partial f_m/\partial x_1 & \cdots & \partial f_m/\partial x_n \end{pmatrix}" /></p>
            <p>第 i 行 = fᵢ 的梯度（1×n 行向量）。f(x₀+Δx) ≈ f(x₀) + J_f(x₀)·Δx。</p>
          </div>

          <div className="insight-box highlight">
            <h4>🧮 代数视角</h4>
            <p>J_f(x₀) 就是 f 在 x₀ 处的<strong>导数——一个线性变换的矩阵表示</strong>。在一维它是 1×1，在二维它可能是 1×2（标量场→梯度）或 2×2（向量场→速度梯度张量）。</p>
            <p>每个偏导数 J_ij = ∂fᵢ/∂xⱼ 刻画了"第 j 个输入对第 i 个输出的局部影响"——这在线性代数中就是矩阵的第 (i,j) 元素。你不需要"背"Jacobian，它就是你在线代课上学过的<strong>线性变换的矩阵表示</strong>，不过换到了函数空间。</p>
          </div>

          <div className="example-box">
            <h4>📊 经济学：比较静态分析</h4>
            <p>供给=需求条件：S(p,w)=D(p,y)。均衡价格 p* 是工资 w 和收入 y 的函数 p*(w,y)。</p>
            <p>想知道最低工资上涨对均衡价格的影响 ∂p*/∂w。隐函数定理把这个偏导数表达为<strong>Jacobian 矩阵的逆的元素</strong>——这是一维隐函数求导公式 dy/dx = −F_x/F_y 的多维推广。</p>
          </div>

          <PracticeProblem context="第八章 多元函数微分学 - Jacobian矩阵与线性逼近" />
        </div>
      ),
    },
    {
      id: 'ch08-gradient', title: 'Gradient = Row Vector, Hessian = Quadratic Form', titleZh: '梯度(行向量)与 Hessian(二次型)',
      visual: GradientDescentViz,
      content: () => (
        <div className="section-content">
          <h2>8.2 梯度与 Hessian——一阶和二阶信息</h2>

          <h3>梯度 ∇f = 1×n 的行向量</h3>
          <p>对于标量值函数 f: ℝⁿ→ℝ，Jacobian 是 1×n 行向量：∇f = (∂f/∂x₁, ..., ∂f/∂xₙ)。</p>
          <p><strong>∇f(x₀) 指向 f 增长最快的方向</strong>——因为方向导数 D_u f = ∇f·u 当 u 与 ∇f 同向时取最大值。</p>

          <h3>Hessian H_f = n×n 对称矩阵</h3>
          <p>H_f 是 f 的二阶导数矩阵：H_ij = ∂²f/∂xᵢ∂xⱼ。泰勒展开到二阶：</p>
          <p><Formula latex="f(x_0+\Delta x) \approx f(x_0) + \nabla f \cdot \Delta x + \frac{1}{2}\Delta x^T H_f \Delta x" /></p>

          <div className="insight-box highlight">
            <h4>🧮 代数视角：Hessian = 二次型</h4>
            <p>一阶项 ∇f·Δx 是<strong>线性型</strong>，二阶项 ΔxᵀH_fΔx 是<strong>二次型</strong>。极值点的判定完全取决于二次型 H_f 的正定性：</p>
            <ul>
              <li>H 正定 → 局部极小（碗形）</li>
              <li>H 负定 → 局部极大（倒碗）</li>
              <li>H 不定 → 鞍点</li>
            </ul>
            <p>这就是你在二次型章节学的内容！Hessian 是函数局部行为的<strong>二次型刻画</strong>。优化理论 = 线性型(一阶条件) + 二次型(二阶条件)。</p>
          </div>

          <PracticeProblem context="第八章 多元函数微分学 - Hessian二次型与极值判定" />
        </div>
      ),
    },
    {
      id: 'ch08-extrema', title: 'Lagrange Multipliers = Orthogonal Projection', titleZh: '拉格朗日乘数——正交投影',
      content: () => (
        <div className="section-content">
          <h2>8.3 约束优化 = 梯度在约束曲面上的投影</h2>

          <p>约束优化：max f(x) s.t. g(x)=0。</p>
          <p>必要条件：∇f = λ∇g。也就是说，<strong>f 的梯度在约束曲面法向上的分量正好被 λ∇g 抵消</strong>——在切平面方向上梯度为零。</p>

          <div className="insight-box highlight">
            <h4>🧮 几何视角</h4>
            <p>约束 g(x)=0 定义了一个曲面。∇g 是曲面的<strong>法向量</strong>（垂直于曲面）。</p>
            <p>∇f = λ∇g 意味着 ∇f 与 ∇g <strong>平行</strong>——即 ∇f 在曲面切方向上的投影为零。</p>
            <p>这和线代中的正交投影原理完全相同：在子空间上求极值 = 让梯度在子空间的补空间（法向）上取值。λ 就是投影的长度比。</p>
          </div>

          <div className="example-box">
            <h4>📊 经济学：效用最大化</h4>
            <p>max U(x,y) s.t. p₁x+p₂y = M（预算约束）。</p>
            <p>拉格朗日条件：∂U/∂x = λp₁，∂U/∂y = λp₂。这意味着 MUₓ/p₁ = MU_y/p₂——<strong>每元钱的边际效用相等</strong>。</p>
            <p>几何含义：无差异曲线（U 的等高线）与预算线相切——梯度的方向垂直于预算线。这就是<strong>切点条件</strong>的几何本质。</p>
          </div>

          <PracticeProblem context="第八章 多元函数微分学 - 拉格朗日乘数与正交投影" />
        </div>
      ),
    },
  ],
};
