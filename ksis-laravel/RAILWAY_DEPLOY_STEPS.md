# 🚀 Railway Deployment - Step by Step

## ✅ Code Successfully Pushed to GitHub!

Your repository: **Bashar-ml-en/KSIS-TEAPS**
All changes have been committed and pushed.

---

## 📋 Deploy Backend to Railway

### Step 1: Login to Railway
1. The Railway tab is already open at: https://railway.com/
2. Click **"Login"** in the top right
3. Select **"Login with Google"**
4. Use your Google account (same as Supabase)
5. You should see your Railway dashboard

### Step 2: Create New Project
1. Click **"+ New Project"**
2. Select **"Deploy from GitHub repo"**
3. If asked, authorize Railway to access your GitHub
4. Select repository: **Bashar-ml-en/KSIS-TEAPS**
5. Select directory: **ksis-laravel** (or the root if it's in root)

### Step 3: Configure Environment Variables
In Railway dashboard, go to **Variables** tab and add these:

```env
APP_NAME=KSIS TEAPS
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-project-name.up.railway.app

DB_CONNECTION=pgsql
DB_HOST=aws-1-ap-northeast-1.pooler.supabase.com
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres.brpnempyimxftzlnouam
DB_PASSWORD=Ksisbackend123
DB_SSLMODE=require

SESSION_DRIVER=cookie
SESSION_LIFETIME=120

CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Step 4: Generate APP_KEY
**IMPORTANT**: You need to generate a unique APP_KEY

**Option A - Generate Locally (Recommended)**
```powershell
# Run this in your local terminal:
cd c:\Backend(KSIS)\ksis-laravel
php artisan key:generate --show
```

Copy the output (it will look like: `base64:xxxxxxxxxxxx`)
Then in Railway: Add variable `APP_KEY` with that value

**Option B - Generate on Railway**
After deployment, run in Railway console:
```bash
php artisan key:generate --show
```

### Step 5: Deploy!
1. Railway will automatically start building
2. Wait for deployment to complete (usually 2-5 minutes)
3. Once done, you'll get a URL like: `https://your-app.up.railway.app`

### Step 6: Verify Deployment
Test your backend API:
```
https://your-app.up.railway.app/api/login
```

Should return: `{"message":""}`

---

## 🔧 If Railway Doesn't Auto-Deploy

### Manual Deployment Settings
If Railway doesn't detect Laravel automatically:

1. Go to **Settings** → **Build Command**:
   ```bash
   composer install --no-dev --optimize-autoloader
   ```

2. **Start Command**:
   ```bash
   php artisan serve --host=0.0.0.0 --port=$PORT
   ```

3. **Root Directory**: 
   - If code is in `ksis-laravel` folder: `/ksis-laravel`
   - If code is in root: `/`

---

## ✅ Post-Deployment Checklist

### 1. Get Your Railway URL
- Copy your Railway URL (e.g., `https://ksis-backend.up.railway.app`)

### 2. Update CORS
In Railway environment variables, update:
```
CORS_ALLOWED_ORIGINS=https://your-frontend-url.vercel.app,http://localhost:3000
```

### 3. Test the API
```bash
# Test login endpoint
curl https://your-railway-url.up.railway.app/api/login

# Test with credentials
curl -X POST https://your-railway-url.up.railway.app/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hr@ksis.edu.kw","password":"password123"}'
```

---

## 🚨 Troubleshooting

### Build Fails
1. Check Railway logs for errors
2. Verify all environment variables are set
3. Make sure APP_KEY is generated

### App Crashes on Start
1. Check logs: Look for errors
2. Common issues:
   - Missing APP_KEY
   - Wrong database credentials
   - Missing PHP extensions

### Database Connection Error
1. Verify Supabase credentials
2. Check DB_SSLMODE is set to `require`
3. Test Supabase connection from Railway logs

### 500 Server Error
1. Set `APP_DEBUG=true` temporarily to see error
2. Check Railway logs
3. Run `php artisan config:clear` in Railway console

---

## 📊 Expected Results

After successful deployment:

✅ Railway URL active: `https://your-app.up.railway.app`  
✅ API endpoint works: `/api/login` returns `{"message":""}`  
✅ Database connected to Supabase  
✅ Ready for frontend connection  

---

## 🔗 Next: Deploy Frontend to Vercel

Once Railway is deployed:
1. Copy your Railway URL
2. Update frontend environment:
   ```
   VITE_API_URL=https://your-railway-url.up.railway.app/api
   ```
3. Deploy frontend to Vercel

---

## 📝 Railway Dashboard Quick Guide

- **Deployments**: See build history
- **Variables**: Environment variables
- **Metrics**: CPU, Memory usage
- **Logs**: View application logs (very helpful for debugging!)
- **Settings**: Advanced configurations

---

**Your Railway Project is Ready to Deploy!** 🎉

Login, create project, add env variables, and you're live!
