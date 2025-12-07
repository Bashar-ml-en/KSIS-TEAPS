# 🚀 KSIS Quick Start Guide

## ⚡ Start Everything (One Command)

```powershell
cd C:\Backend(KSIS)
.\START-DEV.ps1
```

This will:
- ✅ Check all prerequisites
- ✅ Free up ports if needed
- ✅ Start Backend on port 8000
- ✅ Start Frontend on port 3000
- ✅ Verify everything is running

## 🌐 Access URLs

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:3000 |
| **Backend** | http://localhost:8000 |
| **API** | http://localhost:8000/api |

## 🔧 Manual Start (If Needed)

### Terminal 1 - Backend
```powershell
cd C:\Backend(KSIS)\ksis-laravel
php artisan serve --host=localhost --port=8000
```

### Terminal 2 - Frontend
```powershell
cd C:\Frontend(KSIS)
npm run dev
```

## ❌ If Connection Refused Error

1. **Check if servers are running:**
```powershell
# Backend
Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue

# Frontend
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
```

2. **If no output, start servers:**
```powershell
cd C:\Backend(KSIS)
.\START-DEV.ps1
```

3. **If ports are busy:**
```powershell
# Kill backend
$conn = Get-NetTCPConnection -LocalPort 8000
Stop-Process -Id $conn.OwningProcess -Force

# Kill frontend
$conn = Get-NetTCPConnection -LocalPort 3000
Stop-Process -Id $conn.OwningProcess -Force

# Then start again
.\START-DEV.ps1
```

## 🔄 Logout/Login Different Accounts

### Method 1: Clear Browser Storage
1. Press **F12** → **Application** tab
2. Click **Clear storage**
3. Check all boxes
4. Click **Clear site data**
5. Refresh page

### Method 2: Console Command
1. Press **F12** → **Console** tab
2. Run:
```javascript
localStorage.clear()
sessionStorage.clear()
location.reload()
```

### Method 3: Incognito Window
- Chrome: **Ctrl+Shift+N**
- Firefox: **Ctrl+Shift+P**

## 🐛 Common Errors & Quick Fixes

| Error | Quick Fix |
|-------|-----------|
| ERR_CONNECTION_REFUSED | Run `.\START-DEV.ps1` |
| API Request Failed | Check backend is running on port 8000 |
| Port already in use | Kill process on that port (see above) |
| Database connection failed | Start PostgreSQL service |
| Can't logout | Clear browser storage (see above) |
| 500 Internal Server Error | Check Laravel logs |

## 📝 Check Logs

### Backend Logs (Real-time)
```powershell
Get-Content C:\Backend(KSIS)\ksis-laravel\storage\logs\laravel.log -Tail 50 -Wait
```

### Frontend Logs
- Press **F12** → **Console** tab in browser

### API Requests
- Press **F12** → **Network** tab → Filter **Fetch/XHR**

## 🔍 Health Check

```powershell
# Quick health check
Invoke-RestMethod http://localhost:8000 # Should return something
Invoke-RestMethod http://localhost:3000 # Should return HTML
```

## 💻 Test API

```powershell
# Test login
$body = @{
    email = "admin@example.com"
    password = "password"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/login" -Method POST -Body $body -ContentType "application/json"
```

## 🚨 Emergency Reset

```powershell
# Stop everything
Get-Process | Where-Object {$_.ProcessName -like "*php*" -or $_.ProcessName -like "*node*"} | Stop-Process -Force

# Clear caches
cd C:\Backend(KSIS)\ksis-laravel
php artisan cache:clear
php artisan config:clear

# Reset database
php artisan migrate:fresh --seed

# Clear frontend
cd C:\Frontend(KSIS)
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue

# Start fresh
cd C:\Backend(KSIS)
.\START-DEV.ps1
```

## 📚 More Help

- **Detailed Debugging:** See `DEBUGGING_GUIDE.md`
- **Local Setup:** See `LOCAL_SETUP.md`
- **API Documentation:** See `API_DOCUMENTATION.md`
- **Testing Guide:** See `TESTING_GUIDE.md`

## 🎯 Default Test Accounts

Check your database seeder for test accounts. Common defaults:

- **HR Admin:** admin@example.com / password
- **Principal:** principal@example.com / password
- **Teacher:** teacher@example.com / password

## ⌨️ Keyboard Shortcuts

- **F12** - Open browser DevTools
- **Ctrl+Shift+N** - New Incognito window (Chrome)
- **Ctrl+Shift+C** - Inspect element
- **Ctrl+C** - Stop server in terminal

---

## 🎉 That's It!

Your development environment should now be running smoothly.

**Having issues?** Check `DEBUGGING_GUIDE.md` for detailed troubleshooting.
