# 🚀 KSIS Local Development - Quick Start Guide

Connect your frontend and backend through a **single localhost port** for seamless local development!

## 📋 Two Options Available

### **Option 1: Simple Mode (Recommended - No Nginx)**
Uses Vite's built-in proxy feature. Easiest to set up!
- Access everything at: **http://localhost:3000**
- No additional software needed

### **Option 2: Professional Mode (With Nginx)**
Uses Nginx as a reverse proxy for more control.
- Access everything at: **http://localhost:8080**
- Requires Nginx installation

---

## ⚡ Quick Start (Option 1 - Simple Mode)

### Prerequisites
- ✅ PHP (for Laravel backend)
- ✅ PostgreSQL (database)
- ✅ Node.js (for frontend)

### Setup Steps

1. **Ensure .env file exists in Frontend**
   ```powershell
   cd C:\Frontend(KSIS)
   
   # Copy .env.example to .env if it doesn't exist
   if (!(Test-Path .env)) { Copy-Item .env.example .env }
   ```
   
   Verify `.env` contains:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

2. **Start all services with one command**
   ```powershell
   cd C:\Backend(KSIS)
   .\start-dev.ps1
   ```

3. **Access your application**
   - Open browser: **http://localhost:3000**
   - Frontend will be served
   - API calls to `/api` automatically proxy to backend

### How It Works (Simple Mode)

```
Your Browser
    ↓ (http://localhost:3000)
Vite Dev Server (Port 3000)
    ├─→ Frontend pages: / (React app)
    └─→ API requests: /api/* → http://localhost:8000/api
            ↓
    Laravel Backend (Port 8000)
```

---

## 🏗️ Professional Setup (Option 2 - With Nginx)

### Additional Prerequisites
- ✅ Nginx web server

### Install Nginx

**Option A - Using Chocolatey (Recommended)**
```powershell
choco install nginx
```

**Option B - Manual Installation**
1. Download from: https://nginx.org/en/download.html
2. Extract to `C:\nginx`
3. Add `C:\nginx` to your PATH

### Setup Steps

1. **Update Frontend .env**
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```

2. **Start all services**
   ```powershell
   cd C:\Backend(KSIS)
   .\start-local.ps1
   ```

3. **Access your application**
   - Open browser: **http://localhost:8080**

### How It Works (Nginx Mode)

```
Your Browser
    ↓ (http://localhost:8080)
Nginx Reverse Proxy (Port 8080)
    ├─→ / → Vite Dev Server (Port 3000) → Frontend
    └─→ /api/* → Laravel Backend (Port 8000) → API
```

---

## 🛑 Stopping Services

```powershell
cd C:\Backend(KSIS)
.\stop-local.ps1
```

Or press `Ctrl+C` in each terminal window.

---

## 🔧 Manual Startup (If Scripts Don't Work)

### Terminal 1: Backend
```powershell
cd C:\Backend(KSIS)\ksis-laravel
php artisan serve --host=localhost --port=8000
```

### Terminal 2: Frontend
```powershell
cd C:\Frontend(KSIS)

# Make sure .env exists
if (!(Test-Path .env)) { Copy-Item .env.example .env }

npm run dev
```

### Terminal 3: Nginx (Optional - Only for Professional Mode)
```powershell
# If installed to C:\nginx
cd C:\nginx
nginx -c C:\Backend(KSIS)\local-nginx.conf

# To reload config after changes
nginx -s reload

# To stop
nginx -s stop
```

---

## 📍 Access Points

### Simple Mode (Vite Proxy)
- **Main Access**: http://localhost:3000
- **Frontend Only**: http://localhost:3000
- **Backend API**: http://localhost:8000/api (direct)
- **API via Proxy**: http://localhost:3000/api (recommended)

### Professional Mode (Nginx)
- **Main Access**: http://localhost:8080
- **Frontend Only**: http://localhost:3000 (direct, for debugging)
- **Backend API**: http://localhost:8000/api (direct, for debugging)
- **Unified Access**: http://localhost:8080 (frontend + API)

---

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Find what's using a port (e.g., 3000)
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

### Backend Not Starting
- Check if PostgreSQL is running
- Verify database connection in `ksis-laravel\.env`
- Check for errors: `Backend(KSIS)\ksis-laravel\storage\logs\laravel.log`

### Frontend Not Connecting to Backend
1. Ensure backend is running on port 8000
2. Check frontend `.env` file
3. Open browser console (F12) to see network errors
4. Verify the `VITE_API_URL` matches your chosen mode:
   - Simple Mode: `http://localhost:3000/api`
   - Nginx Mode: `http://localhost:8080/api`

### Vite Proxy Not Working
- Restart the frontend dev server
- Clear browser cache
- Check `vite.config.ts` has the proxy configuration

### Nginx Errors
```powershell
# Check nginx error log
Get-Content C:\nginx\logs\error.log -Tail 50

# Test nginx configuration
nginx -t -c C:\Backend(KSIS)\local-nginx.conf
```

---

## 📝 Environment Configuration

### Frontend (.env)

**For Simple Mode:**
```env
VITE_API_URL=http://localhost:3000/api
```

**For Nginx Mode:**
```env
VITE_API_URL=http://localhost:8080/api
```

### Backend (ksis-laravel\.env)
```env
APP_URL=http://localhost:8000
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

---

## 🎯 Recommended Workflow

1. **Use Simple Mode** for everyday development (faster, simpler)
2. **Use Nginx Mode** when you need to:
   - Test production-like routing
   - Debug complex proxy scenarios
   - Test with a different port architecture

---

## 📚 Additional Resources

- **API Documentation**: See `API_DOCUMENTATION.md`
- **Testing Guide**: See `TESTING_GUIDE.md`
- **Deployment**: See `DEPLOYMENT.md`

---

## ✅ Checklist

Before starting development:
- [ ] PostgreSQL is installed and running
- [ ] Backend `.env` is configured with database credentials
- [ ] Frontend `.env` exists and has correct `VITE_API_URL`
- [ ] Node modules are installed (`npm install` in Frontend directory)
- [ ] Composer dependencies are installed (`composer install` in ksis-laravel)
- [ ] Database migrations are run (`php artisan migrate`)

---

## 🎉 You're Ready!

Run `.\start-dev.ps1` and start coding! 🚀
