<?php

namespace App\Services\ScoringService;

use App\Models\AnnualAppraisal;
use App\Models\MycpeRecord;
use Exception;

class WeightedScoreCalculator
{
    /**
     * Calculate final weighted score using 60:20:20 formula
     * Part 2: Core Responsibilities (60%)
     * Part 3: School/Community Service (20%)
     * CPE Score (20%)
     */
    public function calculateFinalScore(AnnualAppraisal $appraisal): array
    {
        // Part 2: Core Responsibilities (60%)
        $part2Score = $this->calculatePart2Score($appraisal);
        
        // Part 3: School/Community Service (20%)
        $part3Score = $this->calculatePart3Score($appraisal);
        
        // CPE Score (20%)
        $cpeScore = $this->calculateCPEScore($appraisal->teacher_id, $appraisal->appraisal_year);
        
        // Weighted formula
        $finalScore = ($part2Score * 0.60) + ($part3Score * 0.20) + ($cpeScore * 0.20);
        
        return [
            'part_2_raw_score' => round($part2Score, 2),
            'part_3_raw_score' => round($part3Score, 2),
            'cpe_raw_score' => round($cpeScore, 2),
            'final_weighted_score' => round($finalScore, 2),
            'breakdown' => [
                'part_2_contribution' => round($part2Score * 0.60, 2),
                'part_3_contribution' => round($part3Score * 0.20, 2),
                'cpe_contribution' => round($cpeScore * 0.20, 2),
            ],
            'calculated_at' => now()->toDateTimeString()
        ];
    }

    /**
     * Calculate Part 2: Core Responsibilities Score
     * Normalized to 100 points
     */
    private function calculatePart2Score(AnnualAppraisal $appraisal): float
    {
        $rubric = $this->getDefaultRubric();
        
        $totalScore = 0;
        $maxScore = 0;
        
        $criteria = [
            'curriculum_content_score' => ['max' => 20],
            'aligned_curriculum_score' => ['max' => 10],
            'student_outcome_score' => ['max' => 20],
            'classroom_management_score' => ['max' => 10],
            'marking_students_work_score' => ['max' => 10],
        ];
        
        foreach ($criteria as $field => $config) {
            $score = $appraisal->$field ?? 0;
            $max = $config['max'];
            
            // Validate against rubric max
            if ($score > $max) {
                throw new Exception("Score for {$field} ({$score}) exceeds maximum of {$max}");
            }
            
            $totalScore += $score;
            $maxScore += $max;
        }
        
        // Add teaching load score (lessons per week contributes to part 2)
        $teachingLoadScore = $this->calculateTeachingLoadScore($appraisal->teaching_load_lessons_per_week);
        $totalScore += $teachingLoadScore;
        $maxScore += 30; // Max 30 points for teaching load
        
        // Normalize to 100
        return $maxScore > 0 ? ($totalScore / $maxScore) * 100 : 0;
    }

    /**
     * Calculate Part 3: School/Community Service Score
     * Normalized to 100 points
     */
    private function calculatePart3Score(AnnualAppraisal $appraisal): float
    {
        $totalScore = 0;
        $maxScore = 0;
        
        $criteria = [
            'cocurricular_activities_score' => ['max' => 15],
            'duties_other_tasks_score' => ['max' => 10],
            'event_management_score' => ['max' => 10],
            'other_responsibilities_score' => ['max' => 10],
            'competition_score' => ['max' => 10],
            'community_quantity_score' => ['max' => 5],
            'community_quality_score' => ['max' => 10],
        ];
        
        foreach ($criteria as $field => $config) {
            $score = $appraisal->$field ?? 0;
            $max = $config['max'];
            
            // Validate against rubric max
            if ($score > $max) {
                throw new Exception("Score for {$field} ({$score}) exceeds maximum of {$max}");
            }
            
            $totalScore += $score;
            $maxScore += $max;
        }
        
        // Normalize to 100
        return $maxScore > 0 ? ($totalScore / $maxScore) * 100 : 0;
    }

    /**
     * Calculate CPE Score based on total CPE points
     * Normalized to 100 points
     */
    private function calculateCPEScore(int $teacherId, int $year): float
    {
        $totalCPE = MycpeRecord::where('teacher_id', $teacherId)
            ->where('status', 'approved')
            ->whereYear('date_attended', $year)
            ->sum('cpe_points');
        
        $minRequired = 40; // Minimum CPE points required
        $maxPossible = 100; // Maximum for scaling
        
        // Score out of 100, capped at 100
        // If teacher has >= minRequired, they get 100%
        // Progressive scoring: 40 points = 100%, 20 points = 50%, etc.
        return min(($totalCPE / $minRequired) * 100, 100);
    }

    /**
     * Calculate teaching load contribution score
     * Based on lessons per week
     */
    private function calculateTeachingLoadScore(int $lessonsPerWeek): float
    {
        // Rubric: 
        // 20+ lessons = 30 points (full load)
        // 15-19 lessons = 25 points
        // 10-14 lessons = 20 points
        // 5-9 lessons = 15 points
        // < 5 lessons = 10 points
        
        if ($lessonsPerWeek >= 20) {
            return 30;
        } elseif ($lessonsPerWeek >= 15) {
            return 25;
        } elseif ($lessonsPerWeek >= 10) {
            return 20;
        } elseif ($lessonsPerWeek >= 5) {
            return 15;
        } else {
            return 10;
        }
    }

    /**
     * Get default rubric configuration
     * TODO: Move to ConfigurationService when implemented
     */
    private function getDefaultRubric(): array
    {
        return [
            'part_2' => [
                'curriculum_content' => ['max' => 20],
                'aligned_curriculum' => ['max' => 10],
                'student_outcome' => ['max' => 20],
                'classroom_management' => ['max' => 10],
                'marking_students_work' => ['max' => 10],
                'teaching_load' => ['max' => 30],
            ],
            'part_3' => [
                'cocurricular_activities' => ['max' => 15],
                'duties_other_tasks' => ['max' => 10],
                'event_management' => ['max' => 10],
                'other_responsibilities' => ['max' => 10],
                'competition' => ['max' => 10],
                'community_quantity' => ['max' => 5],
                'community_quality' => ['max' => 10],
            ],
            'cpe' => [
                'min_required' => 40,
                'max_possible' => 100,
            ]
        ];
    }

    /**
     * Validate all scores against rubric before calculation
     */
    public function validateScores(AnnualAppraisal $appraisal): array
    {
        $errors = [];
        $rubric = $this->getDefaultRubric();
        
        // Validate Part 2 scores
        foreach ($rubric['part_2'] as $key => $config) {
            $field = $key . '_score';
            if ($field === 'teaching_load_score') {
                continue; // Teaching load uses different field
            }
            
            $score = $appraisal->$field ?? 0;
            if ($score > $config['max']) {
                $errors[] = "Score for {$field} ({$score}) exceeds maximum of {$config['max']}";
            }
        }
        
        // Validate Part 3 scores
        foreach ($rubric['part_3'] as $key => $config) {
            $field = $key . '_score';
            $score = $appraisal->$field ?? 0;
            if ($score > $config['max']) {
                $errors[] = "Score for {$field} ({$score}) exceeds maximum of {$config['max']}";
            }
        }
        
        return $errors;
    }
}
