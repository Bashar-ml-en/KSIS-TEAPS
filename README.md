# KSIS-TEAPS - Knowledge Sustainability International School Teacher Evaluation and Performance System

🏫 A comprehensive Teacher Evaluation and Performance Assessment Platform

## 📁 Monorepo Structure

```
KSIS-TEAPS/
├── frontend/          # React + Vite + TypeScript
│   ├── src/
│   ├── package.json
│   └── vercel.json
├── backend/           # Laravel 11 API (root level)
│   ├── app/
│   ├── routes/
│   ├── database/
│   └── api/index.php  # Vercel entry point
├── vercel.json        # Backend Vercel config
└── README.md
```

## 🚀 Quick Deploy to Vercel

### Backend
1. Import this repo to Vercel
2. Framework: **Other**
3. Root Directory: `./` (backend is at root)
4. Add environment variables (see VERCEL_DEPLOYMENT.md)

### Frontend  
1. Import this repo to Vercel AGAIN
2. Framework: **Vite**
3. Root Directory: `frontend`
4. Add environment variable: `VITE_API_URL=<backend-url>/api`

## 🛠️ Local Development

### Backend
```bash
cd ./
php artisan serve
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📊 Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Axios

**Backend:**
- Laravel 11
- PostgreSQL (Supabase)
- Sanctum Auth
- Vercel Serverless

**Infrastructure:**
- Hosting: Vercel
- Database: Supabase PostgreSQL
- Storage: Supabase S3

## 📖 Documentation

- [Vercel Deployment Guide](./VERCEL_DEPLOYMENT.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Feature Checklist](./FEATURE_COMPLETION_CHECKLIST.md)

## ✨ Features

- ✅ User Management (Teachers, Principals, HR Admins)
- ✅ Contract Management
- ✅ System Settings
- ✅ KPI Management
- ✅ Performance Evaluations
- ✅ Attendance Tracking
- ✅ CPE (Continuous Professional Education) Records
- ✅ Reports & Analytics

## 🔐 Default Test Users

See `database/seeders/TestUsersSeeder.php` for test credentials.

## 📝 License

Proprietary - KSIS International School
