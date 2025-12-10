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
            ['name' => 'Language', 'code' => 'LANG', 'description' => 'Language Department'],
            ['name' => 'STEM & Social Sciences', 'code' => 'STEM_SS', 'description' => 'STEM and Social Sciences Department'],
            ['name' => 'Islamic Studies', 'code' => 'ISLAMIC', 'description' => 'Islamic Studies Department'],
            ['name' => 'Student Affairs', 'code' => 'STUDENT', 'description' => 'Student Affairs Department'],
            ['name' => 'Co-curriculum & event', 'code' => 'CO_CURR', 'description' => 'Co-curriculum and Events Department'],
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
