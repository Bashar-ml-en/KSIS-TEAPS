<?php

namespace App\Http\Controllers;

use App\Models\MycpeRecord;
use App\Models\Teacher;
use App\Services\EvidenceService\CPEComplianceChecker;
use Illuminate\Http\Request;

class MycpeRecordController extends Controller
{
    protected $complianceChecker;

    public function __construct()
    {
        $this->complianceChecker = new CPEComplianceChecker();
    }

    /**
     * Display a listing of MyCPE records
     */
    public function index(Request $request)
    {
        $query = MycpeRecord::with('teacher');

        $user = $request->user();

        // Role-based filtering
        if ($user->role === 'teacher') {
            $teacher = Teacher::where('user_id', $user->id)->first();
            if ($teacher) {
                $query->where('teacher_id', $teacher->id);
            } else {
                return response()->json([]);
            }
        }

        // Filter by teacher
        if ($request->has('teacher_id')) {
            $query->where('teacher_id', $request->teacher_id);
        }

        // Filter by year
        if ($request->has('year')) {
            $query->whereYear('date_attended', $request->year);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $records = $query->latest('date_attended')->paginate($request->get('per_page', 15));

        // Add CPE summary if filtering by teacher and year
        if ($request->has('teacher_id') && $request->has('year')) {
            $compliance = $this->complianceChecker->checkCompliance(
                $request->teacher_id,
                $request->year
            );
            
            return response()->json([
                'records' => $records,
                'compliance' => $compliance,
            ]);
        }

        return response()->json($records);
    }

    /**
     * Store a newly created MyCPE record
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'course_title' => 'required|string|max:255',
            'date_attended' => 'required|date',
            'duration_hours' => 'required|numeric|min:0',
            'location' => 'nullable|string|max:255',
            'provider' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'certificate_path' => 'nullable|string',
        ]);

        // CPE points are automatically calculated by the Observer
        // 1 Hour = 1 CPE Point
        
        $record = MycpeRecord::create(array_merge($validated, [
            'status' => 'pending', // Requires approval
        ]));

        return response()->json([
            'message' => 'MyCPE record created successfully',
            'record' => $record->load('teacher'),
            'note' => 'CPE points automatically calculated: ' . $record->cpe_points . ' points',
        ], 201);
    }

    /**
     * Display the specified MyCPE record
     */
    public function show($id)
    {
        $record = MycpeRecord::with('teacher')->findOrFail($id);
        return response()->json($record);
    }

    /**
     * Update the specified MyCPE record
     */
    public function update(Request $request, $id)
    {
        $record = MycpeRecord::findOrFail($id);

        // Can only update if not approved
        if ($record->status === 'approved') {
            return response()->json([
                'message' => 'Cannot update approved CPE records',
            ], 403);
        }

        $validated = $request->validate([
            'course_title' => 'sometimes|string|max:255',
            'date_attended' => 'sometimes|date',
            'duration_hours' => 'sometimes|numeric|min:0',
            'location' => 'nullable|string|max:255',
            'provider' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'certificate_path' => 'nullable|string',
        ]);

        $record->update($validated);

        return response()->json([
            'message' => 'MyCPE record updated successfully',
            'record' => $record->fresh()->load('teacher'),
            'note' => 'CPE points recalculated: ' . $record->cpe_points . ' points',
        ]);
    }

    /**
     * Remove the specified MyCPE record
     */
    public function destroy($id)
    {
        $record = MycpeRecord::findOrFail($id);

        // Can only delete if not approved
        if ($record->status === 'approved') {
            return response()->json([
                'message' => 'Cannot delete approved CPE records',
            ], 403);
        }

        $record->delete();

        return response()->json([
            'message' => 'MyCPE record deleted successfully',
        ]);
    }

    /**
     * Approve a MyCPE record
     */
    public function approve($id)
    {
        $record = MycpeRecord::findOrFail($id);

        if ($record->status === 'approved') {
            return response()->json([
                'message' => 'Record is already approved',
            ], 422);
        }

        $record->update(['status' => 'approved']);

        return response()->json([
            'message' => 'MyCPE record approved successfully',
            'record' => $record->fresh()->load('teacher'),
        ]);
    }

    /**
     * Get CPE compliance summary for a teacher
     */
    public function getCompliance(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'year' => 'required|integer|min:2000|max:2100',
        ]);

        $compliance = $this->complianceChecker->checkCompliance(
            $validated['teacher_id'],
            $validated['year']
        );

        $summary = $this->complianceChecker->getCPESummary(
            $validated['teacher_id'],
            $validated['year']
        );

        return response()->json([
            'compliance' => $compliance,
            'summary' => $summary,
        ]);
    }


    /**
     * Get bulk CPE compliance report
     */
    public function bulkCompliance(Request $request)
    {
        $validated = $request->validate([
            'year' => 'required|integer|min:2000|max:2100',
            'department_id' => 'nullable|exists:departments,id',
        ]);
        
        $principalId = null;
        $user = $request->user();
        
        // If principal, only show their departments
        if ($user->role === 'principal') {
            $principal = \App\Models\Principal::where('user_id', $user->id)->first();
            $principalId = $principal?->id;
        }
        
        $complianceService = new \App\Services\ReportingService\CPEComplianceService();
        $report = $complianceService->getBulkComplianceReport(
            $validated['year'],
            $validated['department_id'] ?? null,
            $principalId
        );
        
        return response()->json($report);
    }
    
    /**
     * Get CPE compliance by department
     */
    public function complianceByDepartment(Request $request)
    {
        $year = $request->get('year', now()->year);
        
        $principalId = null;
        $user = $request->user();
        
        // If principal, only show their departments
        if ($user->role === 'principal') {
            $principal = \App\Models\Principal::where('user_id', $user->id)->first();
            $principalId = $principal?->id;
        }
        
        $complianceService = new \App\Services\ReportingService\CPEComplianceService();
        $report = $complianceService->getComplianceByDepartment($year, $principalId);
        
        return response()->json($report);
    }
    
    /**
     * Get individual teacher CPE details  
     */
    public function teacherCPEDetails(Request $request, $teacherId)
    {
        $year = $request->get('year', now()->year);
        
        $complianceService = new \App\Services\ReportingService\CPEComplianceService();
        $details = $complianceService->getTeacherCPEDetails($teacherId, $year);
        
        return response()->json($details);
    }

}

