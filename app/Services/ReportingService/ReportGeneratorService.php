<?php

namespace App\Services\ReportingService;

use App\Models\AnnualAppraisal;
use App\Models\Department;
use App\Models\Teacher;
use Illuminate\Support\Facades\DB;

class ReportGeneratorService
{
    /**
     * Generate comprehensive report for a single teacher
     */
    public function generateTeacherReport(int $teacherId, int $year): array
    {
        $teacher = Teacher::with(['department', 'mycpeRecords' => function($q) use ($year) {
            $q->whereYear('date_attended', $year);
        }])->findOrFail($teacherId);

        $appraisal = AnnualAppraisal::where('teacher_id', $teacherId)
            ->where('appraisal_year', $year)
            ->first();

        return [
            'type' => 'individual',
            'generated_at' => now()->toIso8601String(),
            'year' => $year,
            'teacher' => [
                'id' => $teacher->id,
                'name' => $teacher->full_name,
                'employee_id' => $teacher->employee_id,
                'department' => $teacher->department?->name,
                'position' => $teacher->position,
            ],
            'performance' => $appraisal ? [
                'final_score' => $appraisal->final_weighted_score,
                'rating' => $this->getRating($appraisal->final_weighted_score),
                'breakdown' => [
                    'part_2_score' => $appraisal->part_2_weighted_score,
                    'part_3_score' => $appraisal->part_3_weighted_score,
                    'cpe_score' => $appraisal->cpe_weighted_score,
                ],
                'status' => $appraisal->status,
            ] : null,
            'cpe_summary' => [
                'total_hours' => $teacher->mycpeRecords->where('status', 'approved')->sum('duration_hours'),
                'total_points' => $teacher->mycpeRecords->where('status', 'approved')->sum('cpe_points'),
                'compliant' => $teacher->mycpeRecords->where('status', 'approved')->sum('cpe_points') >= 40,
            ],
        ];
    }

    /**
     * Generate department performance report
     */
    public function generateDepartmentReport(int $departmentId, int $year): array
    {
        $department = Department::with('teachers')->findOrFail($departmentId);
        
        $appraisals = AnnualAppraisal::whereIn('teacher_id', $department->teachers->pluck('id'))
            ->where('appraisal_year', $year)
            ->whereNotNull('final_weighted_score')
            ->get();

        $scores = $appraisals->pluck('final_weighted_score');

        return [
            'type' => 'department',
            'generated_at' => now()->toIso8601String(),
            'year' => $year,
            'department' => [
                'id' => $department->id,
                'name' => $department->name,
                'head_of_department' => $department->head_of_department,
                'total_teachers' => $department->teachers->count(),
            ],
            'statistics' => [
                'average_score' => $scores->avg() ? round($scores->avg(), 2) : 0,
                'highest_score' => $scores->max() ?? 0,
                'lowest_score' => $scores->min() ?? 0,
                'completed_appraisals' => $appraisals->count(),
            ],
            'rating_distribution' => $this->getRatingDistribution($scores->toArray()),
            'teacher_performance_list' => $appraisals->map(function($appraisal) {
                return [
                    'teacher_name' => $appraisal->teacher->full_name,
                    'score' => $appraisal->final_weighted_score,
                    'rating' => $this->getRating($appraisal->final_weighted_score),
                ];
            })->sortByDesc('score')->values(),
        ];
    }

    /**
     * Generate school-wide performance report
     */
    public function generateSchoolReport(int $year): array
    {
        $departments = Department::all();
        $appraisals = AnnualAppraisal::where('appraisal_year', $year)
            ->whereNotNull('final_weighted_score')
            ->get();

        $scores = $appraisals->pluck('final_weighted_score');

        $departmentStats = $departments->map(function($dept) use ($year) {
            $deptAppraisals = AnnualAppraisal::whereIn('teacher_id', $dept->teachers()->pluck('id'))
                ->where('appraisal_year', $year)
                ->whereNotNull('final_weighted_score')
                ->get();
            
            return [
                'name' => $dept->name,
                'average_score' => $deptAppraisals->avg('final_weighted_score') ? round($deptAppraisals->avg('final_weighted_score'), 2) : 0,
                'count' => $deptAppraisals->count(),
            ];
        });

        return [
            'type' => 'school',
            'generated_at' => now()->toIso8601String(),
            'year' => $year,
            'statistics' => [
                'total_teachers' => Teacher::where('is_active', true)->count(),
                'total_appraisals' => $appraisals->count(),
                'average_score' => $scores->avg() ? round($scores->avg(), 2) : 0,
            ],
            'rating_distribution' => $this->getRatingDistribution($scores->toArray()),
            'department_performance' => $departmentStats->sortByDesc('average_score')->values(),
        ];
    }

    /**
     * Convert report data to CSV string
     */
    public function exportToCSV(array $data): string
    {
        $output = fopen('php://temp', 'r+');

        if ($data['type'] === 'individual') {
            fputcsv($output, ['Report Type', 'Individual Teacher Performance']);
            fputcsv($output, ['Year', $data['year']]);
            fputcsv($output, ['Teacher', $data['teacher']['name']]);
            fputcsv($output, ['Department', $data['teacher']['department']]);
            fputcsv($output, []);
            fputcsv($output, ['Metric', 'Value']);
            fputcsv($output, ['Final Score', $data['performance']['final_score'] ?? 'N/A']);
            fputcsv($output, ['Rating', $data['performance']['rating'] ?? 'N/A']);
            fputcsv($output, ['CPE Points', $data['cpe_summary']['total_points']]);
            fputcsv($output, ['CPE Compliant', $data['cpe_summary']['compliant'] ? 'Yes' : 'No']);
        } 
        elseif ($data['type'] === 'department') {
            fputcsv($output, ['Report Type', 'Department Performance']);
            fputcsv($output, ['Department', $data['department']['name']]);
            fputcsv($output, ['Year', $data['year']]);
            fputcsv($output, []);
            fputcsv($output, ['Teacher Name', 'Score', 'Rating']);
            foreach ($data['teacher_performance_list'] as $teacher) {
                fputcsv($output, [$teacher['teacher_name'], $teacher['score'], $teacher['rating']]);
            }
        }
        elseif ($data['type'] === 'school') {
            fputcsv($output, ['Report Type', 'School-wide Performance']);
            fputcsv($output, ['Year', $data['year']]);
            fputcsv($output, []);
            fputcsv($output, ['Department', 'Average Score', 'Appraisal Count']);
            foreach ($data['department_performance'] as $dept) {
                fputcsv($output, [$dept['name'], $dept['average_score'], $dept['count']]);
            }
        }

        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);

        return $csv;
    }

    private function getRating($score)
    {
        if ($score === null) return 'N/A';
        if ($score >= 90) return 'Excellent';
        if ($score >= 80) return 'Very Good';
        if ($score >= 70) return 'Good';
        if ($score >= 60) return 'Satisfactory';
        return 'Needs Improvement';
    }

    private function getRatingDistribution(array $scores): array
    {
        $distribution = [
            'Excellent' => 0,
            'Very Good' => 0,
            'Good' => 0,
            'Satisfactory' => 0,
            'Needs Improvement' => 0,
        ];

        foreach ($scores as $score) {
            $rating = $this->getRating($score);
            if (isset($distribution[$rating])) {
                $distribution[$rating]++;
            }
        }

        return $distribution;
    }
}
