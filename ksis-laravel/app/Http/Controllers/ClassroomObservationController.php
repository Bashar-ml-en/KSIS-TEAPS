<?php

namespace App\Http\Controllers;

use App\Models\ClassroomObservation;
use App\Models\Teacher;
use App\Models\Principal;
use Illuminate\Http\Request;

class ClassroomObservationController extends Controller
{
    /**
     * Display a listing of classroom observations
     */
    public function index(Request $request)
    {
        $query = ClassroomObservation::with(['teacher', 'principal']);

        $user = $request->user();

        // Role-based filtering
        if ($user->role === 'teacher') {
            // Teachers can only see their own observations
            $teacher = Teacher::where('user_id', $user->id)->first();
            if ($teacher) {
                $query->where('teacher_id', $teacher->id);
            } else {
                return response()->json([]);
            }
        } elseif ($user->role === 'principal') {
            // Principals see observations they created
            $principal = Principal::where('user_id', $user->id)->first();
            if ($principal && $request->has('my_observations')) {
                $query->where('principal_id', $principal->id);
            }
        }

        // Filter by teacher
        if ($request->has('teacher_id')) {
            $query->where('teacher_id', $request->teacher_id);
        }

        // Filter by principal
        if ($request->has('principal_id')) {
            $query->where('principal_id', $request->principal_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('date_from')) {
            $query->where('observation_date', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->where('observation_date', '<=', $request->date_to);
        }

        $observations = $query->latest('observation_date')->paginate($request->get('per_page', 15));

        return response()->json($observations);
    }

    /**
     * Store a newly created classroom observation
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'principal_id' => 'required|exists:principals,id',
            'observation_date' => 'required|date',
            'subject' => 'required|string|max:255',
            'grade_level' => 'required|string|max:50',
            'lesson_topic' => 'required|string|max:255',
            'introduction_score' => 'nullable|integer|min:0|max:10',
            'content_score' => 'nullable|integer|min:0|max:10',
            'engagement_score' => 'nullable|integer|min:0|max:10',
            'lesson_flow_score' => 'nullable|integer|min:0|max:10',
            'enrichment_tools_score' => 'nullable|integer|min:0|max:10',
            'individual_care_score' => 'nullable|integer|min:0|max:10',
            'assessment_score' => 'nullable|integer|min:0|max:10',
            'classroom_mgmt_score' => 'nullable|integer|min:0|max:10',
            'conclusion_score' => 'nullable|integer|min:0|max:10',
            'observation_notes' => 'nullable|string',
        ]);

        $observation = ClassroomObservation::create(array_merge($validated, [
            'status' => 'draft',
        ]));

        return response()->json([
            'message' => 'Classroom observation created successfully',
            'observation' => $observation->load(['teacher', 'principal']),
        ], 201);
    }

    /**
     * Display the specified classroom observation
     */
    public function show($id)
    {
        $observation = ClassroomObservation::with([
            'teacher',
            'principal',
            'evaluations',
        ])->findOrFail($id);

        return response()->json($observation);
    }

    /**
     * Update the specified classroom observation
     */
    public function update(Request $request, $id)
    {
        $observation = ClassroomObservation::findOrFail($id);

        // Only allow updates if not completed
        if ($observation->status === 'completed') {
            return response()->json([
                'message' => 'Cannot update completed observations',
            ], 422);
        }

        $validated = $request->validate([
            'observation_date' => 'sometimes|date',
            'subject' => 'sometimes|string|max:255',
            'grade_level' => 'sometimes|string|max:50',
            'lesson_topic' => 'sometimes|string|max:255',
            'introduction_score' => 'nullable|integer|min:0|max:10',
            'content_score' => 'nullable|integer|min:0|max:10',
            'engagement_score' => 'nullable|integer|min:0|max:10',
            'lesson_flow_score' => 'nullable|integer|min:0|max:10',
            'enrichment_tools_score' => 'nullable|integer|min:0|max:10',
            'individual_care_score' => 'nullable|integer|min:0|max:10',
            'assessment_score' => 'nullable|integer|min:0|max:10',
            'classroom_mgmt_score' => 'nullable|integer|min:0|max:10',
            'conclusion_score' => 'nullable|integer|min:0|max:10',
            'observation_notes' => 'nullable|string',
            'status' => 'sometimes|in:draft,in_progress,completed',
        ]);

        $observation->update($validated);

        return response()->json([
            'message' => 'Classroom observation updated successfully',
            'observation' => $observation->load(['teacher', 'principal']),
        ]);
    }

    /**
     * Remove the specified classroom observation
     */
    public function destroy($id)
    {
        $observation = ClassroomObservation::findOrFail($id);
        
        // Only allow deletion if in draft
        if ($observation->status !== 'draft') {
            return response()->json([
                'message' => 'Can only delete draft observations',
            ], 422);
        }

        $observation->delete();

        return response()->json([
            'message' => 'Classroom observation deleted successfully',
        ]);
    }

    /**
     * Mark observation as completed
     */
    public function complete($id)
    {
        $observation = ClassroomObservation::findOrFail($id);

        if ($observation->status === 'completed') {
            return response()->json([
                'message' => 'Observation is already completed',
            ], 422);
        }

        $observation->update(['status' => 'completed']);

        return response()->json([
            'message' => 'Classroom observation marked as completed',
            'observation' => $observation->load(['teacher', 'principal']),
        ]);
    }
}
