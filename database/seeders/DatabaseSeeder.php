<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Department;
use App\Models\Teacher;
use App\Models\Principal;
use App\Models\HrAdmin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Get the principal (will be created below)
        $principalUser = User::create([
            'name' => 'John Principal',
            'email' => 'principal@ksis.edu.kw',
            'password' => Hash::make('password123'),
            'role' => 'principal',
        ]);

        $principal = Principal::create([
            'user_id' => $principalUser->id,
            'employee_id' => 'P001',
            'full_name' => 'John Principal',
            'phone' => '+965-12345679',
            'date_appointed' => now()->subYears(3),
            'school_name' => 'KSIS Main Campus',
            'is_active' => true,
        ]);

        // Create main departments under Principal
        // 1. Curriculum Department (parent)
        $curriculumDept = Department::create([
            'name' => 'Curriculum Department',
            'code' => 'CURR',
            'description' => 'Manages all curriculum and academic programs',
            'category' => 'curriculum',
            'level' => 0,
            'principal_id' => $principal->id,
            'total_teachers' => 0,
            'is_active' => true,
        ]);

        // Sub-departments under Curriculum
        $languageDept = Department::create([
            'name' => 'Language Department',
            'code' => 'LANG',
            'description' => 'Language education and instruction',
            'category' => 'curriculum',
            'level' => 1,
            'parent_id' => $curriculumDept->id,
            'principal_id' => $principal->id,
            'total_teachers' => 0,
            'is_active' => true,
        ]);

        $islamicDept = Department::create([
            'name' => 'Islamic Studies',
            'code' => 'ISL',
            'description' => 'Islamic education and studies',
            'category' => 'curriculum',
            'level' => 1,
            'parent_id' => $curriculumDept->id,
            'principal_id' => $principal->id,
            'total_teachers' => 0,
            'is_active' => true,
        ]);

        $stemDept = Department::create([
            'name' => 'STEM & Social Sciences',
            'code' => 'STEM',
            'description' => 'Science, Technology, Engineering, Mathematics and Social Sciences',
            'category' => 'curriculum',
            'level' => 1,
            'parent_id' => $curriculumDept->id,
            'principal_id' => $principal->id,
            'total_teachers' => 0,
            'is_active' => true,
        ]);

        // 2. Student Affairs Department
        $studentAffairsDept = Department::create([
            'name' => 'Student Affairs',
            'code' => 'SA',
            'description' => 'Student welfare, counseling, and support services',
            'category' => 'student_affairs',
            'level' => 0,
            'principal_id' => $principal->id,
            'total_teachers' => 0,
            'is_active' => true,
        ]);

        // 3. Co-curriculum & Events Department
        $coCurriculumDept = Department::create([
            'name' => 'Co-curriculum & Events',
            'code' => 'CCE',
            'description' => 'Extra-curricular activities and school events management',
            'category' => 'co_curriculum',
            'level' => 0,
            'principal_id' => $principal->id,
            'total_teachers' => 0,
            'is_active' => true,
        ]);

        // Create HR Admin user
        $hrUser = User::create([
            'name' => 'HR Administrator',
            'email' => 'hr@ksis.edu.kw',
            'password' => Hash::make('password123'),
            'role' => 'hr_admin',
        ]);

        HrAdmin::create([
            'user_id' => $hrUser->id,
            'employee_id' => 'HR001',
            'full_name' => 'HR Administrator',
            'phone' => '+965-12345678',
            'date_appointed' => now()->subYears(2),
            'position' => 'HR Administrator',
            'is_active' => true,
        ]);


        // Create Teacher users with departments from hierarchy
        $teacher1User = User::create([
            'name' => 'Sarah Teacher',
            'email' => 'sarah.teacher@ksis.edu.kw',
            'password' => Hash::make('password123'),
            'role' => 'teacher',
        ]);

        Teacher::create([
            'user_id' => $teacher1User->id,
            'employee_id' => 'T001',
            'full_name' => 'Sarah Teacher',
            'phone' => '+965-12345680',
            'department_id' => $languageDept->id, // Assigned to Language sub-department
            'date_joined' => now()->subYear(),
            'specialization' => 'English Language Arts',
            'qualifications' => 'BA English, MSc Education',
            'is_active' => true,
        ]);

        $teacher2User = User::create([
            'name' => 'Ahmed Teacher',
            'email' => 'ahmed.teacher@ksis.edu.kw',
            'password' => Hash::make('password123'),
            'role' => 'teacher',
        ]);

        Teacher::create([
            'user_id' => $teacher2User->id,
            'employee_id' => 'T002',
            'full_name' => 'Ahmed Teacher',
            'phone' => '+965-12345681',
            'department_id' => $stemDept->id, // Assigned to STEM sub-department
            'date_joined' => now()->subMonths(8),
            'specialization' => 'Physics and Chemistry',
            'qualifications' => 'BSc Physics, Teaching Certificate',
            'is_active' => true,
        ]);

        // Update department teacher counts
        $languageDept->update(['total_teachers' => 1]);
        $stemDept->update(['total_teachers' => 1]);
        $curriculumDept->update(['total_teachers' => 2]); // Total from all sub-departments

        // Seed Configurations
        $this->call(ConfigurationSeeder::class);

        $this->command->info('Database seeded successfully!');
        $this->command->info('=== Login Credentials ===');
        $this->command->info('HR Admin: hr@ksis.edu.kw / password123');
        $this->command->info('Principal: principal@ksis.edu.kw / password123');
        $this->command->info('Teacher 1: sarah.teacher@ksis.edu.kw / password123');
        $this->command->info('Teacher 2: ahmed.teacher@ksis.edu.kw / password123');
        $this->command->info('');
        $this->command->info('=== Departments ===');
        $this->command->info('Main: Curriculum (3 sub-depts), Student Affairs, Co-curriculum & Events');
    }
}
