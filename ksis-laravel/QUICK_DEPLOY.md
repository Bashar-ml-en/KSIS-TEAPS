# 🚀 Quick Deployment Guide - KSIS TEAPS

## Option 1: Using Railway CLI (Recommended for Backend)

### Install Railway CLI
```bash
# Windows (PowerShell)
iwr https://railway.app/install.ps1 | iex

# Or visit: https://docs.railway.app/guides/cli
```

### Deploy Backend to Railway
```bash
cd c:\Backend(KSIS)\ksis-laravel

# Login to Railway
railway login

# Initialize project
railway init

# Link to your project (or create new)
railway link

# Add environment variables from .env.railway
railway variables set APP_NAME="KSIS TEAPS"
railway variables set APP_ENV=production
railway variables set APP_DEBUG=false
railway variables set DB_CONNECTION=pgsql
railway variables set DB_HOST=aws-1-ap-northeast-1.pooler.supabase.com
railway variables set DB_PORT=5432
railway variables set DB_DATABASE=postgres
railway variables set DB_USERNAME=postgres.brpnempyimxftzlnouam
railway variables set DB_PASSWORD=Ksisbackend123
railway variables set DB_SSLMODE=require

# Generate APP_KEY
php artisan key:generate --show
# Copy the output and run:
railway variables set APP_KEY="base64:your-generated-key-here"

# Deploy
railway up

# Get your deployment URL
railway domain
```

---

## Option 2: Using Vercel CLI (For Frontend)

### Install Vercel CLI
```bash
npm install -g vercel
```

### Deploy Frontend to Vercel
```bash
cd c:\Frontend(KSIS)

# Login to Vercel
vercel login

# Deploy (first time)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? ksis-teaps
# - Directory? ./
# - Override settings? No

# After backend is deployed, set environment variable:
vercel env add VITE_API_URL

# Enter your Railway backend URL:
# https://your-backend.railway.app/api

# Deploy to production
vercel --prod
```

---

## Option 3: Using Web UI (Easiest)

### Deploy Backend (Railway)
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Push your backend code to GitHub first:
   ```bash
   cd c:\Backend(KSIS)\ksis-laravel
   git init
   git add .
   git commit -m "Initial commit"
   # Create repo on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/ksis-backend.git
   git push -u origin main
   ```
6. Select the repository in Railway
7. Add environment variables in Railway dashboard:
   - Copy from `.env.railway` file
   - Generate APP_KEY locally: `php artisan key:generate --show`
8. Deploy!

### Deploy Frontend (Vercel)
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Framework Preset: **Vite**
5. Root Directory: `./`
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Add Environment Variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend.railway.app/api`
9. Deploy!

---

## ✅ Post-Deployment Checklist

### 1. Test Backend
```bash
# Test health endpoint
curl https://your-backend.railway.app/api/login

# Should return: {"message":""}
```

### 2. Update Frontend .env
Create `.env.production` in frontend:
```
VITE_API_URL=https://your-backend.railway.app/api
```

### 3. Update CORS in Backend
Update Railway environment variable:
```
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
```

### 4. Test Full Flow
1. Visit your Vercel URL
2. Try logging in with: `hr@ksis.edu.kw / password123`
3. Verify dashboard loads
4. Check Supabase for new data

---

## 🐛 Troubleshooting

### Backend doesn't start
- Check Railway logs: `railway logs`
- Verify all environment variables are set
- Ensure APP_KEY is generated

### Frontend can't connect to backend
- Check CORS configuration
- Verify VITE_API_URL is correct
- Check browser console for errors

### Database connection fails
- Verify Supabase credentials
- Check DB_SSLMODE=require is set
- Test connection from Railway logs

---

## 📊 Deployment URLs

After deployment, update these:

- **Frontend**: https://________.vercel.app
- **Backend**: https://________.railway.app
- **Database**: https://supabase.com/dashboard/project/brpnempyimxftzlnouam

---

## 🔄 Updating Deployments

### Update Backend
```bash
cd c:\Backend(KSIS)\ksis-laravel
git add .
git commit -m "Update: description"
git push
# Railway auto-deploys from GitHub
```

### Update Frontend
```bash
cd c:\Frontend(KSIS)
vercel --prod
# Or push to GitHub and Vercel auto-deploys
```

---

**Ready to deploy!** 🎉
