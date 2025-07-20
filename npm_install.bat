@echo off
setlocal

echo ===============================
echo 1. Checking if Node.js is installed...
echo ===============================

node -v >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Node.js is not installed. Downloading and installing Node.js...
    REM 
    set "NODE_INSTALLER=node-v18.17.1-x64.msi"

    REM 
    curl -o %NODE_INSTALLER% https://nodejs.org/dist/v18.17.1/%NODE_INSTALLER%
    if %ERRORLEVEL% neq 0 (
        echo Error downloading Node.js installer.
        exit /b 1
    )

    REM 
    msiexec /i %NODE_INSTALLER% /quiet /norestart
    if %ERRORLEVEL% neq 0 (
        echo Node.js installation failed.
        exit /b 1
    )
    echo Node.js installed successfully.
) else (
    echo Node.js is already installed.
)

echo ===============================
echo 2. Installing required npm packages...
echo ===============================

REM 
npm install node-fetch
npm install axios
npm install moment

echo ===============================
echo Setup complete.
echo ===============================

pause
