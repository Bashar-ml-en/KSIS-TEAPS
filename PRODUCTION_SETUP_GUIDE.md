# 🗑️ Clean Up Test Credentials & Setup Real Users

## Problem: Server Restarted but Login Failing

The issue is that test credentials are shown on the login screen but they're not working properly after server restart.

---

## Solution: Delete Test Data & Create Real Users

### Step 1: Delete All Test Users

Run this SQL to remove all test users from database:

```sql
-- Delete all test users
DELETE FROM users WHERE email IN (
    'hr@ksis.edu.kw',
    'principal@ksis.edu.kw',
    'teacher@ksis.edu.kw',
    'admin@example.com',
    'principal@example.com',
    'teacher@example.com'
);

-- Verify deletion
SELECT id, name, email, role FROM users ORDER BY id;
```

### Step 2: Create Real Admin User

**Option A: Using Laravel Tinker (Recommended)**

```powershell
# Open Laravel Tinker
cd c:\Backend(KSIS)\ksis-laravel
php artisan tinker

# Create admin user
User::create([
    'name' => 'System Administrator',
    'email' => 'admin@ksis.edu.kw',
    'password' => Hash::make('your-secure-password'),
    'role' => 'hr_admin',
    'email_verified_at' => now()
]);

# Exit tinker
exit
```

**Option B: Using SQL**

```sql
-- Create admin user
INSERT INTO users (name, email, password, role, email_verified_at, created_at, updated_at)
VALUES (
    'System Administrator',
    'admin@ksis.edu.kw',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: password
    'hr_admin',
    NOW(),
    NOW(),
    NOW()
);
```

**Default Password:** `password` (change after first login!)

---

## Step 3: Remove Test Credentials from Login Screen

Edit the frontend login component to remove test credentials display:

**File:** `c:\Frontend(KSIS)\src\components\auth\LoginScreen.tsx`

**Find this section:**
```tsx
{/* Test Credentials */}
<div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
  <p className="text-sm font-semibold text-blue-900 mb-2">Test Credentials:</p>
  <div className="text-xs text-blue-800 space-y-1">
    <p>HR Admin: hr@ksis.edu.kw / password123</p>
    <p>Principal: principal@ksis.edu.kw / password123</p>
    <p>Teacher: teacher@ksis.edu.kw / password123</p>
  </div>
</div>
```

**Replace with:**
```tsx
{/* Production - No test credentials shown */}
```

Or simply **DELETE** that entire section.

---

## Step 4: Quick Cleanup Commands

### PowerShell Commands:

```powershell
# 1. Go to Laravel directory
cd c:\Backend(KSIS)\ksis-laravel

# 2. Delete test users via Artisan
php artisan tinker

# In Tinker:
User::whereIn('email', [
    'hr@ksis.edu.kw',
    'principal@ksis.edu.kw', 
    'teacher@ksis.edu.kw',
    'admin@example.com',
    'principal@example.com',
    'teacher@example.com'
])->delete();

# Check remaining users
User::all();

exit

# 3. Create your real admin
php artisan tinker

# In Tinker:
User::create([
    'name' => 'Your Name',
    'email' => 'your-email@ksis.edu.kw',
    'password' => Hash::make('YourSecurePassword123!'),
    'role' => 'hr_admin',
    'email_verified_at' => now()
]);

exit
```

---

## Step 5: Restart Everything

```powershell
# 1. Stop backend (Ctrl+C in backend terminal)

# 2. Stop frontend (Ctrl+C in frontend terminal)

# 3. Clear Laravel cache
cd c:\Backend(KSIS)\ksis-laravel
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# 4. Restart backend
php artisan serve --port=8000

# 5. Restart frontend (in new terminal)
cd c:\Frontend(KSIS)
npm run dev
```

---

## Step 6: First Real Login

1. Open browser: `http://localhost:3000`
2. Login with your new admin credentials
3. Go to User Management
4. Add real teachers, principals as needed

---

## Creating Real Users Through UI

Once logged in as admin:

### Add Teachers:
1. Go to "Add Teacher"
2. Fill in real details:
   - Name: Teacher's actual name
   - Email: Real school email
   - Department: Actual department
   - Password: Secure password
3. Click "Add Teacher"
4. Teacher can now login with their email/password

### Add Principals:
1. Go to "User Management"
2. Click "Add User"
3. Select role: "Principal"
4. Fill real details
5. Save

---

## Security Best Practices

### Strong Passwords:
- Minimum 8 characters
- Mix of letters, numbers, symbols
- Change default passwords immediately

### Email Addresses:
- Use real school email addresses
- Format: `name@ksis.edu.kw`
- Avoid generic emails

### User Management:
- Create users as needed
- Delete test users immediately
- Regular password rotation
- Monitor active sessions

---

## Troubleshooting

### "Login failed" Error:

**Cause:** Test credentials deleted but frontend still showing them

**Solution:**
1. Remove test credentials from LoginScreen.tsx
2. Restart frontend: `npm run dev`
3. Hard refresh browser: Ctrl+Shift+R

### Can't Delete Users:

**Cause:** Foreign key constraints

**Solution:**
```sql
-- Delete related records first
DELETE FROM kpis WHERE teacher_id IN (SELECT id FROM users WHERE email LIKE '%@example.com');
DELETE FROM mycpe_records WHERE teacher_id IN (SELECT id FROM users WHERE email LIKE '%@example.com');
DELETE FROM notifications WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%@example.com');

-- Then delete users
DELETE FROM users WHERE email LIKE '%@example.com';
```

### Forgot Admin Password:

**Solution:**
```powershell
php artisan tinker

# Reset admin password
$admin = User::where('email', 'admin@ksis.edu.kw')->first();
$admin->password = Hash::make('NewPassword123!');
$admin->save();

exit
```

---

## Quick Reference

### Delete All Test Users:
```powershell
cd c:\Backend(KSIS)\ksis-laravel
php artisan tinker
User::where('email', 'LIKE', '%@example.com')->delete();
exit
```

### Create Admin:
```powershell
php artisan tinker
User::create(['name' => 'Admin', 'email' => 'admin@ksis.edu.kw', 'password' => Hash::make('password'), 'role' => 'hr_admin', 'email_verified_at' => now()]);
exit
```

### List All Users:
```powershell
php artisan tinker
User::all(['id', 'name', 'email', 'role']);
exit
```

---

## Summary

**To go to production:**

1. ✅ Delete test users from database
2. ✅ Remove test credentials from login screen
3. ✅ Create real admin account
4. ✅ Restart backend & frontend
5. ✅ Login with real credentials
6. ✅ Add real teachers/principals through UI

**Your system is now production-ready!** 🎉

---

**Created:** December 5, 2025  
**Purpose:** Clean up test data and setup for real use  
**Status:** Ready for production deployment
