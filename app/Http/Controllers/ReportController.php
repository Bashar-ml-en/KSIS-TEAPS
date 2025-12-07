<?php

namespace App\Http\Controllers;

use App\Services\ReportingService\ReportGeneratorService;
use App\Services\ReportingService\CPEComplianceService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class ReportController extends Controller
{
    protected $reportService;

    public function __construct(ReportGeneratorService $reportService)
    {
        $this->reportService = $reportService;
    }

    /**
     * Get individual teacher report
     */
    public function teacherReport(Request $request, $teacherId)
    {
        $year = $request->get('year', now()->year);
        $report = $this->reportService->generateTeacherReport($teacherId, $year);
        return response()->json($report);
    }

    /**
     * Get department report
     */
    public function departmentReport(Request $request, $departmentId)
    {
        $year = $request->get('year', now()->year);
        $report = $this->reportService->generateDepartmentReport($departmentId, $year);
        return response()->json($report);
    }

    /**
     * Get school-wide report
     */
    public function schoolReport(Request $request)
    {
        $year = $request->get('year', now()->year);
        $report = $this->reportService->generateSchoolReport($year);
        return response()->json($report);
    }

    /**
     * Export report to CSV
     */
    public function export(Request $request)
    {
        $type = $request->get('type');
        $year = $request->get('year', now()->year);
        $id = $request->get('id');

        $data = [];
        $filename = "report_{$year}.csv";

        switch ($type) {
            case 'individual':
                $data = $this->reportService->generateTeacherReport($id, $year);
                $filename = "teacher_report_{$id}_{$year}.csv";
                break;
            case 'department':
                $data = $this->reportService->generateDepartmentReport($id, $year);
                $filename = "department_report_{$id}_{$year}.csv";
                break;
            case 'school':
                $data = $this->reportService->generateSchoolReport($year);
                $filename = "school_report_{$year}.csv";
                break;
            default:
                return response()->json(['message' => 'Invalid report type'], 400);
        }

        $csv = $this->reportService->exportToCSV($data);

        return Response::make($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    /**
     * Training Dashboard (HR Admin)
     */
    public function trainingDashboard(Request $request)
    {
        $year = $request->get('year', now()->year);
        $cpeService = new CPEComplianceService();
        
        // Get school-wide compliance
        $compliance = $cpeService->getBulkComplianceReport($year);
        
        // Get department breakdown
        $deptCompliance = $cpeService->getComplianceByDepartment($year);

        return response()->json([
            'year' => $year,
            'summary' => $compliance['summary'],
            'department_breakdown' => $deptCompliance['departments'],
            'non_compliant_teachers' => $compliance['non_compliant_teachers'],
        ]);
    }
}
