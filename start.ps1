# SiKesKoja - Sistem Pendataan Kesehatan
# Start Script for Windows PowerShell

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    SiKesKoja Health System" -ForegroundColor Green
Write-Host "    Starting Application..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Check if client/node_modules exists
if (-not (Test-Path "client\node_modules")) {
    Write-Host "[INFO] Installing client dependencies..." -ForegroundColor Yellow
    Push-Location client
    npm install
    Pop-Location
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install client dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "[WARNING] .env file not found!" -ForegroundColor Yellow
    Write-Host "Creating .env from .env.example..."
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "[SUCCESS] .env file created" -ForegroundColor Green
        Write-Host "[INFO] Please update .env with your database credentials" -ForegroundColor Yellow
    } else {
        Write-Host "[ERROR] .env.example not found" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Generate Prisma Client
Write-Host ""
Write-Host "[INFO] Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Failed to generate Prisma Client" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Check database connection
Write-Host ""
Write-Host "[INFO] Checking database connection..." -ForegroundColor Yellow
$null = npx prisma db push --accept-data-loss 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Database connection failed!" -ForegroundColor Red
    Write-Host "[INFO] Please check your DATABASE_URL in .env file" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "[SUCCESS] Database connected successfully" -ForegroundColor Green

# Start the application
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "[SUCCESS] All checks passed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting Backend & Frontend..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Yellow
Write-Host ""

# Run both backend and frontend
npm run dev
