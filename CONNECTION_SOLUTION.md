# 🎯 KSIS Connection & Debugging - Complete Solution

## 📋 What Was Fixed

### 1. ✅ Connection Error (ERR_CONNECTION_REFUSED)
**Problem:** Localhost refused to connect after Antigravity reload.

**Root Cause:** Backend and Frontend servers were not running.

**Solution:** Created automated startup script that:
- Checks prerequisites (PHP, Node.js, PostgreSQL)
- Manages ports automatically
- Starts both services with health checks
- Provides clear error messages

### 2. ✅ Logout/Login Issues
**Problem:** Can't logout or switch between different user accounts.

**Root Cause:** Authentication state not properly cleared from browser storage.

**Solution:** Enhanced `AuthContext.tsx` logout function to:
- Clear all localStorage data
- Clear all sessionStorage data
- Force clean redirect to login page
- Handle errors gracefully

### 3. ✅ Configuration Issues
**Problem:** Frontend and Backend not communicating properly.

**Root Causes:**
- API URL misconfigured (was using port 8888 instead of 8000)
- Vite proxy not properly set up
- .env file missing or incorrect

**Solutions:**
- Fixed `.env` to use `VITE_API_URL=http://localhost:8000/api`
- Updated `vite.config.ts` with proper proxy configuration
- Added proxy debug logging
- Made strictPort false to allow fallback

---

## 🚀 How to Use

### Option 1: Automated Start (Recommended)
```powershell
cd C:\Backend(KSIS)
.\START-DEV.ps1
```

The script will:
1. ✅ Check PHP, Node.js, and PostgreSQL
2. ✅ Check if ports 8000 and 3000 are available
3. ✅ Ask to free ports if busy
4. ✅ Start Backend on port 8000
5. ✅ Start Frontend on port 3000
6. ✅ Verify both services are healthy
7. ✅ Show you access URLs

### Option 2: Manual Start
If you need more control:

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

## 🔗 Connection Architecture

```
┌─────────────────────────────────────────────┐
│  Browser: http://localhost:3000             │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  Vite Dev Server (Frontend)                 │
│  Port: 3000                                 │
│  - Serves React App                         │
│  - Proxies /api/* to backend                │
└─────────────────────────────────────────────┘
                    │
                    │ Proxy: /api/*
                    ▼
┌─────────────────────────────────────────────┐
│  Laravel Server (Backend)                   │
│  Port: 8000                                 │
│  - Handles API requests                     │
│  - Connects to PostgreSQL                   │
└─────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────┐
│  PostgreSQL Database                        │
│  Port: 5432                                 │
│  Database: ksis                             │
└─────────────────────────────────────────────┘
```

---

## 🔍 How to Debug Peacefully

### Step 1: Check What's Running
```powershell
# Check Backend
Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue

# Check Frontend
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
```

If no output = service not running.

### Step 2: Check Service Health
Open browser:
- Frontend: http://localhost:3000 (should show your app)
- Backend: http://localhost:8000 (should show Laravel page or 404)
- API: http://localhost:8000/api/user (should return 401 or user data)

### Step 3: Check Browser Console
1. Open your app in browser
2. Press **F12**
3. Go to **Console** tab
4. Look for red errors

Common errors you'll see:
- `Failed to fetch` → Backend not running
- `ERR_CONNECTION_REFUSED` → Service not started
- `CORS error` → Backend CORS config issue
- `404` → Wrong API endpoint or route not defined
- `500` → Backend error, check Laravel logs

### Step 4: Check Network Tab
1. Press **F12**
2. Go to **Network** tab
3. Filter by **Fetch/XHR** (to see only API calls)
4. Try to login or do an action
5. Click on the request to see:
   - Request URL (is it correct?)
   - Request Headers
   - Request Payload
   - Response Status
   - Response Data

This shows you EXACTLY what's being sent and received.

### Step 5: Check Backend Logs
```powershell
# View last 50 lines
Get-Content C:\Backend(KSIS)\ksis-laravel\storage\logs\laravel.log -Tail 50

# View in real-time (keeps updating)
Get-Content C:\Backend(KSIS)\ksis-laravel\storage\logs\laravel.log -Tail 20 -Wait
```

### Step 6: Test API Independently
Use PowerShell to test API without frontend:

```powershell
# Test login
$body = @{
    email = "admin@example.com"
    password = "password"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8000/api/login" -Method POST -Body $body -ContentType "application/json"

# Save token
$token = $response.token

# Test authenticated endpoint
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:8000/api/user" -Headers $headers
```

This proves if the backend works independently of frontend.

---

## 🔄 Testing Multiple Accounts

### Method 1: Different Browsers
- Chrome for Teacher
- Firefox for Principal
- Edge for HR Admin

Each browser has separate storage.

### Method 2: Incognito Windows
- **Chrome:** Ctrl+Shift+N
- **Firefox:** Ctrl+Shift+P
- **Edge:** Ctrl+Shift+N

Each incognito window is isolated.

### Method 3: Clear Storage Between Logins
Before each new login:

