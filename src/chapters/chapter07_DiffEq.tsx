import type { Chapter } from '../store/useStore';
import Formula from '../components/Formula';
import { SlopeFieldViz } from './visuals/SlopeField';
import { ODESystemsViz } from './visuals/ODESystems';
import PracticeProblem from '../components/PracticeProblem';

export const chapter07: Chapter = {
  id: 'ch07', number: 7, title: 'Differential Equations', titleZh: '微分方程', volume: 1,
  sections: [
    {
      id: 'ch07-slope', title: 'Slope Fields & Geometric Meaning', titleZh: '方向场 & 解的几何意义',
      visual: SlopeFieldViz,
      laBridgeZh: '一阶微分方程 dy/dx = f(x,y) 定义了一个向量场。解曲线就是这个向量场的积分曲线——沿场方向流动。这在线性代数中对应着"向量场的流"：给定一个线性向量场 ẋ = Ax，其流就是 e^(At)x₀。',
      content: () => (
        <div className="section-content">
          <h2>7.1 方向场：微分方程的"天气预报图"</h2>

          <div className="story-box">
            <h4>🌊 大海中的漂流瓶</h4>
            <p>把一只漂流瓶扔进大海。海流在每个位置 (x,y) 都有一个方向和速度——这就像一个<strong>向量场</strong>。漂流瓶的轨迹就是沿着这个场"随波逐流"的积分曲线。</p>
            <p>微分方程 dy/dx = f(x,y) 在平面上每个点规定了一个斜率，所有的斜率画出来就是<strong>方向场</strong>。微分方程的解就是沿着方向场流动的曲线。</p>
          </div>

          <h3>什么是微分方程？</h3>
          <p>微分方程是<strong>含有未知函数及其导数的方程</strong>。它描述的不是"量是多少"，而是<strong>"量的变化规律"</strong>。</p>
          <div className="definition-box">
            <h4>📖 基本概念</h4>
            <ul>
              <li><strong>阶：</strong>方程中出现的最高阶导数。y' = ky 是一阶，y'' + ω²y = 0 是二阶。</li>
              <li><strong>通解：</strong>含有任意常数的解族。y = Ce^(kx) 是 y' = ky 的通解。</li>
              <li><strong>特解：</strong>给定初始条件后确定的唯一解。y(0)=100 → C=100 → y=100e^(kx)。</li>
            </ul>
          </div>

          <div className="example-box">
            <h4>📈 经济学经典：指数增长模型</h4>
            <p>假设 GDP 的增长率与当前 GDP 成正比：dy/dt = ky。</p>
            <p>解：y(t) = y₀·e^(kt)。若 k=0.03，每 23 年翻一番（72法则：72/3=24≈23.1）。</p>
            <p>这个模型描述了复利、人口增长、技术进步——所有"越有钱赚得越快"的现象。但它的缺陷也很明显：不可能永远指数增长。改进版是<strong>逻辑斯蒂方程</strong>（见下文）。</p>
          </div>

          <h3>方向场的读法</h3>
          <p>在上方可视化中，每一小段线的斜率 = f(x,y)。解曲线从某个初始点出发，"跟着箭头走"。不同初始条件给出不同的解曲线——它们构成<strong>积分曲线族</strong>。</p>

          <div className="misconception-box">
            <h4>⚠ 关键区分</h4>
            <p><strong>微分方程 ≠ 代数方程。</strong>代数方程的解是一个数，微分方程的解是一个<strong>函数</strong>。y' = y 的解不是 x=某个数，而是 y=eˣ 这样的整个函数。</p>
          </div>

          <PracticeProblem
            context="第七章 微分方程 - 方向场与解的几何意义"
            question="验证 y = Ce^(2x) 是微分方程 y' = 2y 的通解（C 为任意常数）。然后求满足初始条件 y(0)=3 的特解。"
            hint="提示：对 y=Ce^(2x) 求导，检查是否满足 y'=2y。代入 x=0, y=3 解出 C。"
          />
        </div>
      ),
    },
    {
      id: 'ch07-linear', title: 'First & Second Order Linear ODEs', titleZh: '一阶线性 & 二阶常系数方程',
      content: () => (
        <div className="section-content">
          <h2>7.2 线性微分方程</h2>

          <div className="story-box">
            <h4>☕ 牛顿冷却定律</h4>
            <p>一杯 90°C 的咖啡放在 20°C 的房间里。牛顿观察到：<strong>冷却速率与温差成正比</strong>。</p>
            <p>dT/dt = −k(T − 20)，其中 T 是咖啡温度，20 是室温。</p>
            <p>这是一阶线性方程。解：T(t) = 20 + 70e^(−kt)。温度从 90 指数衰减到室温 20——不会低于室温，不会振荡。</p>
          </div>

          <h3>一阶线性微分方程</h3>
          <p>标准形式：y' + P(x)y = Q(x)</p>
          <p><strong>通解公式（积分因子法）：</strong></p>
          <p><Formula latex="y = e^{-\int P\,dx}\left[\int Q\,e^{\int P\,dx}dx + C\right]" /></p>

          <div className="example-box">
            <h4>💰 经济学案例：市场价格的动态调整</h4>
            <p>设某种商品的市场价格 P(t) 随时间调整：价格变化率与超额需求成正比。</p>
            <p>dP/dt = k·(D(P) − S(P))，其中 D(P)=a−bP 是需求，S(P)=c+dP 是供给。</p>
            <p>代入：dP/dt = k(a−c) − k(b+d)P。这是标准的一阶线性方程。</p>
            <p>解：P(t) = P* + (P₀−P*)e^(−k(b+d)t)，其中 P* = (a−c)/(b+d) 是均衡价格。</p>
            <p>无论初始价格 P₀ 是多少，价格都会<strong>指数收敛</strong>到均衡 P*——市场是<strong>稳定的</strong>。这解释了为什么亚当·斯密的"看不见的手"在数学上是合理的。</p>
          </div>

          <h3>二阶常系数线性方程</h3>
          <p>y'' + ay' + by = 0</p>
          <p>设 y = e^(rt)，代入得<strong>特征方程</strong>：r² + ar + b = 0。根的判别式 Δ = a² − 4b 决定解的类型：</p>
          <table className="stats-table">
            <thead><tr><th>判别式</th><th>根</th><th>解的行为</th><th>经济学对应</th></tr></thead>
            <tbody>
              <tr><td>Δ &gt; 0</td><td>两不等实根</td><td>指数衰减/增长</td><td>稳定/不稳定均衡</td></tr>
              <tr><td>Δ = 0</td><td>重根</td><td>临界阻尼</td><td>最快收敛路径</td></tr>
              <tr><td>Δ &lt; 0</td><td>共轭复根</td><td>阻尼振荡</td><td>经济周期/蛛网模型</td></tr>
            </tbody>
          </table>

          <div className="example-box">
            <h4>📉 经济周期模型（Samuelson 乘数-加速数模型）</h4>
            <p>国民收入 Y 满足：Y'' + 2ζωY' + ω²Y = 0。</p>
            <p>当 ζ &lt; 1（阻尼不足），解为衰减振荡——经济经历繁荣-衰退周期，但振幅逐渐减小。当 ζ &gt; 1（过阻尼），经济单调趋于均衡——没有周期。</p>
            <p>这就是为什么宏观经济学关心"二阶微分方程的特征根"——它直接决定了经济是<strong>平稳增长</strong>还是<strong>周期性波动</strong>。</p>
          </div>

          <PracticeProblem
            context="第七章 微分方程 - 二阶常系数线性方程"
            question="求解微分方程 y'' − 5y' + 6y = 0。先写出特征方程 r²−5r+6=0，求特征根，然后写出通解形式。"
            hint="提示：特征方程 r²−5r+6=0 的根为 r=2 和 r=3（两不等实根）。通解为 y=C₁e^(2x)+C₂e^(3x)。"
          />
        </div>
      ),
    },
    {
      id: 'ch07-systems', title: 'Systems of ODEs & Eigenvalues', titleZh: '微分方程组 — 特征值方法',
      visual: ODESystemsViz,
      laBridgeZh: '线性微分方程组 d𝐱/dt = A𝐱 的解是 e^(λt)𝐯，其中 λ 和 𝐯 是 A 的特征值和特征向量。这直接联系了微分方程和线性代数：特征值决定稳定性（实部 &lt; 0 = 稳定），特征向量决定运动方向。矩阵指数 e^(At) 通过特征分解 e^(At) = Pe^(Dt)P⁻¹ 计算——微分方程求解 = 矩阵对角化。',
      content: () => (
        <div className="section-content">
          <h2>7.3 微分方程组：当多个变量同时演化</h2>

          <div className="story-box">
            <h4>🦊🐰 狐狸与兔子——Lotka-Volterra 捕食者-猎物模型</h4>
            <p>在一个封闭生态系统中：</p>
            <ul>
              <li>兔子 (R)：没有狐狸时指数增长，有狐狸时被吃掉</li>
              <li>狐狸 (F)：没有兔子时饿死，有兔子时繁衍</li>
            </ul>
            <p>dR/dt = aR − bRF &emsp; dF/dt = −cF + dRF</p>
            <p>这不是一个方程，而是<strong>两个耦合的方程</strong>——兔子的变化取决于狐狸数量，狐狸的变化取决于兔子数量。</p>
            <p>这个系统的解是<strong>周期轨道</strong>——兔子和狐狸的数量此消彼长，永远循环。这就是生态学中著名的"捕食者-猎物振荡"。</p>
          </div>

          <h3>线性微分方程组</h3>
          <p>d𝐱/dt = A𝐱，其中 𝐱 是向量，A 是矩阵。</p>
          <p><strong>解的形式：</strong>𝐱(t) = c₁e^(λ₁t)𝐯₁ + c₂e^(λ₂t)𝐯₂（当 A 可对角化时）</p>

          <div className="definition-box">
            <h4>📖 特征值决定命运</h4>
            <p>方程 d𝐱/dt = A𝐱 的长期行为完全由 A 的<strong>特征值</strong>决定：</p>
            <table className="stats-table">
              <thead><tr><th>特征值</th><th>相图类型</th><th>稳定性</th><th>经济学案例</th></tr></thead>
              <tbody>
                <tr><td>λ₁,λ₂ &lt; 0（实）</td><td>稳定结点</td><td>渐近稳定</td><td>价格向均衡收敛</td></tr>
                <tr><td>λ₁,λ₂ &gt; 0（实）</td><td>不稳定源</td><td>发散</td><td>恶性通胀</td></tr>
                <tr><td>λ₁&lt;0&lt;λ₂（实）</td><td>鞍点</td><td>条件稳定</td><td>Solow 增长模型</td></tr>
                <tr><td>复根，实部&lt;0</td><td>稳定焦点</td><td>振荡收敛</td><td>阻尼经济周期</td></tr>
                <tr><td>纯虚根</td><td>中心</td><td>周期轨道</td><td>捕食者-猎物模型</td></tr>
              </tbody>
            </table>
          </div>

          <div className="example-box">
            <h4>🏭 Solow 经济增长模型</h4>
            <p>资本存量 k 的动态：dk/dt = s·f(k) − (n+δ)k</p>
            <p>其中 s 是储蓄率，f(k) 是生产函数，n 是人口增长率，δ 是折旧率。</p>
            <p>稳态：s·f(k*) = (n+δ)k*。在稳态附近线性化：d(k−k*)/dt ≈ −λ(k−k*)。</p>
            <p>特征值 λ = −(n+δ − s·f'(k*))。若 λ &gt; 0（即 f'(k*) &gt; (n+δ)/s），稳态是<strong>鞍点稳定</strong>——经济会收敛到稳态，但收敛速度取决于资本边际产出与折旧率之差。</p>
            <p>这就是为什么<strong>所有的宏观经济学动态分析</strong>最终都归结于微分方程的特征值问题。</p>
          </div>

          <div className="insight-box highlight">
            <h4>💡 终极桥梁：微分方程 = 线性代数 + 微积分</h4>
            <p>线性微分方程组 d𝐱/dt = A𝐱 的求解过程是线代和微积分最完美的结合：</p>
            <ol>
              <li>用<strong>特征值分解</strong>把 A 对角化 → 将耦合系统解耦为独立的一阶方程</li>
              <li>每个独立方程 d(zᵢ)/dt = λᵢzᵢ 的解是 zᵢ = cᵢe^(λᵢt)</li>
              <li>通过特征向量<strong>变换回原坐标系</strong>：𝐱(t) = P diag(e^(λᵢt)) P⁻¹𝐱(0) = e^(At)𝐱(0)</li>
            </ol>
            <p>矩阵指数 e^(At) 就是线性微分方程的<strong>传播子</strong>——它告诉你初始状态如何随时间演化。</p>
          </div>

          <PracticeProblem
            context="第七章 微分方程 - 微分方程组与特征值方法"
            question="对于微分方程组 dx/dt=−x+2y, dy/dt=−2x−y。写出矩阵形式 d𝐱/dt=A𝐱，求 A 的特征值，并判断系统在原点处的稳定性（稳定结点/鞍点/焦点等）。"
            hint="提示：A = [[−1,2],[−2,−1]]。特征方程 λ²+2λ+5=0。判别式 4−20=−16，特征根为复根。判断实部符号决定稳定性。"
          />
        </div>
      ),
    },
  ],
};
