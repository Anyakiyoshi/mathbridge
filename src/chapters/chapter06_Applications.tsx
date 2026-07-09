import type { Chapter } from '../store/useStore';
import Formula from '../components/Formula';
import { VolumeViz } from './visuals/VolumeRevolution';
import PracticeProblem from '../components/PracticeProblem';

export const chapter06: Chapter = {
  id: 'ch06', number: 6, title: 'Applications of Integrals', titleZh: '定积分的应用', volume: 1,
  sections: [
    {
      id: 'ch06-area', title: 'Area & Volume of Revolution', titleZh: '面积 & 旋转体体积',
      visual: VolumeViz,
      content: () => (
        <div className="section-content">
          <h2>6.1 定积分求面积和体积——把二维切成面条，把三维切成圆盘</h2>

          <div className="story-box">
            <h4>🏺 陶艺拉坯与积分</h4>
            <p>陶工在转盘上放一团黏土。手指从中心向外推——黏土被拉伸成碗形。这个碗的体积怎么算？</p>
            <p>把碗横切成无数片<strong>无穷薄的圆盘</strong>。每片的体积 = π×(半径)²×厚度。把所有这些圆盘的体积累加起来——就是定积分。</p>
            <p>这就是<strong>圆盘法 (Disk Method)</strong> 的直觉。壳层法 (Shell Method) 则是纵切——像剥洋葱一样把碗剥成无数层。</p>
          </div>

          <h3>平面面积</h3>
          <p>两条曲线之间的面积 = ∫ [上曲线 − 下曲线] dx。这是定积分最基本的几何应用。</p>
          <div className="example-box">
            <h4>📝 例：求 y=x² 与 y=x 围成的面积</h4>
            <p>交点：x²=x → x=0 或 x=1。在 [0,1] 上，x ≥ x²。</p>
            <p>面积 = ∫₀¹ (x − x²) dx = [x²/2 − x³/3]₀¹ = 1/2 − 1/3 = 1/6。</p>
          </div>

          <h3>旋转体体积——盘法 vs 壳法</h3>

          <div className="definition-box">
            <h4>📖 圆盘法（绕 x 轴）</h4>
            <p>切为垂直于旋转轴的圆盘：<Formula latex="V = \pi \int_a^b [f(x)]^2 dx" /></p>
            <p>每个圆盘的体积 = π×半径²×厚度。</p>
          </div>

          <div className="definition-box">
            <h4>📖 壳层法（绕 y 轴）</h4>
            <p>切为平行于旋转轴的壳层：<Formula latex="V = 2\pi \int_a^b x \cdot f(x) \, dx" /></p>
            <p>每个壳层的体积 = 周长(2πx) × 高度(f(x)) × 厚度(dx)。</p>
          </div>

          <div className="insight-box highlight">
            <h4>🧮 几何视角：盘与壳 = 两种坐标分解</h4>
            <p>盘法和壳法的选择本质上是<strong>坐标系的选择</strong>：</p>
            <ul>
              <li>盘法 = 沿旋转轴切片 → 笛卡尔坐标中垂直于轴的截面</li>
              <li>壳法 = 绕旋转轴剥层 → 柱坐标中的径向积分</li>
            </ul>
            <p>这和线代中"选择不同的基"是同一个思想——同一次积分（同一个体积），在不同坐标系下有不同的表达式。换元公式中的 Jacobian 行列式就是坐标变换的"缩放因子"。</p>
          </div>

          <div className="example-box">
            <h4>📝 例：y=√x (0≤x≤4) 绕 x 轴旋转</h4>
            <p><strong>盘法：</strong>V = π∫₀^4 (√x)² dx = π∫₀^4 x dx = π·[x²/2]₀^4 = 8π。</p>
            <p><strong>壳法也可用：</strong>绕 x 轴时，壳法是横向切片。V = 2π∫₀² y·(4−y²) dy = 8π（结果一致）。</p>
            <p><strong>选择原则：</strong>哪个切法表达更简单就用哪个。如果函数容易对 y 表达就用壳法，容易对 x 表达就用盘法。</p>
          </div>

          <div className="example-box">
            <h4>📊 经济学案例：基尼系数的几何解释</h4>
            <p>洛伦兹曲线 L(p) (0≤p≤1) 表示最穷 p% 的人口拥有的收入比例。完全平等时 L(p)=p（对角线）。</p>
            <p>基尼系数 G = A/(A+B)，其中 A = 对角线与洛伦兹曲线之间的面积，B = 洛伦兹曲线下方的面积。</p>
            <p>A = ∫₀¹ [p − L(p)] dp。G = 1 − 2∫₀¹ L(p) dp。这是"不平等面积 / 最大可能不平等面积"。</p>
          </div>

          <PracticeProblem context="第六章 定积分的应用 - 面积与旋转体体积" />
        </div>
      ),
    },
    {
      id: 'ch06-surface', title: 'Arc Length & Surface Area', titleZh: '弧长 & 旋转曲面面积',
      content: () => (
        <div className="section-content">
          <h2>6.2 弧长——把弯曲线段切成无穷小的直线段</h2>

          <div className="story-box">
            <h4>📏 测量河流的长度</h4>
            <p>地图上一条弯弯曲曲的河流，怎么量它的真实长度？用尺子沿着曲线一寸一寸地量？</p>
            <p>数学家的办法：把曲线切成 n 小段，每段近似为<strong>直线</strong>（毕达哥拉斯定理）。当 n→∞ 时，所有小直线段的总长度逼近真实弧长。</p>
            <p>这恰好是定积分的定义——黎曼和！只是被加的对象从"函数值×宽度"变成了"√(1+斜率²)×宽度"。</p>
          </div>

          <div className="definition-box">
            <h4>📖 弧长公式</h4>
            <p><Formula latex="L = \int_a^b \sqrt{1 + [f'(x)]^2} \, dx" /></p>
            <p>推导：切一小段 Δx，对应的曲线长度 ≈ √(Δx² + Δy²) = √(1+(Δy/Δx)²)·Δx → √(1+f'(x)²)·dx。</p>
          </div>

          <div className="insight-box highlight">
            <h4>🧮 几何视角：弧长 = 曲线的"1-维测度"</h4>
            <p>定积分 ∫ f dx 求的是"被积函数 f 在区间上的累加"。弧长公式中被积函数是 √(1+f'²) ——这是曲线的<strong>度量因子</strong>（metric factor）。</p>
            <p>在参数形式下，弧长 = ∫ √(dx²+dy²) = ∫ √(x'(t)²+y'(t)²) dt。被积函数是切向量的长度，也就是曲线在参数空间中<strong>长度元素 ds</strong>。</p>
            <p>这个思想推广到曲面就是第一基本形式（度量张量），到广义相对论就是时空的线元 ds²。</p>
          </div>

          <div className="example-box">
            <h4>📝 例1：悬链线 y = cosh x 从 x=0 到 x=1 的弧长</h4>
            <p>f'(x)=sinh x, 1+f'² = 1+sinh²x = cosh²x。√(1+f'²) = cosh x。</p>
            <p>L = ∫₀¹ cosh x dx = sinh(1)−sinh(0) = (e−1/e)/2 ≈ 1.175。</p>
            <p>悬链线的弧长恰好就是 sinh——这是双曲函数美妙的地方。</p>
          </div>

          <div className="example-box">
            <h4>📝 例2：圆的弧长——验证公式</h4>
            <p>上半圆 y=√(1−x²) (−1≤x≤1)。f'(x)=−x/√(1−x²)，1+f'² = 1/(1−x²)。</p>
            <p>L = ∫₋₁¹ 1/√(1−x²) dx = arcsin(1)−arcsin(−1) = π——恰好是半圆周长！</p>
          </div>

          <h3>旋转曲面面积</h3>
          <p>绕 x 轴旋转曲线的"表面积"：S = 2π ∫ f(x)·√(1+f'(x)²) dx。每个小段旋转出的"环带"面积 = 周长(2π·f(x)) × 弧长元(√(1+f'²)·dx)。</p>

          <PracticeProblem context="第六章 定积分的应用 - 弧长与旋转曲面面积" />
        </div>
      ),
    },
  ],
};
