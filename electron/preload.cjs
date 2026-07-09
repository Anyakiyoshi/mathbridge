// electron/preload.js — MathBridge 预加载脚本
// 当前仅做最小设置，未来可通过 contextBridge 暴露安全 API

const { contextBridge } = require('electron');

// 暴露应用信息给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  platform: process.platform,
});
