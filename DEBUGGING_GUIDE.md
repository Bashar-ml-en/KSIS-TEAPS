# KSIS Development - Debugging & Troubleshooting Guide

## 🚀 Quick Start

### Option 1: Automated Start (Recommended)
```powershell
cd C:\Backend(KSIS)
.\START-DEV.ps1
```

This script will:
- ✅ Check all prerequisites (PHP, Node.js, PostgreSQL)
- ✅ Verify and free up ports if needed
- ✅ Start backend and frontend automatically
- ✅ Verify services are running
- ✅ Show you all access URLs

### Option 2: Manual Start
If you prefer manual control:

**Terminal 1 - Backend:**
```powershell
cd C:\Backend(KSIS)\ksis-laravel
php artisan serve --host=localhost --port=8000
```

**Terminal 2 - Frontend:**
```powershell
cd C:\Frontend(KSIS)
npm run dev
```

---

## 🔍 Common Errors and Solutions

### 1. ❌ ERR_CONNECTION_REFUSED

**Problem:** Browser shows "Can't reach this page" or "Connection refused"

**Causes:**
- Backend or Frontend server is not running
- Server crashed after starting
- Port is blocked by firewall

**Solutions:**

#### Check if servers are running:
```powershell
# Check Backend (should show port 8000)
Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue

# Check Frontend (should show port 3000)
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
```

#### If no output, servers are NOT running. Start them:
```powershell
cd C:\Backend(KSIS)
.\START-DEV.ps1
```

#### If servers are running but still connection refused:
1. Check Windows Firewall
2. Check antivirus software
3. Try accessing via 127.0.0.1 instead of localhost

---

### 2. ❌ API Request Failed / Network Error

**Problem:** Frontend loads but login/data requests fail

**Causes:**
- Backend is not running
- API URL is misconfigured
- CORS issues
- Backend crashed

**Solutions:**

#### Step 1: Verify Backend is Accessible
Open browser and go to:
```
http://localhost:8000/api/health
```

If you see a response (even an error), backend is running.

#### Step 2: Check Frontend API Configuration
```powershell
# Check .env file
Get-Content C:\Frontend(KSIS)\.env
```

Should contain:
```env
VITE_API_URL=http://localhost:8000/api
```

If missing or wrong, create/update it:
```powershell
Set-Content C:\Frontend(KSIS)\.env -Value "VITE_API_URL=http://localhost:8000/api"
```

**Important:** After changing .env, RESTART the frontend:
1. Press Ctrl+C in frontend terminal
2. Run `npm run dev` again

#### Step 3: Check Browser Console
1. Open browser (F12)
2. Go to Console tab
3. Look for errors

Common errors:
- `Failed to fetch` → Backend not running
- `CORS error` → Check backend CORS config
- `404` → Wrong API URL

---

### 3. ❌ Port Already in Use

**Problem:** Error says port 8000 or 3000 is already in use

**Solution:**

#### Find and kill process on port:
```powershell
# For port 8000 (Backend)
$conn = Get-NetTCPConnection -LocalPort 8000
$process = Get-Process -Id $conn.OwningProcess
Stop-Process -Id $process.Id -Force

# For port 3000 (Frontend)
$conn = Get-NetTCPConnection -LocalPort 3000
$process = Get-Process -Id $conn.OwningProcess
Stop-Process -Id $process.Id -Force
```

Or use the automated script which handles this:
```powershell
.\START-DEV.ps1
```

---

### 4. ❌ Login Works But Can't Logout / Switch Accounts

**Problem:** Stuck on one account, logout doesn't work properly

**Root Cause:** Frontend caching user data and not clearing it properly

**Solutions:**

#### Option 1: Clear Browser Storage (Quick Fix)
1. Open browser DevTools (F12)
2. Go to Application tab
3. Click "Clear storage"
4. Check all boxes
5. Click "Clear site data"
6. Refresh page (F5)

#### Option 2: Clear LocalStorage via Console
1. Open browser console (F12)
2. Run:
```javascript
localStorage.clear()
sessionStorage.clear()
location.reload()
```

#### Option 3: Incognito/Private Window
- Use Ctrl+Shift+N (Chrome) or Ctrl+Shift+P (Firefox)
- This starts with fresh storage

#### Permanent Fix:
Update logout function to properly clear storage. Check `AuthContext.tsx`:

```typescript
const logout = async () => {
    await authService.logout();
    setUser(null);
    // Add these:
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
};
```

---

### 5. ❌ Database Connection Failed

**Problem:** Backend shows "Database connection failed" or similar

**Solutions:**

#### Check PostgreSQL is running:
```powershell
Get-Service -Name postgresql*
```

If not running:
```powershell
Start-Service postgresql-x64-15  # Adjust version number
```

#### Verify Database Exists:
```powershell
$env:PGPASSWORD = "123"
psql -U postgres -c "\l" | Select-String "ksis"
```

If not found, create it:
```powershell
psql -U postgres -c "CREATE DATABASE ksis;"
```

#### Check Laravel .env File:
```powershell
Get-Content C:\Backend(KSIS)\ksis-laravel\.env | Select-String "DB_"
```

Should show:
```
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=ksis
DB_USERNAME=postgres
DB_PASSWORD=123
```

#### Run Migrations:
```powershell
cd C:\Backend(KSIS)\ksis-laravel
php artisan migrate:fresh --seed
```

---

### 6. ❌ 404 Not Found on API Endpoints

**Problem:** API requests return 404

**Causes:**
- Route not defined
- Wrong HTTP method
- Missing API prefix

**Solutions:**

