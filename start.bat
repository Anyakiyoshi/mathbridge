@echo off
title MathBridge
cd /d "%~dp0"

echo.
echo   ====================================
echo     MathBridge - 微积分 ^& 线性代数
echo   ====================================
echo.
echo   [1] 桌面窗口模式 (推荐)
echo   [2] 浏览器模式
echo   [3] 开发模式 (热更新)
echo.

set /p choice="请选择 (1/2/3): "

if "%choice%"=="1" goto desktop
if "%choice%"=="2" goto browser
if "%choice%"=="3" goto dev
goto desktop

:desktop
echo.
echo   正在启动桌面应用...
echo.
if exist "release\MathBridge.exe" (
    start "" "release\MathBridge.exe"
) else (
    echo   尚未构建，请先运行: npm run build:desktop
    echo   现在启动浏览器模式...
    goto browser
)
goto end

:browser
echo.
echo   正在启动浏览器模式...
echo.
start "" http://localhost:3000
npx serve dist -l 3000 --no-clipboard
goto end

:dev
echo.
echo   正在启动开发模式...
echo.
start "" http://localhost:5173
npm run dev
goto end

:end
pause
