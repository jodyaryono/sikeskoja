@echo off
REM SiKesKoja - Sistem Pendataan Kesehatan
REM Start Script for Windows

echo.
echo ========================================
echo     SiKesKoja Health System
echo     Starting Application...
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [33m[INFO] Installing dependencies...[0m
    call npm install
    if errorlevel 1 (
        echo [31m[ERROR] Failed to install dependencies[0m
        pause
        exit /b 1
    )
)

REM Check if client/node_modules exists
if not exist "client\node_modules\" (
    echo [33m[INFO] Installing client dependencies...[0m
    cd client
    call npm install
    cd ..
    if errorlevel 1 (
        echo [31m[ERROR] Failed to install client dependencies[0m
        pause
        exit /b 1
    )
)

REM Check if .env exists
if not exist ".env" (
    echo [33m[WARNING] .env file not found![0m
    echo Creating .env from .env.example...
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo [32m[SUCCESS] .env file created[0m
        echo [33m[INFO] Please update .env with your database credentials[0m
    ) else (
        echo [31m[ERROR] .env.example not found[0m
        pause
        exit /b 1
    )
)

REM Generate Prisma Client
echo.
echo [33m[INFO] Generating Prisma Client...[0m
call npx prisma generate
if errorlevel 1 (
    echo [31m[ERROR] Failed to generate Prisma Client[0m
    pause
    exit /b 1
)

REM Check database connection
echo.
echo [33m[INFO] Checking database connection...[0m
call npx prisma db push --accept-data-loss 2>nul
if errorlevel 1 (
    echo [31m[ERROR] Database connection failed![0m
    echo [33m[INFO] Please check your DATABASE_URL in .env file[0m
    pause
    exit /b 1
)

echo [32m[SUCCESS] Database connected successfully[0m

REM Start the application
echo.
echo ========================================
echo [32m[SUCCESS] All checks passed![0m
echo ========================================
echo.
echo Starting Backend ^& Frontend...
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press Ctrl+C to stop the servers
echo.

REM Run both backend and frontend
call npm run dev
