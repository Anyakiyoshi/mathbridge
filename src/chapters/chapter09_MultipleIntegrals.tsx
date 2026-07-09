import type { Chapter } from '../store/useStore';
import Formula from '../components/Formula';
import { DoubleIntegralViz } from './visuals/DoubleIntegral';
import PracticeProblem from '../components/PracticeProblem';

export const chapter09: Chapter = {
  id: 'ch09', number: 9, title: 'Multiple Integrals', titleZh: '重积分', volume: 2,
  sections: [
    {
      id: 'ch09-double', title: 'Double Integrals', titleZh: '二重积分：连续的二维求和',
      visual: DoubleIntegralViz,
      content: () => (
        <div className="section-content">
          <h2>9.1 二重积分——把三维体积切成无穷根柱子</h2>

          <div className="story-box">
            <h4>⛰️ 地形图的体积</h4>
            <p>你有一张地形图，每个点 (x,y) 上标了海拔高度 f(x,y)。怎么计算这片山地的<strong>总土方量</strong>（曲面下方的体积）？</p>
            <p>把地面切成 n×m 的小方格，每个方格上竖一根柱子：体积 = 底面积 × f(xᵢ,yⱼ)。所有柱子加在一起→网格细化→极限就是<strong>二重积分</strong>。</p>
            <p>这和定积分的思路一模一样——只不过从一维的"小矩形"变成了二维的"小柱子"。</p>
          </div>

          <div className="definition-box">
            <h4>📖 二重积分定义</h4>
            <p><Formula latex="\iint_D f(x,y)\,dA = \lim_{\max \Delta A_i \to 0} \sum f(x_i, y_i) \Delta A_i" /></p>
            <p>其中 ΔAᵢ = Δxᵢ·Δyⱼ 是小矩形的面积。</p>
          </div>

          <div className="insight-box highlight">
            <h4>🧮 代数视角：二重积分 = 双重线性型</h4>
            <p>回忆线代：双线性型 B(u,v) 接受两个向量、返回一个标量，且对每个变量都是线性的。二重积分 ∬ f(x)g(y) dxdy 可以分解为 ∫ f(x)dx · ∫ g(y)dy——两个独立积分的乘积。</p>
            <p>Fubini 定理说<strong>只要 f 良好，积分次序可以交换</strong>：∬ f dxdy = ∫[∫ f dx] dy = ∫[∫ f dy] dx。这和矩阵的"先行后列"或"先列后行"求和结果一致——都是同一个总和，只是累加顺序不同。</p>
          </div>

          <h3>化为累次积分（迭代积分）</h3>
          <p>矩形区域上的二重积分 = 先对 x 积分再对 y 积分（或反过来）：</p>
          <p><Formula latex="\iint_{[a,b]\times[c,d]} f(x,y)\,dxdy = \int_c^d \left(\int_a^b f(x,y)\,dx\right) dy" /></p>
          <div className="example-box">
            <h4>📝 例1：矩形区域</h4>
            <p>∬ x^2y dxdy，区域 D=[0,1]×[0,2]。</p>
            <p>= ∫_0^2 [∫_0^1 x^2y dx] dy = ∫_0^2 y·[x^3/3]_0^1 dy = ∫_0^2 (y/3) dy = [y^2/6]_0^2 = 4/6 = 2/3。</p>
          </div>

          <div className="example-box">
            <h4>📝 例2：非矩形区域——先画图！</h4>
            <p>∬ x dxdy，D 由 y=x^2 和 y=x 围成。</p>
            <p>区域：0≤x≤1, x^2≤y≤x（先 x 后 y 更简单）。</p>
            <p>= ∫_0^1 [∫_{x^2}^{x} x dy] dx = ∫_0^1 x·(x−x^2) dx = ∫_0^1 (x^2−x^3) dx = 1/3−1/4 = 1/12。</p>
          </div>

          <h3>换元公式——Jacobian 的主角时刻</h3>
          <div className="theorem-box">
            <h4>📐 二重积分换元公式</h4>
            <p><Formula latex="\iint_D f(x,y)\,dxdy = \iint_{D'} f(u,v)\,|J|\,dudv" /></p>
            <p>其中 <Formula latex="J = \frac{\partial(x,y)}{\partial(u,v)} = \det\begin{pmatrix}x_u & x_v \\ y_u & y_v\end{pmatrix}" /> 是 Jacobian 行列式。</p>
          </div>

          <div className="insight-box highlight">
            <h4>🧮 这是整个微积分课程最重要的线代时刻</h4>
            <p>|J| 就是坐标变换的<strong>面积缩放因子</strong>。线代中：线性变换 A 把单位正方形变成平行四边形，面积缩放 |det(A)|。这里：(u,v)→(x(u,v), y(u,v)) 一般是非线性的，但在每个局部点，Jacobian J 就是那个点的<strong>最佳线性近似</strong>的矩阵。</p>
            <p>所以 |J| = "局部面积缩放因子"。这和 1D 换元 dx = (dx/du)·du 中的 dx/du 完全一样——都是导数/行列式的绝对值。1D 是 |dx/du|，2D 是 |det(J)|，nD 仍是 |det(J)|。</p>
          </div>

          <div className="example-box">
            <h4>📝 极坐标换元（最重要！）</h4>
            <p>x=r cosθ, y=r sinθ → J = det[[cosθ, −r sinθ], [sinθ, r cosθ]] = r。</p>
            <p>dxdy → r dr dθ。那个多出来的 <strong>r</strong> 就是极坐标的面积元——半径越大，同样的 dr dθ 覆盖的面积越大。</p>
          </div>

          <div className="example-box">
            <h4>📝 例3：高斯积分（整个概率论的基石）</h4>
            <p>计算 I = ∫₋∞^∞ e^(−x^2) dx。这是一个定积分——但用一维方法算不出来！</p>
            <p><strong>技巧：</strong>I^2 = (∫ e^(−x^2)dx)(∫ e^(−y^2)dy) = ∬ e^(−(x^2+y^2)) dxdy。换极坐标：</p>
            <p>= ∫_0^(2π) ∫_0^∞ e^(−r^2)·r dr dθ = 2π·[−e^(−r^2)/2]_0^∞ = π。所以 I = √π。</p>
            <p>正态分布的归一化常数 1/√(2π) 就来自这个计算！</p>
          </div>

          <PracticeProblem context="第九章 重积分 - 二重积分的几何意义与计算" />
        </div>
      ),
    },
    {
      id: 'ch09-triple', title: 'Triple Integrals & Coordinate Systems', titleZh: '三重积分与坐标系',
      content: () => (
        <div className="section-content">
          <h2>9.2 三重积分——空间的累加</h2>

          <div className="story-box">
            <h4>🌍 地球的质量</h4>
            <p>地球不是均匀密度的——地核密度远大于地壳。怎么算地球的总质量？把地球切成无穷小的立方体，每个立方体的质量 = 密度 × 体积。所有立方体求和 → 三重积分。</p>
          </div>

          <h3>三大坐标系的 Jacobian</h3>
          <table className="stats-table">
            <thead><tr><th>坐标系</th><th>变换</th><th>|J|</th><th>适用于</th></tr></thead>
            <tbody>
              <tr><td>直角坐标</td><td>(x,y,z)</td><td>1</td><td>长方体</td></tr>
              <tr><td>柱坐标</td><td>(r,θ,z)</td><td>r</td><td>圆柱、旋转体</td></tr>
              <tr><td>球坐标</td><td>(ρ,φ,θ)</td><td>ρ^2sin φ</td><td>球体、锥体</td></tr>
            </tbody>
          </table>

          <div className="insight-box highlight">
            <h4>🧮 Jacobian = 局部体积缩放因子</h4>
            <p>球坐标中 dV = ρ^2sin φ dρ dφ dθ。ρ^2sin φ 从哪来？它就是球坐标变换的 Jacobian 行列式的绝对值。几何上：ρ^2dρ 是径向方向的"面积"，sin φ dφ dθ 是角方向的"立体角"——两者相乘 = 局部体积元。</p>
            <p>这和线代课上学到的"平行六面体的体积 = |det([u v w])|"是完全一致的——只不过这里三个列向量是坐标变换在局部的切向量 (∂r/∂ρ, ∂r/∂φ, ∂r/∂θ)。</p>
          </div>

          <div className="example-box">
            <h4>📝 例：半径为 R 的球体体积</h4>
            <p>V = ∭ 1 dV = ∫_0^(2π) ∫_0^π ∫_0^R ρ^2sin φ dρ dφ dθ。</p>
            <p>= 2π·[−cos φ]_0^π·[ρ^3/3]_0^R = 2π·2·R^3/3 = 4πR^3/3。✓</p>
          </div>

          <div className="example-box">
            <h4>📊 经济学案例：三维正态分布</h4>
            <p>金融中多个资产的联合收益分布是多元正态。它的密度在整个 ℝ^3 上的积分必须 = 1——这个归一化条件的验证依赖于三重积分的球坐标换元，结论是 1/√[(2π)^3|Σ|]。</p>
          </div>

          <PracticeProblem context="第九章 重积分 - 三重积分与坐标系" />
        </div>
      ),
    },
  ],
};
