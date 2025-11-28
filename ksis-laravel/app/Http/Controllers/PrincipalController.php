<?php

namespace App\Http\Controllers;

use App\Models\Principal;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class PrincipalController extends Controller
{
    /**
     * Display a listing of principals
     */
    public function index(Request $request)
    {
        $query = Principal::with('user');

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

        $principals = $query->paginate($request->get('per_page', 15));

        return response()->json($principals);
    }

    /**
     * Store a newly created principal
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'employee_id' => 'required|unique:principals,employee_id',
            'full_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'date_appointed' => 'nullable|date',
            'school_name' => 'nullable|string|max:255',
            'qualifications' => 'nullable|string',
        ]);

        // Create user account
        $user = User::create([
            'name' => $validated['full_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'principal',
        ]);

        // Create principal profile
        $principal = Principal::create([
            'user_id' => $user->id,
            'employee_id' => $validated['employee_id'],
            'full_name' => $validated['full_name'],
            'phone' => $validated['phone'] ?? null,
            'date_appointed' => $validated['date_appointed'] ?? now(),
            'school_name' => $validated['school_name'] ?? null,
            'qualifications' => $validated['qualifications'] ?? null,
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Principal created successfully',
            'principal' => $principal->load('user'),
        ], 201);
    }

    /**
     * Display the specified principal
     */
    public function show($id)
    {
        $principal = Principal::with([
            'user',
            'evaluations',
            'classroomObservations',
            'kpiRequests',
        ])->findOrFail($id);

        return response()->json($principal);
    }

    /**
     * Update the specified principal
     */
    public function update(Request $request, $id)
    {
        $principal = Principal::findOrFail($id);

        $validated = $request->validate([
            'full_name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'school_name' => 'nullable|string|max:255',
            'qualifications' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $principal->update($validated);

        return response()->json([
            'message' => 'Principal updated successfully',
            'principal' => $principal->load('user'),
        ]);
    }

    /**
     * Remove the specified principal
     */
    public function destroy($id)
    {
        $principal = Principal::findOrFail($id);
        $principal->delete();

        return response()->json([
            'message' => 'Principal deleted successfully',
        ]);
    }

    /**
     * Get principal's evaluations
     */
    public function evaluations($id)
    {
        $principal = Principal::findOrFail($id);
        $evaluations = $principal->evaluations()
            ->with(['teacher', 'classroomObservation', 'annualAppraisal'])
            ->latest()
            ->get();

        return response()->json($evaluations);
    }

    /**
     * Get principal's classroom observations
     */
    public function classroomObservations($id)
    {
        $principal = Principal::findOrFail($id);
        $observations = $principal->classroomObservations()
            ->with('teacher')
            ->latest()
            ->get();

        return response()->json($observations);
    }
}
