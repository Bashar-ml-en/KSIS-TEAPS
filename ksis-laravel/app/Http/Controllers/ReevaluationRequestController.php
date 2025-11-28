<?php

namespace App\Http\Controllers;

use App\Models\ReevaluationRequest;
use App\Models\Teacher;
use Illuminate\Http\Request;

class ReevaluationRequestController extends Controller
{
    /**
     * Display a listing of re-evaluation requests
     */
    public function index(Request $request)
    {
        $query = ReevaluationRequest::with(['teacher', 'evaluation', 'principal']);

        $user = $request->user();

        // Role-based filtering
        if ($user->role === 'teacher') {
            // Teachers can only see their own requests
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

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by evaluation
        if ($request->has('evaluation_id')) {
            $query->where('evaluation_id', $request->evaluation_id);
        }

        $requests = $query->latest()->paginate($request->get('per_page', 15));

        return response()->json($requests);
    }

    /**
     * Store a newly created re-evaluation request
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'evaluation_id' => 'required|exists:evaluations,id',
            'principal_id' => 'nullable|exists:principals,id',
            'reason' => 'required|string',
            'supporting_evidence' => 'nullable|string',
        ]);

        // Check if there's already a pending request for this evaluation
        $existing = ReevaluationRequest::where('evaluation_id', $validated['evaluation_id'])
            ->where('status', 'pending')
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'A pending re-evaluation request already exists for this evaluation',
                'request' => $existing,
            ], 422);
        }

        $reevalRequest = ReevaluationRequest::create(array_merge($validated, [
            'status' => 'draft',
        ]));

        return response()->json([
            'message' => 'Re-evaluation request created successfully',
            'request' => $reevalRequest->load(['teacher', 'evaluation']),
        ], 201);
    }

    /**
     * Display the specified re-evaluation request
     */
    public function show($id)
    {
        $reevalRequest = ReevaluationRequest::with([
            'teacher',
            'evaluation',
            'principal',
        ])->findOrFail($id);

        return response()->json($reevalRequest);
    }

    /**
     * Update the specified re-evaluation request
     */
    public function update(Request $request, $id)
    {
        $reevalRequest = ReevaluationRequest::findOrFail($id);

        // Only allow updates if in draft
        if ($reevalRequest->status !== 'draft') {
            return response()->json([
                'message' => 'Only draft requests can be updated',
            ], 422);
        }

        $validated = $request->validate([
            'reason' => 'sometimes|string',
            'supporting_evidence' => 'nullable|string',
        ]);

        $reevalRequest->update($validated);

        return response()->json([
            'message' => 'Re-evaluation request updated successfully',
            'request' => $reevalRequest->load(['teacher', 'evaluation']),
        ]);
    }

    /**
     * Remove the specified re-evaluation request
     */
    public function destroy($id)
    {
        $reevalRequest = ReevaluationRequest::findOrFail($id);
        
        // Only allow deletion if draft or teacher cancels pending
        if (!in_array($reevalRequest->status, ['draft', 'pending'])) {
            return response()->json([
                'message' => 'Can only delete draft or pending requests',
            ], 422);
        }

        $reevalRequest->delete();

        return response()->json([
            'message' => 'Re-evaluation request cancelled successfully',
        ]);
    }

    /**
     * Submit re-evaluation request
     */
    public function submit($id)
    {
        $reevalRequest = ReevaluationRequest::findOrFail($id);

        if ($reevalRequest->status !== 'draft') {
            return response()->json([
                'message' => 'Only draft requests can be submitted',
            ], 422);
        }

        $reevalRequest->update([
            'status' => 'pending',
            'submitted_date' => now(),
        ]);

        return response()->json([
            'message' => 'Re-evaluation request submitted successfully',
            'request' => $reevalRequest->load(['teacher', 'evaluation']),
        ]);
    }

    /**
     * Review re-evaluation request (approve/reject)
     */
    public function review(Request $request, $id)
    {
        $reevalRequest = ReevaluationRequest::findOrFail($id);

        if ($reevalRequest->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending requests can be reviewed',
            ], 422);
        }

        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'review_comment' => 'nullable|string',
            'principal_id' => 'required|exists:principals,id',
        ]);

        $reevalRequest->update([
            'status' => $validated['status'],
            'review_comment' => $validated['review_comment'] ?? null,
            'principal_id' => $validated['principal_id'],
            'reviewed_date' => now(),
        ]);

        return response()->json([
            'message' => 'Re-evaluation request ' . $validated['status'] . ' successfully',
            'request' => $reevalRequest->load(['teacher', 'evaluation', 'principal']),
        ]);
    }
}
