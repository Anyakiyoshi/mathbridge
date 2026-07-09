@echo off
title MathBridge
cd /d "%~dp0"

echo.
echo   ====================================
echo     MathBridge - 微积分 ^& 线性代数
echo   ====================================
echo.
echo   正在启动...
echo.

start "" http://localhost:5173
npm run dev
