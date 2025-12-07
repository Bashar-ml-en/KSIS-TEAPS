<?php

namespace App\Services\EvidenceService;

use App\Models\MycpeRecord;
use App\Models\Teacher;

class CPEComplianceChecker
{
    const MINIMUM_CPE_REQUIRED = 40;

    /**
     * Check if teacher meets CPE compliance for a given year
     */
    public function checkCompliance(int $teacherId, int $year): array
    {
        $totalCPE = MycpeRecord::where('teacher_id', $teacherId)
            ->where('status', 'approved')
            ->whereYear('date_attended', $year)
            ->sum('cpe_points');

        $isCompliant = $totalCPE >= self::MINIMUM_CPE_REQUIRED;
        $deficit = $isCompliant ? 0 : self::MINIMUM_CPE_REQUIRED - $totalCPE;

        return [
            'is_compliant' => $isCompliant,
            'total_cpe_points' => $totalCPE,
            'required_cpe_points' => self::MINIMUM_CPE_REQUIRED,
            'deficit' => $deficit,
            'compliance_percentage' => round(($totalCPE / self::MINIMUM_CPE_REQUIRED) * 100, 2),
        ];
    }

    /**
     * Get CPE summary by category/type
     */
    public function getCPESummary(int $teacherId, int $year): array
    {
        $records = MycpeRecord::where('teacher_id', $teacherId)
            ->where('status', 'approved')
            ->whereYear('date_attended', $year)
            ->get();

        $totalPoints = $records->sum('cpe_points');
        $totalHours = $records->sum('duration_hours');
        $recordCount = $records->count();

        return [
            'total_points' => $totalPoints,
            'total_hours' => $totalHours,
            'record_count' => $recordCount,
            'records' => $records->map(function ($record) {
                return [
                    'id' => $record->id,
                    'course_title' => $record->course_title,
                    'date_attended' => $record->date_attended,
                    'duration_hours' => $record->duration_hours,
                    'cpe_points' => $record->cpe_points,
                    'provider' => $record->provider,
                ];
            }),
        ];
    }

    /**
     * Validate CPE compliance before HR approval
     */
    public function validateForApproval(int $teacherId, int $year): bool
    {
        $compliance = $this->checkCompliance($teacherId, $year);
        return $compliance['is_compliant'];
    }
}
