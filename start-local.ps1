# KSIS Local Development - Start All Services
# This script starts Backend, Frontend, and Nginx together

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "KSIS Local Development Environment" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# Check if running in administrator mode (required for nginx on some systems)
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "WARNING: Not running as Administrator. Nginx may require admin privileges." -ForegroundColor Yellow
    Write-Host ""
}

# Store the script directory
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Start Laravel Backend
Write-Host "[1/3] Starting Laravel Backend on http://localhost:8000..." -ForegroundColor Green
$backendPath = Join-Path $scriptDir "ksis-laravel"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Laravel Backend Starting...' -ForegroundColor Magenta; php artisan serve --host=localhost --port=8000"

Start-Sleep -Seconds 2

# Start Frontend
Write-Host "[2/3] Starting React Frontend on http://localhost:3000..." -ForegroundColor Green
$frontendPath = "C:\Frontend(KSIS)"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'React Frontend Starting...' -ForegroundColor Blue; npm run dev"

Start-Sleep -Seconds 2

# Check if nginx is installed
$nginxPaths = @(
    "C:\nginx\nginx.exe",
    "C:\Program Files\nginx\nginx.exe",
    "nginx"  # In PATH
)

$nginxExe = $null
foreach ($path in $nginxPaths) {
    if (Test-Path $path -ErrorAction SilentlyContinue) {
        $nginxExe = $path
        break
    } elseif ($path -eq "nginx") {
        try {
            $null = Get-Command nginx -ErrorAction Stop
            $nginxExe = "nginx"
            break
        } catch {}
    }
}

if ($null -eq $nginxExe) {
    Write-Host ""
    Write-Host "======================================" -ForegroundColor Red
    Write-Host "Nginx not found!" -ForegroundColor Red
    Write-Host "======================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Nginx:" -ForegroundColor Yellow
    Write-Host "  Option 1 (Chocolatey): choco install nginx" -ForegroundColor Yellow
    Write-Host "  Option 2 (Manual): Download from https://nginx.org/en/download.html" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "After installation, run this script again." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternative: You can access services directly at:" -ForegroundColor Cyan
    Write-Host "  - Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "  - Backend:  http://localhost:8000/api" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "But for unified access at port 8080, nginx is required." -ForegroundColor Yellow
} else {
    # Start Nginx
    Write-Host "[3/3] Starting Nginx reverse proxy on http://localhost:8080..." -ForegroundColor Green
    
    $nginxConfig = Join-Path $scriptDir "local-nginx.conf"
    
    # Stop any existing nginx processes
    try {
        & $nginxExe -s stop 2>$null
        Start-Sleep -Seconds 1
    } catch {}
    
    # Start nginx with our config
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host 'Nginx Reverse Proxy Starting...' -ForegroundColor Cyan; & '$nginxExe' -c '$nginxConfig'"
    
    Start-Sleep -Seconds 2
    
    Write-Host ""
    Write-Host "====================================" -ForegroundColor Green
    Write-Host "All services started successfully!" -ForegroundColor Green
    Write-Host "====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Access your application at:" -ForegroundColor Cyan
    Write-Host "  http://localhost:8080" -ForegroundColor Yellow -BackgroundColor DarkBlue
    Write-Host ""
    Write-Host "Individual services:" -ForegroundColor White
    Write-Host "  - Frontend (Vite):  http://localhost:3000" -ForegroundColor Gray
    Write-Host "  - Backend (Laravel): http://localhost:8000" -ForegroundColor Gray
    Write-Host "  - Nginx Proxy:       http://localhost:8080" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "Press Ctrl+C in each terminal window to stop the services." -ForegroundColor Yellow
Write-Host ""
