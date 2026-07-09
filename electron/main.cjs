// electron/main.js — MathBridge Electron 主进程
const { app, BrowserWindow } = require('electron');
const path = require('path');

// 判断是否为开发模式
const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 650,
    title: 'MathBridge — 微积分 & 线性代数',
    icon: path.join(__dirname, '../public/favicon.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // 去掉默认菜单栏
  win.setMenuBarVisibility(false);

  if (isDev) {
    // 开发模式：加载 Vite 开发服务器
    win.loadURL('http://localhost:5173');
    // 可选：自动打开 DevTools
    // win.webContents.openDevTools();
  } else {
    // 生产模式：加载打包后的静态文件
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // 外部链接在默认浏览器中打开
  win.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
