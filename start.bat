@echo off
title MathBridge - 微积分 & 线性代数可视化
echo.
echo   ======================================
echo     MathBridge  微积分 - 线性代数桥梁
echo   ======================================
echo.
echo   正在启动本地服务器...
echo.

cd /d "%~dp0"
start "" http://localhost:3000
npx serve dist -l 3000 --no-clipboard

pause
