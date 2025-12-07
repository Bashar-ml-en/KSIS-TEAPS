<?php

namespace App\Services\ReportingService;

use App\Models\AnnualAppraisal;
use App\Models\Department;
use App\Models\Teacher;
use Illuminate\Support\Facades\DB;

class DepartmentPerformanceService
{
    /**
     * Get aggregated performance report for all departments
     */
    public function getDepartmentPerformance(int $year, ?int $principalId = null): array
    {
        $query = Department::with(['teachers']);
        
        if ($principalId) {
            $query->where('principal_id', $principalId);
        }
        
        $departments = $query->where('is_active', true)->get();
        
        $performanceData = [];
        
        foreach ($departments as $department) {
            $stats = $this->calculateDepartmentStats($department, $year);
            
            if ($stats['total_appraisals'] > 0) {
                $performanceData[] = [
                    'department' => [
                        'id' => $department->id,
                        'name' => $department->name,
                        'code' => $department->code,
                        'total_teachers' => $department->total_teachers,
                    ],
                    'statistics' => $stats,
                ];
            }
        }
        
        // Calculate school-wide averages
        $schoolWideStats = $this->calculateSchoolWideStats($year, $principalId);
        
        return [
            'year' => $year,
            'departments' => $performanceData,
            'school_wide' => $schoolWideStats,
            'generated_at' => now()->toIso8601String(),
        ];
    }
    
    /**
     * Calculate statistics for a specific department
     */
    private function calculateDepartmentStats(Department $department, int $year): array
    {
        $teacherIds = $department->teachers()->pluck('id');
        
        $appraisals = AnnualAppraisal::whereIn('teacher_id', $teacherIds)
            ->where('appraisal_year', $year)
            ->whereNotNull('final_weighted_score')
            ->get();
        
        if ($appraisals->isEmpty()) {
            return [
                'total_appraisals' => 0,
                'average_score' => null,
                'rating_distribution' => [],
            ];
        }
        
        $scores = $appraisals->pluck('final_weighted_score');
        
        return [
            'total_appraisals' => $appraisals->count(),
            'average_score' => round($scores->avg(), 2),
            'highest_score' => round($scores->max(), 2),
            'lowest_score' => round($scores->min(), 2),
            'median_score' => round($this->calculateMedian($scores->toArray()), 2),
            'rating_distribution' => $this->getRatingDistribution($scores->toArray()),
            'completion_rate' => $this->getCompletionRate($department, $year),
        ];
    }
    
    /**
     * Calculate school-wide statistics
     */
    private function calculateSchoolWideStats(int $year, ?int $principalId = null): array
    {
        $query = AnnualAppraisal::where('appraisal_year', $year)
            ->whereNotNull('final_weighted_score');
        
        if ($principalId) {
            $query->whereHas('teacher.department', function($q) use ($principalId) {
                $q->where('principal_id', $principalId);
            });
        }
        
        $appraisals = $query->get();
        
        if ($appraisals->isEmpty()) {
            return [
                'total_appraisals' => 0,
                'average_score' => null,
            ];
        }
        
        $scores = $appraisals->pluck('final_weighted_score');
        
        return [
            'total_appraisals' => $appraisals->count(),
            'average_score' => round($scores->avg(), 2),
            'highest_score' => round($scores->max(), 2),
            'lowest_score' => round($scores->min(), 2),
            'rating_distribution' => $this->getRatingDistribution($scores->toArray()),
        ];
    }
    
    /**
     * Get rating distribution based on score ranges
     */
    private function getRatingDistribution(array $scores): array
    {
        $distribution = [
            'excellent' => 0,  // 90-100
            'very_good' => 0,  // 80-89
            'good' => 0,       // 70-79
            'satisfactory' => 0, // 60-69
            'needs_improvement' => 0, // Below 60
        ];
        
        foreach ($scores as $score) {
            if ($score >= 90) {
                $distribution['excellent']++;
            } elseif ($score >= 80) {
                $distribution['very_good']++;
            } elseif ($score >= 70) {
                $distribution['good']++;
            } elseif ($score >= 60) {
                $distribution['satisfactory']++;
            } else {
                $distribution['needs_improvement']++;
            }
        }
        
        return $distribution;
    }
    
    /**
     * Calculate median value
     */
    private function calculateMedian(array $numbers): float
    {
        sort($numbers);
        $count = count($numbers);
        
        if ($count === 0) {
            return 0;
        }
        
        $middle = floor($count / 2);
        
        if ($count % 2 === 0) {
            return ($numbers[$middle - 1] + $numbers[$middle]) / 2;
        }
        
        return $numbers[$middle];
    }
    
    /**
     * Get completion rate for department
     */
    private function getCompletionRate(Department $department, int $year): float
    {
        $totalTeachers = $department->total_teachers;
        
        if ($totalTeachers === 0) {
            return 0;
        }
        
        $completedAppraisals = AnnualAppraisal::whereIn('teacher_id', $department->teachers()->pluck('id'))
            ->where('appraisal_year', $year)
            ->where('status', 'completed')
            ->count();
        
        return round(($completedAppraisals / $totalTeachers) * 100, 2);
    }
    
    /**
     * Compare department performance year-over-year
     */
    public function getYearOverYearComparison(int $departmentId, int $currentYear, int $previousYear): array
    {
        $currentStats = $this->calculateDepartmentStats(
            Department::findOrFail($departmentId),
            $currentYear
        );
        
        $previousStats = $this->calculateDepartmentStats(
            Department::findOrFail($departmentId),
            $previousYear
        );
        
        $scoreDifference = null;
        $percentChange = null;
        
        if ($currentStats['average_score'] && $previousStats['average_score']) {
            $scoreDifference = round($currentStats['average_score'] - $previousStats['average_score'], 2);
            $percentChange = round((($currentStats['average_score'] - $previousStats['average_score']) / $previousStats['average_score']) * 100, 2);
        }
        
        return [
            'current_year' => [
                'year' => $currentYear,
                'statistics' => $currentStats,
            ],
            'previous_year' => [
                'year' => $previousYear,
                'statistics' => $previousStats,
            ],
            'comparison' => [
                'score_difference' => $scoreDifference,
                'percent_change' => $percentChange,
                'trend' => $scoreDifference > 0 ? 'improving' : ($scoreDifference < 0 ? 'declining' : 'stable'),
            ],
        ];
    }
}
