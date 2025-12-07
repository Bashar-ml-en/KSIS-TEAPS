# ================================================================
# KSIS - Unified Development Environment Startup Script
# ================================================================
# This script starts both Backend and Frontend with proper error handling
# and debugging capabilities

param(
    [switch]$DebugMode = $false
)

$ErrorActionPreference = "Continue"

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "   KSIS Development Environment - Unified Start Script" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan
Write-Host ""

# ================================================================
# CONFIGURATION
# ================================================================
$BACKEND_PORT = 8000
$FRONTEND_PORT = 3000
$BACKEND_PATH = Join-Path $PSScriptRoot "ksis-laravel"
$FRONTEND_PATH = "C:\Frontend(KSIS)"

# ================================================================
# HELPER FUNCTIONS
# ================================================================

function Write-Step {
    param([string]$Message)
    Write-Host "`n[STEP] $Message" -ForegroundColor Green
}

function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "[✓] $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "[✗] $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[!] $Message" -ForegroundColor Yellow
}

function Test-PortAvailable {
    param([int]$Port)
    try {
        $connection = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        return $null -eq $connection
    }
    catch {
        return $true
    }
}

function Stop-ProcessOnPort {
    param([int]$Port)
    
    try {
        $connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
        if ($connections) {
            foreach ($conn in $connections) {
                $process = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
                if ($process) {
                    Write-Warning "Stopping process '$($process.ProcessName)' (PID: $($process.Id)) on port $Port"
                    Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
                    Start-Sleep -Milliseconds 500
                }
            }
            Write-Success "Port $Port is now free"
            return $true
        }
    }
    catch {
        Write-Warning "Could not check port $Port : $_"
    }
    return $false
}

function Test-ServiceHealth {
    param(
        [string]$Url,
        [int]$MaxRetries = 10,
        [int]$RetryDelay = 2
    )
    
    for ($i = 1; $i -le $MaxRetries; $i++) {
        try {
            $response = Invoke-WebRequest -Uri $Url -TimeoutSec 5 -UseBasicParsing -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200 -or $response.StatusCode -eq 404) {
                return $true
            }
        }
        catch {
            if ($i -lt $MaxRetries) {
                Write-Info "Waiting for service at $Url (attempt $i/$MaxRetries)..."
                Start-Sleep -Seconds $RetryDelay
            }
        }
    }
    return $false
}

# ================================================================
# PRE-FLIGHT CHECKS
# ================================================================

Write-Step "Running Pre-Flight Checks..."

# Check if backend path exists
if (-not (Test-Path $BACKEND_PATH)) {
    Write-Error "Backend path not found: $BACKEND_PATH"
    exit 1
}

# Check if frontend path exists
if (-not (Test-Path $FRONTEND_PATH)) {
    Write-Error "Frontend path not found: $FRONTEND_PATH"
    exit 1
}

# Check PHP
try {
    $phpVersion = php -v 2>&1 | Select-String -Pattern "PHP (\d+\.\d+\.\d+)"
    if ($phpVersion) {
        Write-Success "PHP found: $($phpVersion.Matches[0].Groups[1].Value)"
    }
    else {
        Write-Error "PHP not found or version could not be determined"
        exit 1
    }
}
catch {
    Write-Error "PHP is not installed or not in PATH"
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node -v 2>&1
    Write-Success "Node.js found: $nodeVersion"
}
catch {
    Write-Error "Node.js is not installed or not in PATH"
    exit 1
}

# Check PostgreSQL connection
Write-Info "Checking PostgreSQL connection..."
try {
    $env:PGPASSWORD = "123"
    $null = & psql -U postgres -d ksis -c "SELECT 1;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "PostgreSQL connection successful"
    }
    else {
        Write-Warning "PostgreSQL connection failed. Make sure PostgreSQL is running."
    }
}
catch {
    Write-Warning "Could not verify PostgreSQL connection"
}

# ================================================================
# PORT MANAGEMENT
# ================================================================

Write-Step "Checking and Managing Ports..."

# Check Backend Port
if (-not (Test-PortAvailable -Port $BACKEND_PORT)) {
    Write-Warning "Port $BACKEND_PORT is already in use"
    $response = Read-Host "Do you want to stop the process using port ${BACKEND_PORT}? (Y/N)"
    if ($response -eq 'Y' -or $response -eq 'y') {
        Stop-ProcessOnPort -Port $BACKEND_PORT
    }
    else {
        Write-Error "Cannot start backend on port $BACKEND_PORT. Exiting."
        exit 1
    }
}
else {
    Write-Success "Port $BACKEND_PORT is available"
}

# Check Frontend Port
if (-not (Test-PortAvailable -Port $FRONTEND_PORT)) {
    Write-Warning "Port $FRONTEND_PORT is already in use"
    $response = Read-Host "Do you want to stop the process using port ${FRONTEND_PORT}? (Y/N)"
    if ($response -eq 'Y' -or $response -eq 'y') {
        Stop-ProcessOnPort -Port $FRONTEND_PORT
    }
    else {
        Write-Error "Cannot start frontend on port $FRONTEND_PORT. Exiting."
        exit 1
    }
}
else {
    Write-Success "Port $FRONTEND_PORT is available"
}

# ================================================================
# START BACKEND
# ================================================================

Write-Step "Starting Laravel Backend on http://localhost:$BACKEND_PORT..."

# Check .env file
$backendEnv = Join-Path $BACKEND_PATH ".env"
if (-not (Test-Path $backendEnv)) {
    Write-Warning ".env file not found in backend. Copying from .env.example..."
    Copy-Item (Join-Path $BACKEND_PATH ".env.example") $backendEnv
    Write-Info "Please configure $backendEnv with your database credentials"
}