#### Check Available Routes:
```powershell
cd C:\Backend(KSIS)\ksis-laravel
php artisan route:list | Select-String "api"
```

#### Common API Endpoints:
```
POST   /api/login
POST   /api/logout
GET    /api/user
GET    /api/departments
GET    /api/teachers
GET    /api/kpis
POST   /api/observations
```

#### Verify Frontend is calling correct endpoint:
Check browser Network tab (F12) to see actual request URL

---

### 7. ❌ CORS Error

**Problem:** Browser console shows CORS policy error

**Solution:**

Update Laravel CORS config:

```powershell
# File: C:\Backend(KSIS)\ksis-laravel\config\cors.php
```

Should allow:
```php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

After changing, restart backend.

---

### 8. ❌ 500 Internal Server Error

**Problem:** API returns 500 error

**Solutions:**

#### Check Laravel Logs:
```powershell
Get-Content C:\Backend(KSIS)\ksis-laravel\storage\logs\laravel.log -Tail 50
```

#### Enable Debug Mode:
In `C:\Backend(KSIS)\ksis-laravel\.env`:
```
APP_DEBUG=true
APP_ENV=local
```

#### Clear Cache:
```powershell
cd C:\Backend(KSIS)\ksis-laravel
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

---

## 🔧 Debugging Tools

### 1. Browser DevTools (F12)

**Console Tab:**
- See JavaScript errors
- Run debug commands
- Check variable values

**Network Tab:**
- See all API requests
- Check request/response headers
- View response data
- Filter by "Fetch/XHR" to see only API calls

**Application Tab:**
- View LocalStorage
- View SessionStorage
- Clear storage
- Check cookies

### 2. Backend Logs

**Laravel Log:**
```powershell
Get-Content C:\Backend(KSIS)\ksis-laravel\storage\logs\laravel.log -Tail 100 -Wait
```

The `-Wait` flag will show new logs in real-time.

### 3. API Testing

**Using PowerShell:**
```powershell
# Test Login
$body = @{
    email = "admin@example.com"
    password = "password"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8000/api/login" -Method POST -Body $body -ContentType "application/json"
```

**Using Browser:**
Open `C:\Backend(KSIS)\testing-dashboard.html` in browser for a full API testing dashboard.

---

## 📋 Health Check Checklist

When things go wrong, run through this checklist:

```
☐ PostgreSQL service running?
   → Get-Service postgresql*

☐ Backend server running on port 8000?
   → Get-NetTCPConnection -LocalPort 8000

☐ Frontend server running on port 3000?
   → Get-NetTCPConnection -LocalPort 3000

☐ Backend accessible in browser?
   → http://localhost:8000

☐ Frontend accessible in browser?
   → http://localhost:3000

☐ API responds to test request?
   → http://localhost:8000/api/user (should return 401 or user data)

☐ Frontend .env configured correctly?
   → VITE_API_URL=http://localhost:8000/api

☐ Browser console shows no errors?
   → Press F12 and check Console tab

☐ Network tab shows API requests?
   → Press F12, Network tab, filter XHR/Fetch
```

---

## 🚨 Emergency Reset

If everything is broken and you need to start fresh:

```powershell
# 1. Stop all services
Get-Process | Where-Object {$_.ProcessName -like "*php*" -or $_.ProcessName -like "*node*"} | Stop-Process -Force

# 2. Clear backend cache
cd C:\Backend(KSIS)\ksis-laravel
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# 3. Reset database
php artisan migrate:fresh --seed

# 4. Clear frontend cache
cd C:\Frontend(KSIS)
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue

# 5. Clear browser data
# Open browser, press F12, go to Application tab, click "Clear storage", click "Clear site data"

# 6. Start fresh
cd C:\Backend(KSIS)
.\START-DEV.ps1
```

---

## 📱 Testing Multiple Accounts

To test login/logout with different accounts:

### Method 1: Use Different Browsers
- Chrome for Teacher account
- Firefox for Principal account
- Edge for HR Admin account

### Method 2: Use Incognito Windows
- Ctrl+Shift+N (Chrome)
- Ctrl+Shift+P (Firefox)
- Each window has separate storage

### Method 3: Use Browser Profiles
Chrome:
1. Click profile icon (top right)
2. Click "Add"
3. Create new profile
4. Each profile has separate storage

### Method 4: Clear Storage Between Logins
```javascript
// Run in console before each new login:
localStorage.clear()
sessionStorage.clear()
location.reload()
```

---

## 🔗 Quick Reference URLs

- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:8000
- **API Base:** http://localhost:8000/api
- **API Login:** http://localhost:8000/api/login
- **API User:** http://localhost:8000/api/user
- **Testing Dashboard:** file:///C:/Backend(KSIS)/testing-dashboard.html

---

## 📞 Still Having Issues?

1. Check the terminal windows for error messages
2. Check browser console (F12)
3. Check Laravel logs: `storage/logs/laravel.log`
4. Restart both servers
5. Try the Emergency Reset procedure above

---

## 💡 Pro Tips

1. **Keep terminals visible** - Don't minimize backend/frontend terminals so you can see errors immediately

2. **Use browser DevTools** - F12 is your best friend. Network tab shows all API calls.

3. **Check logs first** - Most errors are logged. Read the error messages.

4. **One change at a time** - If debugging, change one thing and test. Don't change multiple things.

5. **Use version control** - If something works, commit it with git.

6. **Document your changes** - If you fix something, write down what you did.

7. **Test API separately** - Use the testing dashboard or PowerShell to test API endpoints independently from frontend.

8. **Clear cache when in doubt** - Many issues are solved by clearing cache (browser and Laravel).
