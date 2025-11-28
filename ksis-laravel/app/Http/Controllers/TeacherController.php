<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class TeacherController extends Controller
{
    /**
     * Display a listing of teachers
     */
    public function index(Request $request)
    {
        $query = Teacher::with(['user', 'department']);

        // Filter by department
        if ($request->has('department_id')) {
            $query->where('department_id', $request->department_id);
        }

        // Filter by active status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Search by name or employee ID
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('full_name', 'ILIKE', "%{$search}%")
                  ->orWhere('employee_id', 'ILIKE', "%{$search}%");
            });
        }

        $teachers = $query->paginate($request->get('per_page', 15));

        return response()->json($teachers);
    }

    /**
     * Store a newly created teacher
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'employee_id' => 'required|unique:teachers,employee_id',
            'full_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'department_id' => 'required|exists:departments,id',
            'date_joined' => 'nullable|date',
            'specialization' => 'nullable|string|max:255',
            'qualifications' => 'nullable|string',
            'documents' => 'nullable|array',
        ]);

        // Create user account
        $user = \App\Models\User::create([
            'name' => $validated['full_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'teacher',
        ]);

        // Create teacher profile
        $teacher = Teacher::create([
            'user_id' => $user->id,
            'employee_id' => $validated['employee_id'],
            'full_name' => $validated['full_name'],
            'phone' => $validated['phone'] ?? null,
            'department_id' => $validated['department_id'],
            'date_joined' => $validated['date_joined'] ?? now(),
            'specialization' => $validated['specialization'] ?? null,
            'qualifications' => $validated['qualifications'] ?? null,
            'documents' => $validated['documents'] ?? null,
            'is_active' => true,
        ]);

        // Update department teacher count
        $department = Department::find($validated['department_id']);
        $department->increment('total_teachers');

        return response()->json([
            'message' => 'Teacher created successfully',
            'teacher' => $teacher->load(['user', 'department']),
        ], 201);
    }

    /**
     * Display the specified teacher
     */
    public function show($id)
    {
        $teacher = Teacher::with([
            'user',
            'department',
            'kpis',
            'evaluations',
            'mycpeRecords'
        ])->findOrFail($id);

        return response()->json($teacher);
    }

    /**
     * Update the specified teacher
     */
    public function update(Request $request, $id)
    {
        $teacher = Teacher::findOrFail($id);

        $validated = $request->validate([
            'full_name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'department_id' => 'sometimes|exists:departments,id',
            'specialization' => 'nullable|string|max:255',
            'qualifications' => 'nullable|string',
            'documents' => 'nullable|array',
            'is_active' => 'sometimes|boolean',
        ]);

        // Update department teacher count if department changed
        if (isset($validated['department_id']) && $validated['department_id'] != $teacher->department_id) {
            $oldDepartment = Department::find($teacher->department_id);
            $oldDepartment?->decrement('total_teachers');
            
            $newDepartment = Department::find($validated['department_id']);
            $newDepartment->increment('total_teachers');
        }

        $teacher->update($validated);

        return response()->json([
            'message' => 'Teacher updated successfully',
            'teacher' => $teacher->load(['user', 'department']),
        ]);
    }

    /**
     * Remove the specified teacher
     */
    public function destroy($id)
    {
        $teacher = Teacher::findOrFail($id);
        
        // Decrement department teacher count
        $department = Department::find($teacher->department_id);
        $department?->decrement('total_teachers');

        $teacher->delete();

        return response()->json([
            'message' => 'Teacher deleted successfully',
        ]);
    }

    /**
     * Get teacher's KPIs
     */
    public function kpis($id)
    {
        $teacher = Teacher::findOrFail($id);
        $kpis = $teacher->kpis()->with('teacher')->get();

        return response()->json($kpis);
    }

    /**
     * Get teacher's evaluations
     */
    public function evaluations($id)
    {
        $teacher = Teacher::findOrFail($id);
        $evaluations = $teacher->evaluations()
            ->with(['principal', 'classroomObservation', 'annualAppraisal'])
            ->get();

        return response()->json($evaluations);
    }
}
