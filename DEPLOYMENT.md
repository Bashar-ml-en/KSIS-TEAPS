# KSIS Backend Deployment Guide

## Recommended Platform: Render.com

Render is the recommended platform for deploying this Laravel application due to its native PHP support, automatic database provisioning, and excellent monorepo handling.

### Why Render Over Railway?

- ✅ Native Laravel/PHP support with zero configuration issues
- ✅ Automatically provisions PostgreSQL database
- ✅ Better monorepo support (handles subdirectories like `ksis-laravel/`)
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Real-time logs and shell access

---

## Deploy to Render (5 Minutes Setup)

### Step 1: Commit Your Code

```bash
# Add all deployment files
git add render.yaml nixpacks.toml Procfile
git commit -m "Add Render deployment configuration"
git push origin main
```

### Step 2: Create Render Account

1. Go to [https://render.com](https://render.com)
2. Sign up with your GitHub account
3. Authorize Render to access your repository

### Step 3: Deploy from Dashboard

1. Click **"New +"** → **"Blueprint"**
2. Connect your repository
3. Render will automatically detect `render.yaml` and configure:
   - Web Service (Laravel API)
   - PostgreSQL Database
   - Environment variables
4. Click **"Apply"**
5. Wait 3-5 minutes for deployment

### Step 4: Set Environment Variables (If Needed)

Render auto-configures most variables, but you may want to add:

- `APP_URL` - Your Render app URL (e.g., `https://ksis-backend.onrender.com`)
- `FRONTEND_URL` - Your frontend URL for CORS
- Any third-party API keys

---

## Alternative: Heroku (If Budget Allows)

Heroku is battle-tested but requires a paid plan ($5/month minimum).

### Deploy to Heroku

```bash
# Install Heroku CLI
# Windows: Download from https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
heroku create ksis-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set root directory to Laravel folder
heroku config:set PROJECT_PATH=ksis-laravel

# Add PHP buildpack
heroku buildpacks:add heroku/php

# Deploy
git push heroku main

# Run migrations
heroku run php artisan migrate --force
heroku run php artisan db:seed --force
```

---

## Alternative: DigitalOcean App Platform

Good middle ground between Render and Heroku.

### Deploy to DigitalOcean

1. Go to [https://cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)
2. Click **"Create App"**
3. Connect your GitHub repository
4. Set **Root Directory**: `ksis-laravel`
5. Select **PHP** as runtime
6. Add **PostgreSQL Dev Database** (free tier)
7. Set build command:
   ```bash
   composer install --no-dev --optimize-autoloader
   ```
8. Set run command:
   ```bash
   php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT
   ```
9. Click **"Create Resources"**

---

## Why Railway Failed

Railway uses Nixpacks/Railpack which struggles with:
- Monorepo structures (Laravel in subdirectory)
- Custom build processes
- Script detection in nested folders

The platform is better suited for single-service applications with standard directory structures.

---

## Post-Deployment Checklist

After deploying to any platform:

- [ ] Verify database connection
- [ ] Test API endpoints (`/api/health`, `/api/login`)
- [ ] Check logs for errors
- [ ] Run `php artisan migrate:status` to verify migrations
- [ ] Test authentication flow
- [ ] Update frontend API URL to point to deployed backend

---

## Need Help?

- **Render Docs**: https://render.com/docs/deploy-php-laravel-docker
- **Heroku Docs**: https://devcenter.heroku.com/articles/getting-started-with-laravel
- **DigitalOcean Docs**: https://docs.digitalocean.com/products/app-platform/languages-frameworks/php/
