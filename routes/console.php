<?php

use Illuminate\Support\Facades\Artisan;

Artisan::command('fix:teacher-profiles', function () {
    $this->info('Fixing teacher profiles...');
    
    // Get all users with teacher role
    $teacherUsers = \App\Models\User::where('role', 'teacher')->get();
    
    $this->info("Found {$teacherUsers->count()} teacher users");
    
    foreach ($teacherUsers as $user) {
        // Check if teacher profile exists
        $teacher = \App\Models\Teacher::where('user_id', $user->id)->first();
        
        if (!$teacher) {
            // Create teacher profile
            $teacher = \App\Models\Teacher::create([
                'user_id' => $user->id,
                'department_id' => 1, // Default to Mathematics
                'employee_id' => 'T' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
                'full_name' => $user->name,
                'is_active' => true,
            ]);
            
            $this->info("✅ Created teacher profile for: {$user->name} (ID: {$user->id})");
        } else {
            $this->info("✓ Teacher profile already exists for: {$user->name}");
        }
    }
    
    $this->info('✅ Done!');
})->purpose('Create teacher profiles for users without them');