# Start backend in new window
$backendTitle = "KSIS Backend (Laravel) - Port $BACKEND_PORT"
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "& {
        `$Host.UI.RawUI.WindowTitle = '$backendTitle'
        Write-Host '================================================================' -ForegroundColor Magenta
        Write-Host '   KSIS Backend Server (Laravel)' -ForegroundColor Magenta
        Write-Host '================================================================' -ForegroundColor Magenta
        Write-Host ''
        Write-Host 'Server URL: http://localhost:$BACKEND_PORT' -ForegroundColor Cyan
        Write-Host 'API Endpoint: http://localhost:$BACKEND_PORT/api' -ForegroundColor Cyan
        Write-Host ''
        Write-Host 'Press Ctrl+C to stop the server' -ForegroundColor Yellow
        Write-Host '================================================================' -ForegroundColor Magenta
        Write-Host ''
        cd '$BACKEND_PATH'
        php artisan serve --host=localhost --port=$BACKEND_PORT
    }"
)

Write-Info "Waiting for backend to start..."
Start-Sleep -Seconds 3

# Verify backend is running
if (Test-ServiceHealth -Url "http://localhost:$BACKEND_PORT") {
    Write-Success "Backend is running successfully!"
}
else {
    Write-Error "Backend failed to start. Check the backend terminal for errors."
    Write-Info "Common issues:"
    Write-Info "  - Database connection failed (check .env file)"
    Write-Info "  - Missing dependencies (run: composer install)"
    Write-Info "  - Port already in use"
    exit 1
}

# ================================================================
# START FRONTEND
# ================================================================

Write-Step "Starting React Frontend on http://localhost:$FRONTEND_PORT..."

# Check .env file
$frontendEnv = Join-Path $FRONTEND_PATH ".env"
if (-not (Test-Path $frontendEnv)) {
    Write-Warning ".env file not found in frontend. Creating one..."
    Set-Content -Path $frontendEnv -Value "VITE_API_URL=http://localhost:$BACKEND_PORT/api"
}

# Verify .env has correct API URL
$envContent = Get-Content $frontendEnv -Raw
if ($envContent -notmatch "VITE_API_URL") {
    Write-Warning "VITE_API_URL not found in .env. Adding it..."
    Add-Content -Path $frontendEnv -Value "`nVITE_API_URL=http://localhost:$BACKEND_PORT/api"
}

# Check if node_modules exists
if (-not (Test-Path (Join-Path $FRONTEND_PATH "node_modules"))) {
    Write-Warning "node_modules not found. Running npm install..."
    Write-Info "This may take a few minutes..."
    Push-Location $FRONTEND_PATH
    npm install
    Pop-Location
}

# Start frontend in new window
$frontendTitle = "KSIS Frontend (React + Vite) - Port $FRONTEND_PORT"
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "& {
        `$Host.UI.RawUI.WindowTitle = '$frontendTitle'
        Write-Host '================================================================' -ForegroundColor Blue
        Write-Host '   KSIS Frontend Server (React + Vite)' -ForegroundColor Blue
        Write-Host '================================================================' -ForegroundColor Blue
        Write-Host ''
        Write-Host 'Server URL: http://localhost:$FRONTEND_PORT' -ForegroundColor Cyan
        Write-Host 'API URL: http://localhost:$BACKEND_PORT/api' -ForegroundColor Cyan
        Write-Host ''
        Write-Host 'Press Ctrl+C to stop the server' -ForegroundColor Yellow
        Write-Host '================================================================' -ForegroundColor Blue
        Write-Host ''
        cd '$FRONTEND_PATH'
        npm run dev
    }"
)

Write-Info "Waiting for frontend to start..."
Start-Sleep -Seconds 5

# Verify frontend is running
if (Test-ServiceHealth -Url "http://localhost:$FRONTEND_PORT") {
    Write-Success "Frontend is running successfully!"
}
else {
    Write-Error "Frontend failed to start. Check the frontend terminal for errors."
    Write-Info "Common issues:"
    Write-Info "  - Missing dependencies (run: npm install)"
    Write-Info "  - Port already in use"
    Write-Info "  - Build errors (check syntax)"
    exit 1
}

# ================================================================
# FINAL STATUS
# ================================================================

Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host "   ✓ ALL SERVICES STARTED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Access your application:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  🌐 Frontend:  " -NoNewline -ForegroundColor White
Write-Host "http://localhost:$FRONTEND_PORT" -ForegroundColor Yellow
Write-Host "  🔧 Backend:   " -NoNewline -ForegroundColor White
Write-Host "http://localhost:$BACKEND_PORT" -ForegroundColor Yellow
Write-Host "  📡 API:       " -NoNewline -ForegroundColor White
Write-Host "http://localhost:$BACKEND_PORT/api" -ForegroundColor Yellow
Write-Host ""
Write-Host "================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Debug Information:" -ForegroundColor White
Write-Host "  - Backend logs: $BACKEND_PATH\storage\logs\laravel.log" -ForegroundColor Gray
Write-Host "  - Frontend: Check browser console (F12)" -ForegroundColor Gray
Write-Host "  - To stop: Close the terminal windows or press Ctrl+C in each" -ForegroundColor Gray
Write-Host ""

if ($DebugMode) {
    Write-Host "================================================================" -ForegroundColor Magenta
    Write-Host "DEBUG MODE ENABLED" -ForegroundColor Magenta
    Write-Host "================================================================" -ForegroundColor Magenta
    Write-Host "Backend Path: $BACKEND_PATH" -ForegroundColor Gray
    Write-Host "Frontend Path: $FRONTEND_PATH" -ForegroundColor Gray
    Write-Host "Backend Port: $BACKEND_PORT" -ForegroundColor Gray
    Write-Host "Frontend Port: $FRONTEND_PORT" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "Press any key to exit this window..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
