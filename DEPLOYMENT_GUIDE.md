# KSIS TEAPS Deployment Guide

**System**: Knowledge Sustainability International School - Teacher Evaluation and Appraisal Performance System

---

## 🏗️ **Architecture**

```
┌─────────────────────┐
│   Vercel (Frontend) │ ← Users access here
│   React + Vite      │
└──────────┬──────────┘
           │ API Calls
           ▼
┌─────────────────────┐
│  Railway (Backend)  │
│  Laravel PHP        │
└──────────┬──────────┘
           │ Database
           ▼
┌─────────────────────┐
│  Supabase (DB)      │
│  PostgreSQL Cloud   │
└─────────────────────┘
```

---

## 📋 **Pre-Deployment Checklist**

### ✅ **Completed**
- [x] Database migrated to Supabase
- [x] 26 tables created successfully
- [x] Test users seeded
- [x] Frontend running locally
- [x] Backend running locally
- [x] School name updated

### 🔧 **Needed for Deployment**
- [ ] Vercel account
- [ ] Railway account (or alternative: Render, Heroku)
- [ ] Update frontend API URL to production backend
- [ ] Configure CORS for production
- [ ] Set up environment variables on hosting platforms

---

## 🎯 **Step-by-Step Deployment**

### **Part 1: Deploy Backend to Railway**

#### 1. Create Railway Account
- Go to https://railway.app
- Sign up with GitHub

#### 2. Prepare Backend for Railway
Files needed:
- `Procfile` - Tells Railway how to run the app
- `nixpacks.toml` - Build configuration
- Environment variables

#### 3. Push to GitHub
```bash
cd c:\Backend(KSIS)\ksis-laravel
git init
git add .
git commit -m "Initial commit - KSIS Backend"
```

#### 4. Deploy on Railway
- Create new project from GitHub repo
- Add Supabase environment variables
- Deploy!

---

### **Part 2: Deploy Frontend to Vercel**

#### 1. Create Vercel Account
- Go to https://vercel.com
- Sign up with GitHub

#### 2. Update API URL
In `src/services/api.ts`, change:
```typescript
baseURL: 'https://your-backend.railway.app/api'
```

#### 3. Build for Production
```bash
cd c:\Frontend(KSIS)
npm run build
```

#### 4. Deploy to Vercel
- Import GitHub repository
- Framework preset: Vite
- Deploy!

---

## 🔐 **Environment Variables**

### **Backend (Railway)**
```env
APP_NAME="KSIS TEAPS"
APP_ENV=production
APP_KEY=base64:... (generate with: php artisan key:generate --show)
APP_DEBUG=false
APP_URL=https://your-backend.railway.app

DB_CONNECTION=pgsql
DB_HOST=aws-1-ap-northeast-1.pooler.supabase.com
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres.brpnempyimxftzlnouam
DB_PASSWORD=Ksisbackend123
DB_SSLMODE=require

SESSION_DRIVER=cookie
SESSION_DOMAIN=.railway.app

SANCTUM_STATEFUL_DOMAINS=your-frontend.vercel.app
```

### **Frontend (Vercel)**
```env
VITE_API_URL=https://your-backend.railway.app/api
```

---

## 🔄 **CORS Configuration**

Update `config/cors.php` in backend:
```php
'allowed_origins' => [
    'https://your-frontend.vercel.app',
    'http://localhost:3000', // Keep for local testing
],
```

---

## 📦 **Required Files for Deployment**

### Backend - Create `Procfile`
```
web: vendor/bin/heroku-php-apache2 public/
```

### Backend - Create `nixpacks.toml`
```toml
[phases.setup]
nixPkgs = ['php82', 'php82Packages.composer']

[phases.install]
cmds = ['composer install --no-dev --optimize-autoloader']

[phases.build]
cmds = ['php artisan config:cache', 'php artisan route:cache', 'php artisan view:cache']

[start]
cmd = 'php artisan serve --host=0.0.0.0 --port=$PORT'
```

---

## 🧪 **Testing After Deployment**

### 1. Test Backend
```bash
curl https://your-backend.railway.app/api/login

# Should return: {"message":""}
```

### 2. Test Frontend
- Visit: https://your-frontend.vercel.app
- Try logging in with test credentials
- Verify dashboard loads

### 3. Test Database Connection
- Check Supabase dashboard
- Verify new data appears after frontend interactions

---

## 🚨 **Common Issues & Solutions**

### Issue: CORS Errors
**Solution**: Add your Vercel domain to `config/cors.php`

### Issue: 500 Server Error
**Solution**: 
1. Check Railway logs
2. Verify all environment variables are set
3. Run `php artisan config:clear` on Railway

### Issue: Database Connection Failed
**Solution**: Verify Supabase credentials in Railway environment variables

### Issue: Route Not Found
**Solution**: Run `php artisan route:cache` on Railway

---

## 📊 **Post-Deployment**

### Update Frontend API URL
File: `c:\Frontend(KSIS)\src\services\api.ts`
```typescript
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://your-backend.railway.app/api',
    // ...
});
```

### Update `.env.example` for Both Projects
Document the required environment variables

---

## 🎉 **Success Criteria**

- ✅ Backend accessible at Railway URL
- ✅ Frontend accessible at Vercel URL  
- ✅ Login works from production frontend
- ✅ Data saves to Supabase database
- ✅ All features functional in production
- ✅ CORS configured correctly
- ✅ URLs shareable for testing

---

## 📞 **Support Resources**

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Laravel Deployment**: https://laravel.com/docs/deployment
- **Supabase Docs**: https://supabase.com/docs

---

## 🔗 **Final URLs** (To be filled after deployment)

- **Frontend**: https://ksis-teaps.vercel.app
- **Backend API**: https://ksis-backend.railway.app
- **Supabase Dashboard**: https://supabase.com/dashboard/project/brpnempyimxftzlnouam

---

**Ready to deploy!**
