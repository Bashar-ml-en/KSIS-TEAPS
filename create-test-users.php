#!/usr/bin/env php
<?php
/**
 * KSIS End-to-End Test Setup
 * Creates test users for complete workflow testing
 */

require __DIR__.'/ksis-laravel/vendor/autoload.php';

$app = require_once __DIR__.'/ksis-laravel/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "\n";
echo "╔══════════════════════════════════════════════════════╗\n";
echo "║   KSIS E2E Test Setup - Creating Test Users         ║\n";
echo "╚══════════════════════════════════════════════════════╝\n";
echo "\n";

// Function to create or update user
function createTestUser($name, $email, $password, $role) {
    $user = User::where('email', $email)->first();
    
    if ($user) {
        echo "⚠️  User already exists: {$email}\n";
        echo "   Updating password to: {$password}\n";
        $user->password = Hash::make($password);
        $user->save();
    } else {
        $user = User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => $role,
            'email_verified_at' => now(),
        ]);
        echo "✅ Created: {$email}\n";
    }
    
    return $user;
}

echo "📝 Creating test users for E2E testing...\n";
echo "────────────────────────────────────────────────────────\n\n";

// 1. Teacher
echo "1️⃣  Teacher Account:\n";
$teacher = createTestUser(
    'Test Teacher',
    'teacher.test@ksis.edu.kw',
    'teacher123',
    'teacher'
);
echo "   Name: Test Teacher\n";
echo "   Email: teacher.test@ksis.edu.kw\n";
echo "   Password: teacher123\n";
echo "   Role: Teacher\n\n";

// 2. Principal
echo "2️⃣  Principal Account:\n";
$principal = createTestUser(
    'Test Principal',
    'principal.test@ksis.edu.kw',
    'principal123',
    'principal'
);
echo "   Name: Test Principal\n";
echo "   Email: principal.test@ksis.edu.kw\n";
echo "   Password: principal123\n";
echo "   Role: Principal\n\n";

// 3. HR Admin (if not exists)
echo "3️⃣  HR Admin Account:\n";
$admin = createTestUser(
    'HR Administrator',
    'admin@ksis.edu.kw',
    'admin123',
    'hr_admin'
);
echo "   Name: HR Administrator\n";
echo "   Email: admin@ksis.edu.kw\n";
echo "   Password: admin123\n";
echo "   Role: HR Admin\n\n";

echo "════════════════════════════════════════════════════════\n";
echo "✅ Test users created successfully!\n";
echo "════════════════════════════════════════════════════════\n\n";

echo "📋 Testing Workflow:\n";
echo "────────────────────────────────────────────────────────\n";
echo "Step 1: Login as Teacher\n";
echo "   → Email: teacher.test@ksis.edu.kw\n";
echo "   → Password: teacher123\n";
echo "   → Create KPIs, view dashboard\n\n";

echo "Step 2: Login as Principal\n";
echo "   → Email: principal.test@ksis.edu.kw\n";
echo "   → Password: principal123\n";
echo "   → Review teacher KPIs\n";
echo "   → Provide feedback\n";
echo "   → Approve evaluations\n\n";

echo "Step 3: Login as HR Admin\n";
echo "   → Email: admin@ksis.edu.kw\n";
echo "   → Password: admin123\n";
echo "   → View system performance\n";
echo "   → Check reports\n";
echo "   → Monitor analytics\n\n";

echo "🌐 Application URL: http://localhost:3001\n";
echo "🔌 Backend API: http://localhost:8000/api\n\n";

echo "🎯 All users are ready for testing!\n\n";
