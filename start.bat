@echo off
chcp 65001 >nul
title 创收资产管家

echo.
echo   ╔══════════════════════════════╗
echo   ║   创收资产管家 · 迷你CFO   ║
echo   ╚══════════════════════════════╝
echo.

:: 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo   [X] 未检测到 Node.js
    echo   请先安装 Node.js (LTS v18+)
    echo   下载地址: https://nodejs.org/zh-cn
    echo.
    pause
    exit /b 1
)

:: 首次运行：安装 pnpm + 依赖
if not exist "node_modules\" (
    echo   [1/2] 首次运行，安装依赖中...
    call npm install -g pnpm >nul 2>&1
    call pnpm install
    echo.
)

:: 构建
if not exist ".next\" (
    echo   [2/2] 首次运行，构建应用中...
    call pnpm build
    echo.
)

echo   ========================================
echo   地址: http://localhost:4002
echo   数据保存在浏览器中，不会上传到任何服务器
echo   按 Ctrl+C 或关闭此窗口停止运行
echo   ========================================
echo.

start "" http://localhost:4002
call pnpm start
pause
