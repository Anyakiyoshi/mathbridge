# MathBridge — 微积分 ↔ 线性代数 直观桥梁

交互式数学可视化应用，专为经济学/数学学习者设计，将高等数学（微积分）与线性代数通过可视化打通。

## 🚀 快速开始（Windows）

### 方式一：一键启动（推荐）
双击项目根目录的 **`start.bat`**，自动打开浏览器进入应用。

### 方式二：命令行
```bash
npm install
npm run dev        # 开发模式（热更新）
npm run build      # 构建 dist/
npm run start      # 预览构建产物
```

## 📦 六大模块

| 模块 | 说明 |
|------|------|
| **A — 泰勒级数展开** | 5 种函数，逐阶逼近可视化，系数 = 基坐标 |
| **B — 导数即线性映射** | 1D/2D/2D→2D 三视图，Jacobian 矩阵 |
| **C — 2×2 线性变换** | 网格变形、特征值、行列式，10 种预设 |
| **D — 二次型 & Hessian** | 3D 曲面，正定/负定/马鞍形，Hessian 判据 |
| **E — 梯度下降** | 3D 轨迹动画，学习率，条件数分析 |
| **F — 最小二乘法** | 微积分 × 线代双视角，RSS 曲面 |

## 🌐 部署为网站（GitHub Pages）

```bash
# 修改 vite.config.ts 中的 base 为你的仓库名，例如:
# base: '/mathbridge/'

npm run build:pages
npm run deploy
```

部署后访问 `https://<你的用户名>.github.io/mathbridge/`。

## 🛠 技术栈

React 19 · TypeScript · Vite · Three.js (react-three-fiber) · Canvas API · D3.js · KaTeX · Zustand
