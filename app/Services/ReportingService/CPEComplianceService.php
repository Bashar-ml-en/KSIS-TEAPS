<?php

namespace App\Services\ReportingService;

use App\Models\MycpeRecord;
use App\Models\Teacher;
use App\Models\Department;
use Illuminate\Support\Collection;

class CPEComplianceService
{
    const MINIMUM_CPE_HOURS = 40;
    
    /**
     * Get bulk CPE compliance report for all teachers
     */
    public function getBulkComplianceReport(int $year, ?int $departmentId = null, ?int $principalId = null): array
    {
        $query = Teacher::with(['department', 'mycpeRecords' => function($q) use ($year) {
            $q->where('status', 'approved')
              ->whereYear('date_attended', $year);
        }]);
        
        if ($departmentId) {
            $query->where('department_id', $departmentId);
        }
        
        if ($principalId) {
            $query->whereHas('department', function($q) use ($principalId) {
                $q->where('principal_id', $principalId);
            });
        }
        
        $query->where('is_active', true);
        
        $teachers = $query->get();
        
        $compliantTeachers = [];
        $nonCompliantTeachers = [];
        $totalCPEHours = 0;
        
        foreach ($teachers as $teacher) {
            $cpeHours = $teacher->mycpeRecords->sum('cpe_points');
            $totalCPEHours += $cpeHours;
            
            $teacherData = [
                'id' => $teacher->id,
                'employee_id' => $teacher->employee_id,
                'full_name' => $teacher->full_name,
                'department' => $teacher->department?->name,
                'cpe_hours' => $cpeHours,
                'completion_percentage' => round(($cpeHours / self::MINIMUM_CPE_HOURS) * 100, 2),
                'status' => $cpeHours >= self::MINIMUM_CPE_HOURS ? 'compliant' : 'non_compliant',
                'shortfall' => $cpeHours < self::MINIMUM_CPE_HOURS ? self::MINIMUM_CPE_HOURS - $cpeHours : 0,
            ];
            
            if ($cpeHours >= self::MINIMUM_CPE_HOURS) {
                $compliantTeachers[] = $teacherData;
            } else {
                $nonCompliantTeachers[] = $teacherData;
            }
        }
        
        return [
            'year' => $year,
            'summary' => [
                'total_teachers' => $teachers->count(),
                'compliant_count' => count($compliantTeachers),
                'non_compliant_count' => count($nonCompliantTeachers),
                'compliance_rate' => $teachers->count() > 0 
                    ? round((count($compliantTeachers) / $teachers->count()) * 100, 2)
                    : 0,
                'average_cpe_hours' => $teachers->count() > 0
                    ? round($totalCPEHours / $teachers->count(), 2)
                    : 0,
                'minimum_required_hours' => self::MINIMUM_CPE_HOURS,
            ],
            'compliant_teachers' => $compliantTeachers,
            'non_compliant_teachers' => $nonCompliantTeachers,
            'generated_at' => now()->toIso8601String(),
        ];
    }
    
    /**
     * Get CPE compliance by department
     */
    public function getComplianceByDepartment(int $year, ?int $principalId = null): array
    {
        $query = Department::with(['teachers.mycpeRecords' => function($q) use ($year) {
            $q->where('status', 'approved')
              ->whereYear('date_attended', $year);
        }]);
        
        if ($principalId) {
            $query->where('principal_id', $principalId);
        }
        
        $departments = $query->where('is_active', true)->get();
        
        $departmentData = [];
        
        foreach ($departments as $department) {
            $teachers = $department->teachers()->where('is_active', true)->get();
            
            if ($teachers->isEmpty()) {
                continue;
            }
            
            $compliantCount = 0;
            $totalCPEHours = 0;
            
            foreach ($teachers as $teacher) {
                $cpeHours = $teacher->mycpeRecords->sum('cpe_points');
                $totalCPEHours += $cpeHours;
                
                if ($cpeHours >= self::MINIMUM_CPE_HOURS) {
                    $compliantCount++;
                }
            }
            
            $departmentData[] = [
                'department' => [
                    'id' => $department->id,
                    'name' => $department->name,
                    'code' => $department->code,
                ],
                'total_teachers' => $teachers->count(),
                'compliant_count' => $compliantCount,
                'non_compliant_count' => $teachers->count() - $compliantCount,
                'compliance_rate' => round(($compliantCount / $teachers->count()) * 100, 2),
                'average_cpe_hours' => round($totalCPEHours / $teachers->count(), 2),
            ];
        }
        
        return [
            'year' => $year,
            'departments' => $departmentData,
            'generated_at' => now()->toIso8601String(),
        ];
    }
    
    /**
     * Get individual teacher CPE details
     */
    public function getTeacherCPEDetails(int $teacherId, int $year): array
    {
        $teacher = Teacher::with(['mycpeRecords' => function($q) use ($year) {
            $q->whereYear('date_attended', $year)
              ->orderBy('date_attended', 'desc');
        }])->findOrFail($teacherId);
        
        $approvedRecords = $teacher->mycpeRecords->where('status', 'approved');
        $pendingRecords = $teacher->mycpeRecords->where('status', 'pending');
        
        $totalApprovedHours = $approvedRecords->sum('cpe_points');
        $totalPendingHours = $pendingRecords->sum('cpe_points');
        
        return [
            'teacher' => [
                'id' => $teacher->id,
                'employee_id' => $teacher->employee_id,
                'full_name' => $teacher->full_name,
                'department' => $teacher->department?->name,
            ],
            'year' => $year,
            'cpe_summary' => [
                'total_approved_hours' => $totalApprovedHours,
                'total_pending_hours' => $totalPendingHours,
                'potential_total' => $totalApprovedHours + $totalPendingHours,
                'minimum_required' => self::MINIMUM_CPE_HOURS,
                'compliance_status' => $totalApprovedHours >= self::MINIMUM_CPE_HOURS ? 'compliant' : 'non_compliant',
                'hours_needed' => max(0, self::MINIMUM_CPE_HOURS - $totalApprovedHours),
            ],
            'records' => [
                'approved' => $approvedRecords->values(),
                'pending' => $pendingRecords->values(),
            ],
        ];
    }
}
