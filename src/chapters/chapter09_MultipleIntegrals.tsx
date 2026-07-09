import type { Chapter } from '../store/useStore';
import Formula from '../components/Formula';
import { DoubleIntegralViz } from './visuals/DoubleIntegral';
import PracticeProblem from '../components/PracticeProblem';

export const chapter09: Chapter = {
  id: 'ch09', number: 9, title: 'Multiple Integrals', titleZh: '重积分', volume: 2,
  sections: [
    {
      id: 'ch09-double', title: 'Double Integrals', titleZh: '二重积分的几何意义',
      visual: DoubleIntegralViz,
      laBridgeZh: '二重积分 ∬ f(x,y)dxdy 可以看作对函数 f 和常函数 1 的"连续内积"。划分区域→求和→取极限的过程直接对应着多重线性代数中的张量积概念。Jacobian 行列式出现在换元公式中——这是线性变换 det(A) 的推广。',
      content: () => (
        <div className="section-content">
          <h2>9.1 二重积分</h2>
          <p><Formula latex="\iint_D f(x,y)\,dx\,dy = \lim \sum f(\xi_i,\eta_i)\Delta A_i" /></p>
          <p>几何意义：曲面下的体积。</p>
          <h3>换元公式</h3>
          <p><Formula latex="\iint f(x,y)dxdy = \iint f(u,v)|J|dudv" /></p>
          <p>其中 <Formula latex="J = \frac{\partial(x,y)}{\partial(u,v)}" /> 是 Jacobian 行列式。</p>
          <p>这就是线性变换行列式（面积缩放因子）在非线性情况下的推广！</p>

          <PracticeProblem context="第九章 重积分 - 二重积分的几何意义与计算" />
        </div>
      ),
    },
    {
      id: 'ch09-triple', title: 'Triple Integrals & Applications', titleZh: '三重积分',
      content: () => (
        <div className="section-content">
          <h2>9.2 三重积分</h2>
          <p>三重积分计算空间区域上的体积和质量。柱坐标和球坐标下的换元是最常见的技巧。</p>
          <p>经济学应用：多元概率密度函数在全空间的积分 = 1。</p>
        </div>
      ),
    },
  ],
};
