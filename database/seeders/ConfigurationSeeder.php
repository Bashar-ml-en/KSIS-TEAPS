<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SystemConfiguration;

class ConfigurationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $configs = [
            'system' => [
                'siteName' => 'Knowledge Sustainability International School (KSIS) - TEAPS',
                'siteUrl' => 'http://localhost:3000',
                'adminEmail' => 'admin@ksis.edu',
                'timezone' => 'Asia/Singapore',
                'language' => 'en',
            ],
            'email' => [
                'smtpHost' => 'smtp.gmail.com',
                'smtpPort' => '587',
                'smtpUser' => '',
                'smtpPassword' => '',
                'fromEmail' => 'noreply@ksis.edu',
                'fromName' => 'KSIS - Knowledge Sustainability International School',
            ],
            'notifications' => [
                'emailNotifications' => true,
                'evaluationReminders' => true,
                'performanceAlerts' => true,
                'systemUpdates' => false,
            ],
            'security' => [
                'sessionTimeout' => '30',
                'maxLoginAttempts' => '5',
                'passwordMinLength' => '8',
                'requireStrongPassword' => true,
                'twoFactorAuth' => false,
            ],
            'performance' => [
                'cacheEnabled' => true,
                'logLevel' => 'info',
                'debugMode' => false,
            ],
            // Add existing defaults from Service as well to be comprehensive
            'appraisal_rubric' => [
                'part_2' => [
                    'curriculum_content_score' => 20,
                    'aligned_curriculum_score' => 10,
                    'student_outcome_score' => 20,
                    'classroom_management_score' => 10,
                    'marking_students_work_score' => 10,
                ],
                'part_3' => [
                    'cocurricular_activities_score' => 15,
                    'duties_other_tasks_score' => 10,
                    'event_management_score' => 10,
                    'other_responsibilities_score' => 10,
                    'competition_score' => 10,
                    'community_quantity_score' => 5,
                    'community_quality_score' => 10,
                ],
            ],
            'five_as_framework' => [
                'attendance' => ['weight' => 20, 'description' => 'Regularity and punctuality'],
                'attitude' => ['weight' => 20, 'description' => 'Professional conduct and mindset'],
                'assignments' => ['weight' => 20, 'description' => 'Timely submission of tasks'],
                'adherence' => ['weight' => 20, 'description' => 'Compliance with policies'],
                'achievement' => ['weight' => 20, 'description' => 'Meeting goals and targets'],
            ]
        ];

        foreach ($configs as $key => $value) {
            // Check if exists to avoid duplicates if run multiple times
            if (!SystemConfiguration::where('key', $key)->where('is_active', true)->exists()) {
                SystemConfiguration::create([
                    'key' => $key,
                    'value' => $value,
                    'version' => 1,
                    'is_active' => true,
                    'description' => 'Initial seeded configuration',
                ]);
            }
        }
        
        $this->command->info('System configurations seeded successfully.');
    }
}
