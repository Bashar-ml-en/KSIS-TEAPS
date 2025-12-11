# 🚂 Railway Monorepo Deployment Guide for KSIS-TEAPS

This repository contains both the Backend (Laravel) and Frontend (React/Vite). Follow these steps to deploy them properly on Railway.

## 1. Create a New Project
1.  Go to [Railway Dashboard](https://railway.app).
2.  Click **"New Project"** -> **"GitHub Repo"**.
3.  Select `Bashar-ml-en/KSIS-TEAPS`.
4.  This adds your repository to the canvas.

## 2. Configure Backend Service (Laravel)
By default, Railway might try to detect the app. Let's configure it specifically for the backend.

1.  Click on the newly created card (repo).
2.  Click **"Settings"**.
3.  **Service Name:** Change to `ksis-backend`.
4.  **Root Directory:** Leave as `/` (default).
5.  **Build Command:** (Leave generic or empty, Nixpacks handles it).
6.  **Deploy Command:** `php artisan migrate --force`
    *   *This automatically runs your database migrations on every deploy!*
7.  **Watch Paths:** (Optional) Ignore `frontend/**` to prevent backend rebuilding when frontend changes.

### Variables (Backend)
Go to the **"Variables"** tab and add these. (Copy from your Supabase/Local env):

- `APP_NAME=KSIS`
- `APP_ENV=production`
- `APP_KEY=base64:YOUR_KEY_HERE`
- `APP_DEBUG=false`
- `APP_URL=https://<your-backend-railway-url>.railway.app` (Update this after URL is generated!)
- `DB_CONNECTION=pgsql`
- `DB_HOST=...` (Supabase Host)
- `DB_PORT=6543`
- `DB_DATABASE=postgres`
- `DB_USERNAME=...`
- `DB_PASSWORD=...`
- `FILESYSTEM_DISK=s3`
- `AWS_BUCKET=...`
- `AWS_ACCESS_KEY_ID=...`
- `AWS_SECRET_ACCESS_KEY=...`
- `AWS_DEFAULT_REGION=ap-southeast-1`
- `AWS_ENDPOINT=...`
- `AWS_USE_PATH_STYLE_ENDPOINT=true`
- `SANCTUM_STATEFUL_DOMAINS=localhost,<your-frontend-railway-url>.railway.app`

## 3. Configure Frontend Service (React)
Now we add the frontend to the same project.

1.  Click **"New"** (top right) -> **"GitHub Repo"** -> Select `Bashar-ml-en/KSIS-TEAPS` **AGAIN**.
2.  Now you have two cards for the same repo. Click the NEW one.
3.  Click **"Settings"**.
4.  **Service Name:** Change to `ksis-frontend`.
5.  **Root Directory:** Change to `/frontend`.
    *   *This is CRITICAL. It tells Railway this service lives in the subfolder.*
6.  **Build Command:** `npm run build`
7.  **Start Command:** `npm run preview -- --port $PORT --host`
    *   *Or if you prefer using `serve`: `npx serve -s dist -l $PORT`*

### Variables (Frontend)
Go to the **"Variables"** tab:

- `VITE_API_URL=https://<your-backend-railway-url>.railway.app/api`
    *   *Point this to the BACKEND service URL you created in Step 2.*

## 4. Final Connection
1.  Once Backend deploys, copy its domain.
2.  Update Frontend's `VITE_API_URL` variable.
3.  Update Backend's `APP_URL` variable.
4.  Update Backend's `SANCTUM_STATEFUL_DOMAINS` with the Frontend domain.
5.  Redeploy both.

✅ **Done!** You now have a robust monorepo deployment.
