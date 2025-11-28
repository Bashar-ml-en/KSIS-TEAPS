<?php

namespace App\Http\Controllers;

use App\Models\Evaluation;
use Illuminate\Http\Request;

class EvaluationController extends Controller
{
    /**
     * Display a listing of evaluations
     */
    public function index(Request $request)
    {
        $query = Evaluation::with(['teacher', 'principal', 'hrAdmin']);

        // Filter by teacher
        if ($request->has('teacher_id')) {
            $query->where('teacher_id', $request->teacher_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by period
        if ($request->has('evaluation_period')) {
            $query->where('evaluation_period', $request->evaluation_period);
        }

        // Filter by type
        if ($request->has('evaluation_type')) {
            $query->where('evaluation_type', $request->evaluation_type);
        }

        $evaluations = $query->latest()->paginate($request->get('per_page', 15));

        return response()->json($evaluations);
    }

    /**
     * Store a newly created evaluation
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'principal_id' => 'required|exists:principals,id',
            'evaluation_period' => 'required|string|max:50',
            'evaluation_type' => 'required|in:classroom_observation,annual_appraisal,quarterly_review,probation_review',
            'observation_id' => 'nullable|exists:classroom_observations,id',
            'appraisal_id' => 'nullable|exists:annual_appraisals,id',
        ]);

        $evaluation = Evaluation::create(array_merge($validated, [
            'status' => 'in_progress',
        ]));

        return response()->json([
            'message' => 'Evaluation created successfully',
            'evaluation' => $evaluation->load(['teacher', 'principal']),
        ], 201);
    }

    /**
     * Display the specified evaluation
     */
    public function show($id)
    {
        $evaluation = Evaluation::with([
            'teacher',
            'principal',
            'hrAdmin',
            'classroomObservation',
            'annualAppraisal',
            'feedback'
        ])->findOrFail($id);

        return response()->json($evaluation);
    }

    /**
     * Update the specified evaluation
     */
    public function update(Request $request, $id)
    {
        $evaluation = Evaluation::findOrFail($id);

        $validated = $request->validate([
            'core_responsibilities_score' => 'nullable|numeric|min:0|max:100',
            'school_service_score' => 'nullable|numeric|min:0|max:100',
            'mycpe_score' => 'nullable|numeric|min:0|max:100',
            'personality_score' => 'nullable|numeric|min:0|max:100',
        ]);

        // Calculate overall score (weighted)
        if (isset($validated['core_responsibilities_score']) || 
            isset($validated['school_service_score']) || 
            isset($validated['mycpe_score'])) {
            
            $core = $validated['core_responsibilities_score'] ?? $evaluation->core_responsibilities_score ?? 0;
            $service = $validated['school_service_score'] ?? $evaluation->school_service_score ?? 0;
            $cpe = $validated['mycpe_score'] ?? $evaluation->mycpe_score ?? 0;
            
            $validated['overall_score'] = ($core * 0.6) + ($service * 0.2) + ($cpe * 0.2);
        }

        $evaluation->update($validated);

        return response()->json([
            'message' => 'Evaluation updated successfully',
            'evaluation' => $evaluation->load(['teacher', 'principal']),
        ]);
    }

    /**
     * Submit evaluation to HR
     */
    public function submit($id)
    {
        $evaluation = Evaluation::findOrFail($id);

        if ($evaluation->status !== 'in_progress') {
            return response()->json([
                'message' => 'Only in-progress evaluations can be submitted',
            ], 422);
        }

        $evaluation->update([
            'status' => 'submitted_to_hr',
            'principal_submitted_date' => now(),
        ]);

        return response()->json([
            'message' => 'Evaluation submitted to HR successfully',
            'evaluation' => $evaluation,
        ]);
    }

    /**
     * HR review evaluation
     */
    public function review(Request $request, $id)
    {
        $evaluation = Evaluation::findOrFail($id);

        $validated = $request->validate([
            'hr_admin_id' => 'required|exists:hr_admins,id',
            'status' => 'required|in:hr_reviewed,approved,rejected',
        ]);

        $evaluation->update([
            'status' => $validated['status'],
            'hr_admin_id' => $validated['hr_admin_id'],
            'hr_reviewed_date' => now(),
        ]);

        return response()->json([
            'message' => 'Evaluation reviewed successfully',
            'evaluation' => $evaluation->load(['teacher', 'principal', 'hrAdmin']),
        ]);
    }
}
