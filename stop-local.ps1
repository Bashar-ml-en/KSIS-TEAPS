# KSIS Local Development - Stop All Services
# This script stops Backend, Frontend, and Nginx services

Write-Host "====================================" -ForegroundColor Red
Write-Host "Stopping KSIS Development Services" -ForegroundColor Red
Write-Host "====================================" -ForegroundColor Red
Write-Host ""

# Stop Nginx
Write-Host "Stopping Nginx..." -ForegroundColor Yellow
$nginxPaths = @(
    "C:\nginx\nginx.exe",
    "C:\Program Files\nginx\nginx.exe",
    "nginx"
)

foreach ($path in $nginxPaths) {
    try {
        if ($path -eq "nginx") {
            & nginx -s stop 2>$null
        } else {
            & $path -s stop 2>$null
        }
        Write-Host "  ✓ Nginx stopped" -ForegroundColor Green
        break
    } catch {
        # Try next path
    }
}

# Also kill any nginx processes directly
Get-Process nginx -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "  ✓ Nginx processes terminated" -ForegroundColor Green

# Stop PHP/Laravel processes
Write-Host "Stopping Laravel backend..." -ForegroundColor Yellow
Get-Process php -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*artisan*" -or $_.CommandLine -like "*artisan serve*" } | Stop-Process -Force
Get-Process php -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "  ✓ Laravel stopped" -ForegroundColor Green

# Stop Node/Vite processes
Write-Host "Stopping React frontend..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like "*vite*" } | Stop-Process -Force
# Be more aggressive - stop all node processes (careful if you have other node apps running)
# Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
Write-Host "  ✓ Frontend stopped" -ForegroundColor Green

Write-Host ""
Write-Host "====================================" -ForegroundColor Green
Write-Host "All services stopped successfully!" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""
