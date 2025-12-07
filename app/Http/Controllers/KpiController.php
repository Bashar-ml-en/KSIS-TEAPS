<?php

namespace App\Http\Controllers;

use App\Models\Kpi;
use Illuminate\Http\Request;

class KpiController extends Controller
{
    /**
     * Display a listing of KPIs
     */
    public function index(Request $request)
    {
        $query = Kpi::with('teacher');

        // Filter by teacher
        if ($request->has('teacher_id')) {
            $query->where('teacher_id', $request->teacher_id);
        }

        // Filter by category
        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $kpis = $query->paginate($request->get('per_page', 15));

        return response()->json($kpis);
    }

    /**
     * Store a newly created KPI
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'nullable|exists:teachers,id',
            'kpi_title' => 'required|string|max:255',
            'kpi_description' => 'required|string',
            'category' => 'required|in:Teaching Load,Curriculum Content,Student Outcome,Classroom Management,Co-curricular,School Service,Community Service,Professional Development,Custom',
            'target_value' => 'nullable|string',
            'current_value' => 'nullable|string',
            'measurement_criteria' => 'nullable|string',
            'weight' => 'sometimes|integer|min:1|max:10',
            'type' => 'required|in:institutional,custom',
            'start_date' => 'nullable|date',
            'target_date' => 'nullable|date|after_or_equal:start_date',
            'notes' => 'nullable|string',
        ]);

        $kpi = Kpi::create(array_merge($validated, [
            'progress_percentage' => 0,
            'status' => 'active',
        ]));

        return response()->json([
            'message' => 'KPI created successfully',
            'kpi' => $kpi->load('teacher'),
        ], 201);
    }

    /**
     * Display the specified KPI
     */
    public function show($id)
    {
        $kpi = Kpi::with('teacher')->findOrFail($id);

        return response()->json($kpi);
    }

    /**
     * Update the specified KPI
     */
    public function update(Request $request, $id)
    {
        $kpi = Kpi::findOrFail($id);

        $validated = $request->validate([
            'kpi_title' => 'sometimes|string|max:255',
            'kpi_description' => 'sometimes|string',
            'category' => 'sometimes|in:Teaching Load,Curriculum Content,Student Outcome,Classroom Management,Co-curricular,School Service,Community Service,Professional Development,Custom',
            'target_value' => 'nullable|string',
            'current_value' => 'nullable|string',
            'progress_percentage' => 'sometimes|integer|min:0|max:100',
            'measurement_criteria' => 'nullable|string',
            'weight' => 'sometimes|integer|min:1|max:10',
            'status' => 'sometimes|in:active,completed,cancelled',
            'target_date' => 'nullable|date',
            'completion_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $kpi->update($validated);

        return response()->json([
            'message' => 'KPI updated successfully',
            'kpi' => $kpi->load('teacher'),
        ]);
    }

    /**
     * Remove the specified KPI
     */
    public function destroy($id)
    {
        $kpi = Kpi::findOrFail($id);
        $kpi->delete();

        return response()->json([
            'message' => 'KPI deleted successfully',
        ]);
    }

    /**
     * Update KPI progress
     */
    public function updateProgress(Request $request, $id)
    {
        $kpi = Kpi::findOrFail($id);

        $validated = $request->validate([
            'current_value' => 'required|string',
            'progress_percentage' => 'required|integer|min:0|max:100',
            'notes' => 'nullable|string',
        ]);

        $kpi->update($validated);

        // Auto-complete if 100%
        if ($validated['progress_percentage'] >= 100) {
            $kpi->update([
                'status' => 'completed',
                'completion_date' => now(),
            ]);
        }

        return response()->json([
            'message' => 'KPI progress updated successfully',
            'kpi' => $kpi->load('teacher'),
        ]);
    }
}
