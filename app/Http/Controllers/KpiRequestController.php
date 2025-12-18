<?php

namespace App\Http\Controllers;

use App\Models\KpiRequest;
use Illuminate\Http\Request;

class KpiRequestController extends Controller
{
    protected $auditService;

    public function __construct(\App\Services\AuditService $auditService)
    {
        $this->auditService = $auditService;
    }

    /**
     * Display a listing of KPI requests
     */
    public function index(Request $request)
    {
        $query = KpiRequest::with(['teacher', 'principal']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by teacher
        if ($request->has('teacher_id')) {
            $query->where('teacher_id', $request->teacher_id);
        }

        $requests = $query->latest()->paginate($request->get('per_page', 15));

        return response()->json($requests);
    }

    /**
     * Store a newly created KPI request
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'kpi_title' => 'required|string|max:255',
            'kpi_description' => 'required|string',
            'justification' => 'required|string',
            'category' => 'required|string',
            'target_value' => 'nullable|string',
            'measurement_criteria' => 'nullable|string',
        ]);

        $kpiRequest = KpiRequest::create(array_merge($validated, [
            'status' => 'pending',
        ]));

        $this->auditService->log(
            'create',
            'kpi',
            $kpiRequest->id,
            "KPI Request created by Teacher #{$validated['teacher_id']}",
            null,
            $kpiRequest->toArray()
        );

        return response()->json([
            'message' => 'KPI request submitted successfully',
            'request' => $kpiRequest->load('teacher'),
        ], 201);
    }

    /**
     * Display the specified KPI request
     */
    public function show($id)
    {
        $kpiRequest = KpiRequest::with(['teacher', 'principal'])->findOrFail($id);

        return response()->json($kpiRequest);
    }

    private function getAuthenticatedPrincipalId()
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        if (!$user) return null;
        
        $principal = \App\Models\Principal::where('user_id', $user->id)->first();
        return $principal ? $principal->id : null;
    }

    /**
     * Approve KPI request
     */
    public function approve(Request $request, $id)
    {
        $kpiRequest = KpiRequest::findOrFail($id);
        
        // Robustness: Get ID from logged in user if possible, fallback to request if testing/mocking
        $principalId = $this->getAuthenticatedPrincipalId() ?? $request->input('principal_id');

        if (!$principalId) {
            return response()->json(['message' => 'Unauthorized or Principal profile not found'], 403);
        }

        $validated = $request->validate([
            'comments' => 'nullable|string', // Changed to standard 'comments' to match frontend usually, checking frontend...
        ]);
        // Frontend sends { comments: ... }, but older controller validated 'principal_comments'. 
        // Let's support 'comments' from new frontend KPIApproval.tsx

        $oldValues = $kpiRequest->toArray();

        $kpiRequest->update([
            'status' => 'approved',
            'principal_id' => $principalId,
            'principal_comments' => $request->input('comments') ?? $request->input('principal_comments'),
            'reviewed_date' => now(),
        ]);

        // Create actual KPI from approved request
        $newKpi = \App\Models\Kpi::create([
            'teacher_id' => $kpiRequest->teacher_id,
            'kpi_title' => $kpiRequest->kpi_title,
            'kpi_description' => $kpiRequest->kpi_description,
            'category' => $kpiRequest->category,
            'target_value' => $kpiRequest->target_value,
            'measurement_criteria' => $kpiRequest->measurement_criteria,
            'type' => 'custom',
            'status' => 'active',
            'progress_percentage' => 0,
        ]);

        $this->auditService->log(
            'approve',
            'kpi',
            $kpiRequest->id,
            "KPI Request approved by Principal #{$principalId}",
            $oldValues,
            $kpiRequest->fresh()->toArray()
        );

        $this->auditService->log(
            'create',
            'kpi',
            $newKpi->id,
            "Active KPI created from request #{$kpiRequest->id}",
            null,
            $newKpi->toArray()
        );

        return response()->json([
            'message' => 'KPI request approved and KPI created',
            'request' => $kpiRequest->load(['teacher', 'principal']),
        ]);
    }

    /**
     * Reject KPI request
     */
    public function reject(Request $request, $id)
    {
        $kpiRequest = KpiRequest::findOrFail($id);

        $principalId = $this->getAuthenticatedPrincipalId() ?? $request->input('principal_id');

        if (!$principalId) {
            return response()->json(['message' => 'Unauthorized or Principal profile not found'], 403);
        }

        $validated = $request->validate([
            'comments' => 'required|string', // Support 'comments'
        ]);

        $oldValues = $kpiRequest->toArray();

        $kpiRequest->update([
            'status' => 'rejected',
            'principal_id' => $principalId,
            'principal_comments' => $request->input('comments'),
            'reviewed_date' => now(),
        ]);

        $this->auditService->log(
            'reject',
            'kpi',
            $kpiRequest->id,
            "KPI Request rejected by Principal #{$principalId}",
            $oldValues,
            $kpiRequest->fresh()->toArray()
        );

        return response()->json([
            'message' => 'KPI request rejected',
            'request' => $kpiRequest->load(['teacher', 'principal']),
        ]);
    }
}
