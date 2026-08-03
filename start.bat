@echo off
title Mini CFO - Asset Manager
cd /d "%~dp0"

echo.
echo   ===================================
echo       Mini CFO - Asset Manager
echo   ===================================
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo   [X] Node.js not found
    echo   Install Node.js LTS first:
    echo   https://nodejs.org
    echo.
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo   [1/2] First run: installing dependencies...
    npm install -g pnpm >nul 2>&1
    call pnpm install
    echo.
)

if not exist ".next\" (
    echo   [2/2] First run: building app...
    call pnpm build
    echo.
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":4002.*LISTENING" 2^>nul') do (
    taskkill //PID %%a //F >nul 2>&1
)

echo   ========================================
echo   URL: http://localhost:4002
echo   Data stored in browser, never uploaded
echo   Press Ctrl+C or close window to stop
echo   ========================================
echo.

start "" http://localhost:4002
node node_modules\next\dist\bin\next start -p 4002

if %errorlevel% neq 0 (
    echo.
    echo   [X] Start failed (code: %errorlevel%)
    echo   Quick fix: delete node_modules and .next
    echo   Then run this script again
    echo.
)
pause
