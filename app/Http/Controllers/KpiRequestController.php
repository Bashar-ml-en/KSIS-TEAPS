<?php

namespace App\Http\Controllers;

use App\Models\KpiRequest;
use Illuminate\Http\Request;

class KpiRequestController extends Controller
{
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

    /**
     * Approve KPI request
     */
    public function approve(Request $request, $id)
    {
        $kpiRequest = KpiRequest::findOrFail($id);

        $validated = $request->validate([
            'principal_id' => 'required|exists:principals,id',
            'principal_comments' => 'nullable|string',
        ]);

        $kpiRequest->update([
            'status' => 'approved',
            'principal_id' => $validated['principal_id'],
            'principal_comments' => $validated['principal_comments'] ?? null,
            'reviewed_date' => now(),
        ]);

        // Create actual KPI from approved request
        \App\Models\Kpi::create([
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

        $validated = $request->validate([
            'principal_id' => 'required|exists:principals,id',
            'principal_comments' => 'required|string',
        ]);

        $kpiRequest->update([
            'status' => 'rejected',
            'principal_id' => $validated['principal_id'],
            'principal_comments' => $validated['principal_comments'],
            'reviewed_date' => now(),
        ]);

        return response()->json([
            'message' => 'KPI request rejected',
            'request' => $kpiRequest->load(['teacher', 'principal']),
        ]);
    }
}
