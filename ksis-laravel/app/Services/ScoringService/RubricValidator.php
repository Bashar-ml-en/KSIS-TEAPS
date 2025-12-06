<?php

namespace App\Services\ScoringService;

use App\Models\AnnualAppraisal;

class RubricValidator
{
    protected $configService;

    public function __construct(\App\Services\ConfigurationService\ConfigurationService $configService)
    {
        $this->configService = $configService;
    }

    /**
     * Validate that all scores are within rubric limits
     */
    public function validate(AnnualAppraisal $appraisal): bool
    {
        $errors = $this->getValidationErrors($appraisal);
        return empty($errors);
    }

    /**
     * Get all validation errors
     */
    public function getValidationErrors(AnnualAppraisal $appraisal): array
    {
        $errors = [];
        $rubric = $this->getRubric();

        // Validate Part 2: Core Responsibilities
        if (isset($rubric['part_2'])) {
            foreach ($rubric['part_2'] as $field => $max) {
                $score = $appraisal->$field ?? null;
                if ($score !== null && $score > $max) {
                    $errors[] = "{$field} score ({$score}) exceeds maximum ({$max})";
                }
                if ($score !== null && $score < 0) {
                    $errors[] = "{$field} score ({$score}) cannot be negative";
                }
            }
        }

        // Validate Part 3: School/Community Service
        if (isset($rubric['part_3'])) {
            foreach ($rubric['part_3'] as $field => $max) {
                $score = $appraisal->$field ?? null;
                if ($score !== null && $score > $max) {
                    $errors[] = "{$field} score ({$score}) exceeds maximum ({$max})";
                }
                if ($score !== null && $score < 0) {
                    $errors[] = "{$field} score ({$score}) cannot be negative";
                }
            }
        }

        // Validate teaching load
        if ($appraisal->teaching_load_lessons_per_week !== null) {
            if ($appraisal->teaching_load_lessons_per_week < 0) {
                $errors[] = "Teaching load cannot be negative";
            }
            if ($appraisal->teaching_load_lessons_per_week > 40) {
                $errors[] = "Teaching load ({$appraisal->teaching_load_lessons_per_week}) exceeds maximum (40)";
            }
        }

        return $errors;
    }

    /**
     * Get rubric configuration from database
     */
    private function getRubric(): array
    {
        return $this->configService->get('appraisal_rubric') ?? [];
    }

    /**
     * Get maximum possible score for a field
     */
    public function getMaxScore(string $field): ?int
    {
        $rubric = $this->getRubric();
        
        if (isset($rubric['part_2'][$field])) {
            return $rubric['part_2'][$field];
        }
        
        if (isset($rubric['part_3'][$field])) {
            return $rubric['part_3'][$field];
        }
        
        return null;
    }
}