1. **Via Browser:**
   - F12 → Application tab
   - Clear storage → Clear site data

2. **Via Console:**
   ```javascript
   localStorage.clear()
   sessionStorage.clear()
   location.reload()
   ```

3. **Automated:** The logout function now does this automatically!

---

## 📊 Error Diagnosis Flowchart

```
Error appears
    │
    ├─→ ERR_CONNECTION_REFUSED
    │   └─→ Run: .\START-DEV.ps1
    │
    ├─→ API Request Failed
    │   ├─→ Check: Is backend running? (port 8000)
    │   ├─→ Check: Browser Network tab
    │   └─→ Check: Laravel logs
    │
    ├─→ Can't Logout
    │   └─→ Clear browser storage (F12 → Application → Clear)
    │
    ├─→ Port Already in Use
    │   └─→ Script will ask to kill process
    │
    ├─→ Database Error
    │   ├─→ Check: PostgreSQL running?
    │   ├─→ Check: .env database config
    │   └─→ Run: php artisan migrate:fresh --seed
    │
    └─→ 500 Internal Server Error
        └─→ Check: Laravel logs for details
```

---

## 📁 Files Modified/Created

### Backend (C:\Backend(KSIS))
- ✅ **START-DEV.ps1** - Automated startup script with all checks
- ✅ **DEBUGGING_GUIDE.md** - Comprehensive troubleshooting guide
- ✅ **QUICK_START.md** - Quick reference for common tasks
- ✅ **CONNECTION_SOLUTION.md** - This summary document

### Frontend (C:\Frontend(KSIS))
- ✅ **src/contexts/AuthContext.tsx** - Enhanced logout function
- ✅ **vite.config.ts** - Fixed proxy configuration with debugging
- ✅ **.env** - Set correct API URL

---

## 🎯 Key Configuration Points

### Frontend .env
```env
VITE_API_URL=http://localhost:8000/api
```

### Frontend vite.config.ts
```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    }
  }
}
```

### Frontend api.ts
```typescript
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
```

### Backend .env (Key Parts)
```env
APP_URL=http://localhost:8000
DB_CONNECTION=pgsql
DB_HOST=localhost
DB_PORT=5432
DB_DATABASE=ksis
DB_USERNAME=postgres
DB_PASSWORD=123
```

---

## 🚨 Emergency Procedures

### Complete Reset
If everything is broken:

```powershell
# 1. Stop all servers
Get-Process | Where-Object {$_.ProcessName -like "*php*" -or $_.ProcessName -like "*node*"} | Stop-Process -Force

# 2. Clear backend cache
cd C:\Backend(KSIS)\ksis-laravel
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# 3. Reset database
php artisan migrate:fresh --seed

# 4. Clear frontend cache
cd C:\Frontend(KSIS)
Remove-Item -Recurse -Force node_modules\.vite -ErrorAction SilentlyContinue

# 5. Clear browser
# F12 → Application → Clear storage

# 6. Start fresh
cd C:\Backend(KSIS)
.\START-DEV.ps1
```

### Port Cleanup
If ports are stuck:

```powershell
# Backend port 8000
$conn = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($conn) { Stop-Process -Id $conn.OwningProcess -Force }

# Frontend port 3000
$conn = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($conn) { Stop-Process -Id $conn.OwningProcess -Force }
```

---

## 💡 Best Practices

1. **Always use the startup script** - It handles everything automatically

2. **Keep terminal windows visible** - You'll see errors immediately

3. **Use Browser DevTools** - F12 is your best friend
   - Console for JavaScript errors
   - Network for API calls
   - Application for storage

4. **Check logs when debugging** - They tell you exactly what went wrong

5. **Test API separately** - Use PowerShell or the testing dashboard

6. **One change at a time** - When debugging, change one thing and test

7. **Clear cache when in doubt** - Both browser and Laravel

8. **Use Incognito for testing different users** - Clean slate every time

---

## 📞 Still Having Issues?

Follow this checklist:

```
☐ PostgreSQL service running?
☐ Backend running on port 8000?
☐ Frontend running on port 3000?
☐ .env file has correct VITE_API_URL?
☐ Browser console shows errors?
☐ Network tab shows requests?
☐ Laravel logs show errors?
☐ Tried clearing all caches?
☐ Tried the emergency reset?
```

If all else fails, run the emergency reset procedure above.

---

## 🎉 Summary

You now have:
1. ✅ A solid, reliable connection between frontend and backend
2. ✅ Automated startup script that handles everything
3. ✅ Proper logout functionality that clears all state
4. ✅ Comprehensive debugging tools and guides
5. ✅ Clear error messages and solutions

**The connection is now solid and proper. No more mysterious errors!**

---

## 📚 Documentation Reference

- **QUICK_START.md** - Quick commands and common tasks
- **DEBUGGING_GUIDE.md** - Detailed troubleshooting
- **LOCAL_SETUP.md** - Setup instructions
- **API_DOCUMENTATION.md** - API endpoints reference
- **TESTING_GUIDE.md** - Testing procedures

**Start here:** `.\START-DEV.ps1` - That's it! Everything else is automated.
