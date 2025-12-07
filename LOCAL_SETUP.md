# LOCAL DEVELOPMENT SETUP - Unified Port Access

This guide explains how to run both frontend and backend through a single localhost port (8080) using Nginx as a reverse proxy.

## Architecture

```
http://localhost:8080
    ↓
  Nginx (Port 8080)
    ├─→ Frontend (Port 3000) - All requests to /
    └─→ Backend (Port 8000)  - All requests to /api/*
```

## Prerequisites

1. **Nginx** - Install nginx on Windows:
   - Download: https://nginx.org/en/download.html
   - Extract to `C:\nginx` or use Chocolatey: `choco install nginx`
   
2. **PHP** - For Laravel backend
3. **PostgreSQL** - For database
4. **Node.js** - For frontend

## Setup Instructions

### Step 1: Update Frontend Environment

Update your `Frontend(KSIS)\.env` file:
```env
# Backend API URL - Now points to the unified nginx port
VITE_API_URL=http://localhost:8080/api
```

### Step 2: Configure Nginx

1. Copy the `local-nginx.conf` to your nginx installation:
   ```powershell
   # If installed to C:\nginx
   Copy-Item local-nginx.conf C:\nginx\conf\nginx.conf
   ```

2. Or run nginx with the custom config:
   ```powershell
   nginx -c C:\Backend(KSIS)\local-nginx.conf
   ```

### Step 3: Start All Services

You need to run **three** services:

#### Terminal 1: Start Laravel Backend
```powershell
cd C:\Backend(KSIS)\ksis-laravel
php artisan serve --host=localhost --port=8000
```

#### Terminal 2: Start Frontend
```powershell
cd C:\Frontend(KSIS)
npm run dev
```

#### Terminal 3: Start Nginx
```powershell
# Option 1: If installed as service
nginx

# Option 2: Run with custom config
nginx -c C:\Backend(KSIS)\local-nginx.conf

# To reload nginx after config changes:
nginx -s reload

# To stop nginx:
nginx -s stop
```

## Access Your Application

Once all three services are running:

- **Frontend + Backend (Unified)**: http://localhost:8080
- **Frontend Only** (for debugging): http://localhost:3000
- **Backend API Only** (for debugging): http://localhost:8000/api

## How It Works

1. **Nginx** listens on port 8080
2. Requests to `/` are forwarded to the frontend (Vite on port 3000)
3. Requests to `/api/*` are forwarded to the backend (Laravel on port 8000)
4. The frontend makes API calls to `/api` which nginx automatically routes to the backend

## Troubleshooting

### Port Already in Use
```powershell
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Nginx Not Starting
- Check if another web server is using port 8080 (IIS, Apache, etc.)
- Check nginx error log: `C:\nginx\logs\error.log`
- Verify paths in `local-nginx.conf` match your system

### API Requests Failing
- Ensure Laravel is running on port 8000
- Check Laravel logs: `Backend(KSIS)\ksis-laravel\storage\logs\`
- Verify CORS settings in Laravel

### Frontend Not Loading
- Ensure Vite dev server is running on port 3000
- Check the browser console for errors
- Verify `.env` has `VITE_API_URL=http://localhost:8080/api`

## Alternative: Without Nginx (Vite Proxy)

If you don't want to install Nginx, you can use Vite's built-in proxy (less flexible but simpler):

1. Update `vite.config.ts` to add a proxy:
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

2. Update `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

3. Start only two services (no nginx needed):
   - Backend: `php artisan serve --port=8000`
   - Frontend: `npm run dev`
   - Access at: `http://localhost:3000`
