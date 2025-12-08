<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            ['name' => 'Mathematics', 'code' => 'MATH', 'description' => 'Mathematics Department'],
            ['name' => 'Science', 'code' => 'SCI', 'description' => 'Science Department'],
            ['name' => 'English', 'code' => 'ENG', 'description' => 'English Department'],
            ['name' => 'Information Technology', 'code' => 'IT', 'description' => 'IT Department'],
            ['name' => 'Machine Learning', 'code' => 'ML', 'description' => 'Machine Learning Department'],
            ['name' => 'Software Engineering', 'code' => 'SE', 'description' => 'Software Engineering Department'],
            ['name' => 'History', 'code' => 'HIST', 'description' => 'History Department'],
            ['name' => 'Physical Education', 'code' => 'PE', 'description' => 'Physical Education Department'],
            ['name' => 'Art & Design', 'code' => 'ART', 'description' => 'Art & Design Department'],
            ['name' => 'Music', 'code' => 'MUS', 'description' => 'Music Department'],
        ];

        foreach ($departments as $dept) {
            Department::firstOrCreate(
                ['code' => $dept['code']],
                $dept
            );
        }
        
        $this->command->info('Departments seeded successfully!');
    }
}
