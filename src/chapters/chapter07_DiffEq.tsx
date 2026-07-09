import type { Chapter } from '../store/useStore';
import Formula from '../components/Formula';
import { SlopeFieldViz } from './visuals/SlopeField';
import { ODESystemsViz } from './visuals/ODESystems';
import PracticeProblem from '../components/PracticeProblem';

export const chapter07: Chapter = {
  id: 'ch07', number: 7, title: 'Differential Equations', titleZh: '微分方程', volume: 1,
  sections: [
    {
      id: 'ch07-slope', title: 'Vector Fields & Flow', titleZh: '方向场——向量场的流',
      visual: SlopeFieldViz,
      content: () => (
        <div className="section-content">
          <h2>7.1 微分方程 = 向量场 + 流</h2>

          <div className="story-box">
            <h4>🌊 一个微分方程就是一张"水流图"</h4>
            <p>dy/dx = f(x,y) 在平面上每个点规定了一个方向和速度——这在几何上就是<strong>向量场</strong>。</p>
            <p>把一片叶子放在 (x₀,y₀)，它沿着场的方向漂流——留下的轨迹就是微分方程<strong>过该点的解曲线</strong>。</p>
            <p>整个向量场的所有解曲线合在一起——数学家称之为<strong>流 (flow)</strong>。</p>
          </div>

          <div className="insight-box highlight">
            <h4>🧮 代数视角：流 = 单参数变换群</h4>
            <p>定义映射 φₜ(x₀,y₀) = 从 (x₀,y₀) 出发、沿向量场流动 t 时间后到达的位置。</p>
            <p>这族映射满足 <strong>群的性质</strong>：φ₀ = 恒等映射，φₛ∘φₜ = φₛ₊ₜ（先流 s 再流 t = 直接流 s+t）。</p>
            <p>在线性微分方程 ẋ = Ax 中，φₜ = <strong>e^(tA)</strong>——矩阵指数！这就是为什么矩阵指数是微分方程的核心：<strong>它就是向量场的流算子</strong>。</p>
          </div>

          <PracticeProblem context="第七章 微分方程 - 向量场与流" />
        </div>
      ),
    },
    {
      id: 'ch07-linear', title: 'The Exponential Function as a Linear Operator', titleZh: '指数函数——一维到高维的自然推广',
      content: () => (
        <div className="section-content">
          <h2>7.2 从 y'=ky 到 ẋ=Ax</h2>

          <h3>一维：y' = ky ⟹ y(t) = y₀e^(kt)</h3>
          <p>解是指数函数。e^(kt) 是一个<strong>标量值的流算子</strong>：把初始值 y₀ 传播到时刻 t 的值。</p>

          <h3>推广到高维：ẋ = Ax ⟹ x(t) = e^(tA)x₀</h3>
          <p>一模一样的结构！只是把标量 k 换成矩阵 A，把 e^(kt) 换成<strong>矩阵指数</strong> e^(tA)。</p>

          <div className="insight-box highlight">
            <h4>🧮 代数视角：矩阵指数的计算 = 对角化</h4>
            <p>如果 A 可对角化：A = PDP⁻¹，那么 e^(tA) = P e^(tD) P⁻¹。</p>
            <p>e^(tD) 不过是对角线上每个 e^(λᵢt) 而已。所以<strong>求解微分方程组 = 对矩阵 A 做特征分解</strong>。</p>
            <p>一维中 "解是 e^(kt)"，高维中是 "解是 e^(λ₁t)v₁ + e^(λ₂t)v₂ + ..."——特征值决定衰减/增长速率，特征向量决定方向。</p>
          </div>

          <h3>特征值的符号 = 系统的命运</h3>
          <table className="stats-table">
            <thead><tr><th>λ 的实部</th><th>行为</th><th>经济学对应</th></tr></thead>
            <tbody>
              <tr><td>全负</td><td>稳定——所有轨迹收敛到原点</td><td>价格向均衡收敛</td></tr>
              <tr><td>全正</td><td>不稳定——所有轨迹发散</td><td>恶性通胀螺旋</td></tr>
              <tr><td>有正有负</td><td>鞍点——条件稳定</td><td>Solow 增长模型</td></tr>
              <tr><td>纯虚</td><td>周期轨道——永不收敛也不发散</td><td>捕食者-猎物循环</td></tr>
              <tr><td>复根(实部&lt;0)</td><td>螺旋收敛——振荡衰减</td><td>阻尼经济周期</td></tr>
            </tbody>
          </table>

          <PracticeProblem context="第七章 微分方程 - 矩阵指数与特征分解" />
        </div>
      ),
    },
    {
      id: 'ch07-systems', title: 'Phase Portraits = Eigenvector Geometry', titleZh: '相图——特征向量的几何',
      visual: ODESystemsViz,
      content: () => (
        <div className="section-content">
          <h2>7.3 相图：特征向量的几何舞蹈</h2>

          <div className="story-box">
            <h4>🎯 特征向量 = 不偏航的方向</h4>
            <p>对于 ẋ = Ax，如果初始状态 x₀ 恰好落在 A 的某条<strong>特征向量</strong>方向上，那么它永远沿着这个方向运动——不会偏航。运动速度由特征值决定。</p>
            <p>如果 x₀ 不在特征向量上，它的运动是两个特征方向运动的<strong>线性组合</strong>——这就是为什么所有轨迹最终都"贴着"特征向量的方向走。</p>
          </div>

          <div className="insight-box highlight">
            <h4>🧮 代数视角：解耦 = 换到特征基</h4>
            <p>ẋ=Ax 中的 x 和 A 都是写在<strong>标准基</strong>下的。如果换到 A 的特征基，A 就变成了对角矩阵——各个方向<strong>独立演化</strong>，互不干扰。</p>
            <p>这就是"对角化"的几何意义：找到一个坐标系，使得线性变换在这个坐标系下只是各方向的伸缩。</p>
            <p>相图分析的精髓就是<strong>看特征向量的几何位置和特征值的符号</strong>——这决定了所有轨迹的命运。</p>
          </div>

          <PracticeProblem context="第七章 微分方程 - 相图与特征向量几何" />
        </div>
      ),
    },
  ],
};
