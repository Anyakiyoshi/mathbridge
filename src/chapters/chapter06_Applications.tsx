import type { Chapter } from '../store/useStore';
import Formula from '../components/Formula';
import { VolumeViz } from './visuals/VolumeRevolution';

export const chapter06: Chapter = {
  id: 'ch06', number: 6, title: 'Applications of Integrals', titleZh: '定积分的应用', volume: 1,
  sections: [
    {
      id: 'ch06-area', title: 'Area & Volume of Revolution', titleZh: '面积 & 旋转体体积',
      visual: VolumeViz,
      laBridgeZh: '计算面积和体积的积分公式本质上是"累加无穷小量"——这和高维空间的体积张量（Jacobian 行列式）思想一致。多重积分中你会看到完整的形式。',
      content: () => (
        <div className="section-content">
          <h2>6.1 平面面积</h2>
          <p><Formula latex="A = \int_a^b [f(x) - g(x)]dx" /></p>
          <h3>旋转体体积</h3>
          <p>绕 x 轴旋转：<Formula latex="V = \pi \int_a^b [f(x)]^2 dx" /> （圆盘法）</p>
          <p>绕 y 轴旋转：<Formula latex="V = 2\pi \int_a^b x f(x) dx" /> （壳层法）</p>
          <h3>弧长</h3>
          <p><Formula latex="L = \int_a^b \sqrt{1 + [f'(x)]^2} dx" /> —— 源自勾股定理。</p>
        </div>
      ),
    },
    {
      id: 'ch06-surface', title: 'Arc Length & Surface Area', titleZh: '弧长 & 旋转曲面面积',
      content: () => (
        <div className="section-content">
          <h2>6.2 弧长与曲面面积</h2>
          <p>曲线 <Formula latex="y=f(x)" /> 从 a 到 b 的弧长：<Formula latex="L = \int_a^b \sqrt{1 + (y')^2}dx" /></p>
          <p>这是将曲线切成小段，每段近似为直线（毕达哥拉斯定理），然后求和→积分的典型过程。</p>
          <p>旋转曲面面积：<Formula latex="S = 2\pi \int_a^b f(x)\sqrt{1+[f'(x)]^2}dx" /></p>
        </div>
      ),
    },
  ],
};
