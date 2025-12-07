#!/usr/bin/env php
<?php
/**
 * KSIS Production Setup Script
 * Run this to clean up test data and create your first admin user
 */

require __DIR__.'/ksis-laravel/vendor/autoload.php';

$app = require_once __DIR__.'/ksis-laravel/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "\n";
echo "╔══════════════════════════════════════════════════════╗\n";
echo "║   KSIS Production Setup - Test Data Cleanup         ║\n";
echo "╚══════════════════════════════════════════════════════╝\n";
echo "\n";

// Step 1: Show current users
echo "📋 Current users in database:\n";
echo "────────────────────────────────────────────────────────\n";

$users = User::all(['id', 'name', 'email', 'role']);
foreach ($users as $user) {
    echo sprintf("  ID: %-3d | %-25s | %-30s | %s\n", 
        $user->id, 
        $user->name, 
        $user->email, 
        $user->role
    );
}
echo "\n";

// Step 2: Ask to delete test users
echo "🗑️  Delete test users?\n";
echo "────────────────────────────────────────────────────────\n";
echo "This will delete users with emails:\n";
echo "  - *@example.com\n";
echo "  - hr@ksis.edu.kw\n";
echo "  - principal@ksis.edu.kw\n";
echo "  - teacher@ksis.edu.kw\n";
echo "\n";

$testEmails = [
    'hr@ksis.edu.kw',
    'principal@ksis.edu.kw',
    'teacher@ksis.edu.kw',
    'admin@example.com',
    'principal@example.com',
    'teacher@example.com',
];

$deleted = User::whereIn('email', $testEmails)->delete();

if ($deleted > 0) {
    echo "✅ Deleted {$deleted} test user(s)\n\n";
} else {
    echo "ℹ️  No test users found to delete\n\n";
}

// Step 3: Create admin user
echo "👤 Create admin user\n";
echo "────────────────────────────────────────────────────────\n";

// Check if admin exists
$existingAdmin = User::where('role', 'hr_admin')->first();

if ($existingAdmin) {
    echo "⚠️  Admin user already exists:\n";
    echo "   Name: {$existingAdmin->name}\n";
    echo "   Email: {$existingAdmin->email}\n";
    echo "\n";
    echo "   Skip creating new admin.\n\n";
} else {
    // Create default admin
    $admin = User::create([
        'name' => 'System Administrator',
        'email' => 'admin@ksis.edu.kw',
        'password' => Hash::make('admin123'),
        'role' => 'hr_admin',
        'email_verified_at' => now(),
    ]);

    echo "✅ Admin user created successfully!\n";
    echo "   Name: {$admin->name}\n";
    echo "   Email: {$admin->email}\n";
    echo "   Password: admin123\n";
    echo "\n";
    echo "   ⚠️  IMPORTANT: Change this password after first login!\n\n";
}

// Step 4: Show final user list
echo "📋 Final user list:\n";
echo "────────────────────────────────────────────────────────\n";

$finalUsers = User::all(['id', 'name', 'email', 'role']);
echo "Total users: " . $finalUsers->count() . "\n\n";

foreach ($finalUsers as $user) {
    echo sprintf("  ID: %-3d | %-25s | %-30s | %s\n", 
        $user->id, 
        $user->name, 
        $user->email, 
        $user->role
    );
}
echo "\n";

// Step 5: Final instructions
echo "╔══════════════════════════════════════════════════════╗\n";
echo "║   Setup Complete!                                    ║\n";
echo "╚══════════════════════════════════════════════════════╝\n";
echo "\n";
echo "Next steps:\n";
echo "  1. Start backend: php artisan serve --port=8000\n";
echo "  2. Start frontend: npm run dev\n";
echo "  3. Login at http://localhost:3000\n";
echo "  4. Change admin password immediately!\n";
echo "  5. Add real users through the UI\n";
echo "\n";
echo "✅ Your KSIS system is ready for production use!\n\n";
