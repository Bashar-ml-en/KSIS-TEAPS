<?php

namespace App\Http\Controllers;

use App\Models\AnnualAppraisal;
use App\Models\Teacher;
use Illuminate\Http\Request;

class AnnualAppraisalController extends Controller
{
    /**
     * Display a listing of annual appraisals
     */
    public function index(Request $request)
    {
        $query = AnnualAppraisal::with('teacher');

        $user = $request->user();

        // Role-based filtering
        if ($user->role === 'teacher') {
            // Teachers can only see their own appraisals
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
        if ($request->has('appraisal_year')) {
            $query->where('appraisal_year', $request->appraisal_year);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $appraisals = $query->latest('appraisal_year')->paginate($request->get('per_page', 15));

        return response()->json($appraisals);
    }

    /**
     * Store a newly created annual appraisal
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'appraisal_year' => 'required|integer|min:2000|max:2100',
            // Core Responsibilities (60%)
            'teaching_load_lessons_per_week' => 'nullable|integer|min:0',
            'curriculum_content_score' => 'nullable|integer|min:0|max:100',
            'aligned_curriculum_score' => 'nullable|integer|min:0|max:100',
            'student_outcome_score' => 'nullable|integer|min:0|max:100',
            'classroom_management_score' => 'nullable|integer|min:0|max:100',
            'marking_students_work_score' => 'nullable|integer|min:0|max:100',
            // School Service (20%)
            'cocurricular_activities_score' => 'nullable|integer|min:0|max:100',
            'duties_other_tasks_score' => 'nullable|integer|min:0|max:100',
            'event_management_score' => 'nullable|integer|min:0|max:100',
            'other_responsibilities_score' => 'nullable|integer|min:0|max:100',
            'competition_score' => 'nullable|integer|min:0|max:100',
            // Community Service
            'community_quantity_score' => 'nullable|integer|min:0|max:100',
            'community_quality_score' => 'nullable|integer|min:0|max:100',
            // Personality & Work Culture
            'management_skills_score' => 'nullable|integer|min:0|max:100',
            'resilience_score' => 'nullable|integer|min:0|max:100',
            'motivation_score' => 'nullable|integer|min:0|max:100',
            'compassion_score' => 'nullable|integer|min:0|max:100',
            'networking_communication_score' => 'nullable|integer|min:0|max:100',
            'core_values_score' => 'nullable|integer|min:0|max:100',
            'attendance_score' => 'nullable|integer|min:0|max:100',
        ]);

        // Check if appraisal already exists for this teacher and year
        $existing = AnnualAppraisal::where('teacher_id', $validated['teacher_id'])
            ->where('appraisal_year', $validated['appraisal_year'])
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Appraisal already exists for this teacher and year',
                'appraisal' => $existing,
            ], 422);
        }

        $appraisal = AnnualAppraisal::create(array_merge($validated, [
            'status' => 'draft',
        ]));

        return response()->json([
            'message' => 'Annual appraisal created successfully',
            'appraisal' => $appraisal->load('teacher'),
        ], 201);
    }

    /**
     * Display the specified annual appraisal
     */
    public function show($id)
    {
        $appraisal = AnnualAppraisal::with([
            'teacher',
            'evaluations',
        ])->findOrFail($id);

        return response()->json($appraisal);
    }

    /**
     * Update the specified annual appraisal
     */
    public function update(Request $request, $id)
    {
        $appraisal = AnnualAppraisal::findOrFail($id);

        $validated = $request->validate([
            'teaching_load_lessons_per_week' => 'nullable|integer|min:0',
            'curriculum_content_score' => 'nullable|integer|min:0|max:100',
            'aligned_curriculum_score' => 'nullable|integer|min:0|max:100',
            'student_outcome_score' => 'nullable|integer|min:0|max:100',
            'classroom_management_score' => 'nullable|integer|min:0|max:100',
            'marking_students_work_score' => 'nullable|integer|min:0|max:100',
            'cocurricular_activities_score' => 'nullable|integer|min:0|max:100',
            'duties_other_tasks_score' => 'nullable|integer|min:0|max:100',
            'event_management_score' => 'nullable|integer|min:0|max:100',
            'other_responsibilities_score' => 'nullable|integer|min:0|max:100',
            'competition_score' => 'nullable|integer|min:0|max:100',
            'community_quantity_score' => 'nullable|integer|min:0|max:100',
            'community_quality_score' => 'nullable|integer|min:0|max:100',
            'management_skills_score' => 'nullable|integer|min:0|max:100',
            'resilience_score' => 'nullable|integer|min:0|max:100',
            'motivation_score' => 'nullable|integer|min:0|max:100',
            'compassion_score' => 'nullable|integer|min:0|max:100',
            'networking_communication_score' => 'nullable|integer|min:0|max:100',
            'core_values_score' => 'nullable|integer|min:0|max:100',
            'attendance_score' => 'nullable|integer|min:0|max:100',
            'self_strengths' => 'nullable|string',
            'self_areas_for_improvement' => 'nullable|string',
            'self_goals_next_period' => 'nullable|string',
            'principal_overall_comment' => 'nullable|string',
            'principal_career_advancement' => 'nullable|string',
            'hr_overall_comment' => 'nullable|string',
            'hr_career_advancement' => 'nullable|string',
            'status' => 'sometimes|in:draft,teacher_submitted,principal_reviewed,hr_reviewed,completed',
        ]);

        $appraisal->update($validated);

        return response()->json([
            'message' => 'Annual appraisal updated successfully',
            'appraisal' => $appraisal->load('teacher'),
        ]);
    }

    /**
     * Remove the specified annual appraisal
     */
    public function destroy($id)
    {
        $appraisal = AnnualAppraisal::findOrFail($id);
        
        // Only HR can delete appraisals
        $appraisal->delete();

        return response()->json([
            'message' => 'Annual appraisal deleted successfully',
        ]);
    }

    /**
     * Teacher submits self-appraisal
     */
    public function submit(Request $request, $id)
    {
        $appraisal = AnnualAppraisal::findOrFail($id);

        if ($appraisal->status !== 'draft') {
            return response()->json([
                'message' => 'Only draft appraisals can be submitted',
            ], 422);
        }

        $validated = $request->validate([
            'self_strengths' => 'required|string',
            'self_areas_for_improvement' => 'required|string',
            'self_goals_next_period' => 'required|string',
        ]);

        $appraisal->update(array_merge($validated, [
            'status' => 'teacher_submitted',
        ]));

        return response()->json([
            'message' => 'Self-appraisal submitted successfully',
            'appraisal' => $appraisal->load('teacher'),
        ]);
    }

    /**
     * Principal reviews appraisal
     */
    public function principalReview(Request $request, $id)
    {
        $appraisal = AnnualAppraisal::findOrFail($id);

        if ($appraisal->status !== 'teacher_submitted') {
            return response()->json([
                'message' => 'Can only review submitted appraisals',
            ], 422);
        }

        $validated = $request->validate([
            'principal_overall_comment' => 'required|string',
            'principal_career_advancement' => 'nullable|string',
        ]);

        $appraisal->update(array_merge($validated, [
            'status' => 'principal_reviewed',
        ]));

        return response()->json([
            'message' => 'Principal review submitted successfully',
            'appraisal' => $appraisal->load('teacher'),
        ]);
    }

    /**
     * HR reviews and finalizes appraisal
     */
    public function hrReview(Request $request, $id)
    {
        $appraisal = AnnualAppraisal::findOrFail($id);

        if ($appraisal->status !== 'principal_reviewed') {
            return response()->json([
                'message' => 'Can only finalize principal-reviewed appraisals',
            ], 422);
        }

        $validated = $request->validate([
            'hr_overall_comment' => 'required|string',
            'hr_career_advancement' => 'nullable|string',
        ]);

        $appraisal->update(array_merge($validated, [
            'status' => 'completed',
        ]));

        return response()->json([
            'message' => 'HR review submitted and appraisal completed',
            'appraisal' => $appraisal->load('teacher'),
        ]);
    }
}
