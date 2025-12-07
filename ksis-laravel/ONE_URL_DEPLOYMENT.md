# 🎯 One-Platform Deployment - Railway Monorepo

## ✅ **READY TO DEPLOY!**

Everything is configured for **ONE URL** deployment on Railway!

```
https://ksis-teaps.up.railway.app
├── / → React Frontend (Knowledge Sustainability International School)
├── /api → Laravel Backend API
└── Database → Supabase PostgreSQL
```

---

## 🚀 **Deploy to Railway - Step by Step**

### Step 1: Login to Railway
1. Railway tab is open at: https://railway.com/
2. Click **"Login"** → **"Login with Google"**
3. Use your Google account (same as Supabase)

### Step 2: Create New Project
1. Click **"+ New Project"**
2. Select **"Deploy from GitHub repo"**
3. Authorize Railway to access GitHub (if needed)
4. Select: **Bashar-ml-en/KSIS-TEAPS**
5. Root directory: **ksis-laravel** folder

### Step 3: Add Environment Variables
Click **"Variables"** and add these ONE BY ONE:

```env
APP_NAME=KSIS TEAPS
APP_ENV=production
APP_KEY=base64:siJquDUrxTdUN2gJ+AniHEUiywnnhP9ClDlqRXnwA1E=
APP_DEBUG=false

DB_CONNECTION=pgsql
DB_HOST=aws-1-ap-northeast-1.pooler.supabase.com
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres.brpnempyimxftzlnouam
DB_PASSWORD=Ksisbackend123
DB_SSLMODE=require

SESSION_DRIVER=cookie
SESSION_LIFETIME=120
```

**Important**: Don't set `APP_URL` or `CORS_ALLOWED_ORIGINS` yet. Railway will auto-assign the URL.

### Step 4: Deploy!
Railway will automatically start building and deploying.

**Build Process (2-5 minutes):**
1. ✅ Install Composer dependencies
2. ✅ Build Laravel application  
3. ✅ Cache configurations
4. ✅ Deploy to production

### Step 5: Get Your URL
Once deployed, Railway will give you a URL like:
```
https://ksis-teaps.up.railway.app
```

### Step 6: Update APP_URL
After deployment, add this environment variable:
```
APP_URL=https://your-assigned-url.up.railway.app
```

---

## 🎯 **What Users Will See**

### **ONE URL for Everything:**
```
https://your-app.up.railway.app/
```

- **Login Page** → Frontend React app
- **Dashboard** → All user interfaces
- **API Calls** → Automatically handled at `/api/*`
- **Database** → Supabase PostgreSQL

---

## 🧪 **Testing Your Deployment**

### 1. Visit Your URL
```
https://your-app.up.railway.app/
```
You should see the **KSIS Login Page**!

### 2. Test Login
Use any of these credentials:
```
HR Admin:    hr@ksis.edu.kw / password123
Principal:   principal@ksis.edu.kw / password123
Teacher 1:   sarah.teacher@ksis.edu.kw / password123
Teacher 2:   ahmed.teacher@ksis.edu.kw / password123
```

### 3. Test API Directly (Optional)
```bash
# Test health endpoint
curl https://your-app.up.railway.app/api/login

# Should return: {"message":""}
```

### 4. Share with Testers!
Just share the ONE URL:
```
https://your-app.up.railway.app
```

Testers can:
- Access the application
- Login with test credentials
- Test all features
- Provide feedback

---

## 📊 **Architecture**

```
┌─────────────────────────────┐
│   USERS ACCESS HERE:        │
│ https://your-app.railway    │
└────────────┬────────────────┘
             │
    ┌────────▼────────┐
    │   RAILWAY       │
    │  (Single App)   │
    ├─────────────────┤
    │  Frontend Files │ → React (built)
    │  /api routes    │ → Laravel API
    └────────┬────────┘
             │
    ┌────────▼────────┐
    │   SUPABASE      │
    │  PostgreSQL DB  │
    └─────────────────┘
```

---

## ⚡ **What We Did**

1. ✅ Built React frontend for production
2. ✅ Copied frontend to Laravel `public/app` directory
3. ✅ Updated Laravel routes to serve frontend
4. ✅ Changed API calls to use relative paths (`/api`)
5. ✅ Pushed everything to GitHub
6. ✅ Ready for Railway deployment

---

##  🔧 **If Something Goes Wrong**

### Deployment Fails
1. Check Railway logs (click on deployment)
2. Verify all environment variables are set
3. Most common issue: Missing APP_KEY

### Frontend Doesn't Load
1. Check if `/` route works
2. Look for errors in browser console
3. Verify frontend files are in `public/app`

### API Not Working
1. Test `/api/login` endpoint
2. Check database connection in Railway logs
3. Verify Supabase credentials

### Can't Login
1. Check browser network tab for errors
2. Verify database has seeded users
3. Check CORS in Railway logs

---

## 📝 **Environment Variables Checklist**

- [x] `APP_NAME`
- [x] `APP_ENV`
- [x] `APP_KEY` ⚠️ **CRITICAL!**
- [x] `APP_DEBUG`  
- [x] `DB_CONNECTION`
- [x] `DB_HOST`
- [x] `DB_PORT`
- [x] `DB_DATABASE`
- [x] `DB_USERNAME`
- [x] `DB_PASSWORD`
- [x] `DB_SSLMODE`
- [x] `SESSION_DRIVER`
- [x] `SESSION_LIFETIME`
- [ ] `APP_URL` (add AFTER deployment)

---

## 🎉 **Success Criteria**

When deployment is successful:

✅ Railway deployment shows "Success"  
✅ URL loads the KSIS login page  
✅ Can login with test credentials  
✅ Dashboard loads after login  
✅ Data saves to Supabase  
✅ ONE URL for everything!  

---

## 🔗 **Your Details**

**GitHub Repo**: https://github.com/Bashar-ml-en/KSIS-TEAPS  
**Railway**: https://railway.com/ (login with Google)  
**Supabase**: Already configured ✅  

**Generated APP_KEY**:
```
base64:siJquDUrxTdUN2gJ+AniHEUiywnnhP9ClDlqRXnwA1E=
```

---

## 🚀 **Ready to Deploy!**

1. Open Railway (tab is ready)
2. Login with Google
3. Create project from GitHub
4. Add environment variables
5. Deploy!
6. Get ONE URL to share!

---

**Everything is ready for one-click deployment!** 🎯

Railway will handle:
- ✅ Backend deployment
- ✅ Frontend serving
- ✅ Database connection
- ✅ ONE URL for testers!
