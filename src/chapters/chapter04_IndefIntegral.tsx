import type { Chapter } from '../store/useStore';
import Formula from '../components/Formula';
import { AntiderivViz } from './visuals/Antiderivative';
import { IntegrationViz } from './visuals/Integration';

export const chapter04: Chapter = {
  id: 'ch04', number: 4, title: 'Indefinite Integrals', titleZh: '不定积分', volume: 1,
  sections: [
    {
      id: 'ch04-antideriv', title: 'Antiderivatives', titleZh: '原函数 & 不定积分族',
      visual: AntiderivViz,
      laBridgeZh: '求导是一个线性变换 d/dx: C¹→C⁰。不定积分是其逆变换——但逆不是唯一的（相差常数）。这体现了线性映射的核空间：ker(d/dx) = 常值函数。',
      content: () => (
        <div className="section-content">
          <h2>4.1 不定积分</h2>
          <p>不定积分是求导的逆运算：<Formula latex="\int f(x)dx = F(x) + C" />，其中 <Formula latex="F'(x) = f(x)" />。</p>
          <p>常数 C 的任意性反映了"求导会丢失常数信息"这一事实——<strong>导数映射的核空间 = 常值函数集合</strong>。</p>
          <div className="theorem-box">
            <h4>基本积分公式</h4>
            <ul>
              <li><Formula latex="\int x^n dx = \frac{x^{n+1}}{n+1} + C" /> (n≠-1)</li>
              <li><Formula latex="\int e^x dx = e^x + C" /></li>
              <li><Formula latex="\int \sin x dx = -\cos x + C" /></li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 'ch04-techniques', title: 'Integration Techniques', titleZh: '换元法 & 分部积分法',
      visual: IntegrationViz,
      content: () => (
        <div className="section-content">
          <h2>4.2 积分技巧</h2>
          <h3>第一类换元法（凑微分）</h3>
          <p><Formula latex="\int f(g(x))g'(x)dx = \int f(u)du" /> (u = g(x))</p>
          <h3>分部积分法</h3>
          <p><Formula latex="\int u dv = uv - \int v du" /> —— 来自乘积的导数公式。</p>
          <div className="example-box">
            <p><strong>例：</strong> <Formula latex="\int x e^x dx = x e^x - e^x + C" /></p>
            <p>取 u=x, dv=eˣdx。经济意义：消费者剩余的积分计算常用此法。</p>
          </div>
        </div>
      ),
    },
  ],
};
