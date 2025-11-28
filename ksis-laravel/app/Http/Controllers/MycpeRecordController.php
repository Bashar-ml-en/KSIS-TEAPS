<?php

namespace App\Http\Controllers;

use App\Models\MycpeRecord;
use App\Models\Teacher;
use Illuminate\Http\Request;

class MycpeRecordController extends Controller
{
    /**
     * Display a listing of MyCPE records
     */
    public function index(Request $request)
    {
        $query = MycpeRecord::with('teacher');

        $user = $request->user();

        // Role-based filtering
        if ($user->role === 'teacher') {
            // Teachers can only see their own records
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

        // Filter by activity type
        if ($request->has('activity_type')) {
            $query->where('activity_type', $request->activity_type);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by year
        if ($request->has('year')) {
            $query->whereYear('activity_date', $request->year);
        }

        $records = $query->latest('activity_date')->paginate($request->get('per_page', 15));

        return response()->json($records);
    }

    /**
     * Store a newly created MyCPE record
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'activity_type' => 'required|in:Workshop,Conference,Training,Webinar,Course,Publication,Research,Other',
            'activity_title' => 'required|string|max:255',
            'activity_description' => 'nullable|string',
            'activity_date' => 'required|date',
            'duration_hours' => 'nullable|integer|min:0',
            'provider' => 'nullable|string|max:255',
            'certificate_url' => 'nullable|url|max:500',
            'evidence_documents' => 'nullable|array',
        ]);

        $record = MycpeRecord::create(array_merge($validated, [
            'status' => 'pending',
        ]));

        return response()->json([
            'message' => 'MyCPE record created successfully',
            'record' => $record->load('teacher'),
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

        // Only allow updates if not approved
        if ($record->status === 'approved') {
            return response()->json([
                'message' => 'Cannot update approved records',
            ], 422);
        }

        $validated = $request->validate([
            'activity_type' => 'sometimes|in:Workshop,Conference,Training,Webinar,Course,Publication,Research,Other',
            'activity_title' => 'sometimes|string|max:255',
            'activity_description' => 'nullable|string',
            'activity_date' => 'sometimes|date',
            'duration_hours' => 'nullable|integer|min:0',
            'provider' => 'nullable|string|max:255',
            'certificate_url' => 'nullable|url|max:500',
            'evidence_documents' => 'nullable|array',
        ]);

        $record->update($validated);

        return response()->json([
            'message' => 'MyCPE record updated successfully',
            'record' => $record->load('teacher'),
        ]);
    }

    /**
     * Remove the specified MyCPE record
     */
    public function destroy($id)
    {
        $record = MycpeRecord::findOrFail($id);
        
        // Only allow deletion if pending
        if ($record->status !== 'pending') {
            return response()->json([
                'message' => 'Can only delete pending records',
            ], 422);
        }

        $record->delete();

        return response()->json([
            'message' => 'MyCPE record deleted successfully',
        ]);
    }

    /**
     * Approve or reject MyCPE record
     */
    public function approve(Request $request, $id)
    {
        $record = MycpeRecord::findOrFail($id);

        if ($record->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending records can be approved or rejected',
            ], 422);
        }

        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'approval_notes' => 'nullable|string',
        ]);

        $record->update([
            'status' => $validated['status'],
            'approval_notes' => $validated['approval_notes'] ?? null,
            'approved_date' => $validated['status'] === 'approved' ? now() : null,
        ]);

        return response()->json([
            'message' => 'MyCPE record ' . $validated['status'] . ' successfully',
            'record' => $record->load('teacher'),
        ]);
    }
}
