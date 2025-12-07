<?php

namespace App\Services\ConfigurationService;

use App\Models\SystemConfiguration;
use Illuminate\Support\Facades\DB;

class ConfigurationService
{
    /**
     * Get the current active configuration for a key
     */
    public function get(string $key)
    {
        $config = SystemConfiguration::where('key', $key)
            ->where('is_active', true)
            ->orderBy('version', 'desc')
            ->first();

        if (!$config) {
            // If not found, try to seed default if it's a known key
            return $this->seedDefault($key);
        }

        return $config->value;
    }

    /**
     * Update configuration (creates a new version)
     */
    public function update(string $key, array $value, ?int $userId = null, ?string $description = null)
    {
        return DB::transaction(function () use ($key, $value, $userId, $description) {
            // Get current active version
            $current = SystemConfiguration::where('key', $key)
                ->where('is_active', true)
                ->orderBy('version', 'desc')
                ->first();

            $newVersion = $current ? $current->version + 1 : 1;

            // Deactivate old version
            if ($current) {
                $current->update(['is_active' => false]);
            }

            // Create new version
            return SystemConfiguration::create([
                'key' => $key,
                'value' => $value,
                'version' => $newVersion,
                'is_active' => true,
                'description' => $description ?? "Updated configuration (v{$newVersion})",
                'created_by' => $userId,
            ]);
        });
    }

    /**
     * Get configuration history
     */
    public function getHistory(string $key)
    {
        return SystemConfiguration::where('key', $key)
            ->with('creator')
            ->orderBy('version', 'desc')
            ->get();
    }

    /**
     * Restore a previous version
     */
    public function restore(string $key, int $version, ?int $userId = null)
    {
        $target = SystemConfiguration::where('key', $key)
            ->where('version', $version)
            ->firstOrFail();

        return $this->update(
            $key, 
            $target->value, 
            $userId, 
            "Restored from version {$version}"
        );
    }

    /**
     * Seed default values for known keys
     */
    private function seedDefault(string $key)
    {
        $defaults = [
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

        if (isset($defaults[$key])) {
            $config = SystemConfiguration::create([
                'key' => $key,
                'value' => $defaults[$key],
                'version' => 1,
                'is_active' => true,
                'description' => 'Initial default configuration',
            ]);
            return $config->value;
        }

        return null;
    }
}
