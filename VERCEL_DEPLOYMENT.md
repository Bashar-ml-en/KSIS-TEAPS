# KSIS-TEAPS Vercel Deployment Guide

## 🚀 Quick Deploy

Both Frontend and Backend deploy to Vercel with Supabase as the database.

### Prerequisites
- Vercel Account
- Supabase Project: `brpnempyimxftzlnouam`
- GitHub repos pushed

---

## Backend Deployment

### 1. Deploy to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import: `Bashar-ml-en/KSIS-TEAPS`
3. Framework: **Other**
4. Add environment variables (see below)
5. Deploy

### 2. Backend Environment Variables

```env
# Application
APP_NAME=KSIS
APP_ENV=production
APP_KEY=<copy from local .env>
APP_DEBUG=false
APP_URL=https://your-backend.vercel.app

# Database (Supabase - USE POOLER!)
DB_CONNECTION=pgsql
DB_HOST=aws-0-ap-southeast-1.pooler.supabase.com
DB_PORT=6543
DB_DATABASE=postgres
DB_USERNAME=postgres.brpnempyimxftzlnouam
DB_PASSWORD=<your supabase password>

# Serverless Configuration
CACHE_DRIVER=database
SESSION_DRIVER=database
SESSION_LIFETIME=120
QUEUE_CONNECTION=sync

# File Storage (Supabase S3)
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=<supabase s3 key>
AWS_SECRET_ACCESS_KEY=<supabase s3 secret>
AWS_DEFAULT_REGION=ap-southeast-1
AWS_BUCKET=ksis-uploads
AWS_ENDPOINT=https://brpnempyimxftzlnouam.supabase.co/storage/v1/s3
AWS_USE_PATH_STYLE_ENDPOINT=true

# CORS
SANCTUM_STATEFUL_DOMAINS=localhost,your-frontend.vercel.app
SESSION_DOMAIN=.vercel.app
```

---

## Frontend Deployment

### 1. Deploy to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import: `Yuki-hnin/KSIS-TEAPS` 
3. Framework: **Vite**
4. Add ONE environment variable:

```env
VITE_API_URL=https://your-backend.vercel.app/api
```

5. Deploy

---

## Post-Deployment

### Update CORS
After both deploy, update backend env var:
```
SANCTUM_STATEFUL_DOMAINS=localhost,your-actual-frontend.vercel.app
```

Redeploy backend.

---

## Get Supabase Values

### Database Password
- Dashboard → Settings → Database → Password

### S3 Keys
- Dashboard → Settings → Storage → Generate S3 Access Keys

### Create Storage Bucket
- Dashboard → Storage → New Bucket: `ksis-uploads`
- Make public or configure policies

---

## Test
1. Visit your frontend URL
2. Register/Login
3. Test all features

---

## Architecture

```
Frontend (Vercel) → Backend (Vercel) → Database (Supabase)
                         ↓
                   Storage (Supabase S3)
```

All on serverless infrastructure, cost-effective and scalable.
