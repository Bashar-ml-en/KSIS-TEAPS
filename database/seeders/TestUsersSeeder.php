<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUsersSeeder extends Seeder
{
    public function run(): void
    {
        // Teacher
        if (!User::where('email', 'teacher@ksis.edu.kw')->exists()) {
            User::create([
                'name' => 'Test Teacher',
                'email' => 'teacher@ksis.edu.kw',
                'password' => Hash::make('password123'),
                'role' => 'teacher',
            ]);
            $this->command->info('Teacher user created.');
        }

        // Principal
        if (!User::where('email', 'principal@ksis.edu.kw')->exists()) {
            User::create([
                'name' => 'Test Principal',
                'email' => 'principal@ksis.edu.kw',
                'password' => Hash::make('password123'),
                'role' => 'principal',
            ]);
            $this->command->info('Principal user created.');
        }

        // HR Admin
        if (!User::where('email', 'hr@ksis.edu.kw')->exists()) {
            User::create([
                'name' => 'Test HR Admin',
                'email' => 'hr@ksis.edu.kw',
                'password' => Hash::make('password123'),
                'role' => 'hr_admin',
            ]);
            $this->command->info('HR Admin user created.');
        }
    }
}
