@echo off
SETLOCAL EnableDelayedExpansion

TITLE TaskFlow Launcher

echo ==========================================
echo       TaskFlow Application Launcher
echo ==========================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if node_modules exists
if not exist "node_modules\" (
    echo [INFO] node_modules not found. Installing dependencies...
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
      )
)

:: Start the application
echo [INFO] Starting the development server...
echo.
call npm run dev

pause
