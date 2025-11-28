<?php

namespace App\Http\Controllers;

use App\Models\HrAdmin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class HrAdminController extends Controller
{
    /**
     * Display a listing of HR admins
     */
    public function index(Request $request)
    {
        $query = HrAdmin::with('user');

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

        $hrAdmins = $query->paginate($request->get('per_page', 15));

        return response()->json($hrAdmins);
    }

    /**
     * Store a newly created HR admin
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'employee_id' => 'required|unique:hr_admins,employee_id',
            'full_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'date_appointed' => 'nullable|date',
            'position' => 'nullable|string|max:255',
            'responsibilities' => 'nullable|string',
        ]);

        // Create user account
        $user = User::create([
            'name' => $validated['full_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'hr_admin',
        ]);

        // Create HR admin profile
        $hrAdmin = HrAdmin::create([
            'user_id' => $user->id,
            'employee_id' => $validated['employee_id'],
            'full_name' => $validated['full_name'],
            'phone' => $validated['phone'] ?? null,
            'date_appointed' => $validated['date_appointed'] ?? now(),
            'position' => $validated['position'] ?? 'HR Administrator',
            'responsibilities' => $validated['responsibilities'] ?? null,
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'HR Admin created successfully',
            'hr_admin' => $hrAdmin->load('user'),
        ], 201);
    }

    /**
     * Display the specified HR admin
     */
    public function show($id)
    {
        $hrAdmin = HrAdmin::with([
            'user',
            'reviewedEvaluations',
        ])->findOrFail($id);

        return response()->json($hrAdmin);
    }

    /**
     * Update the specified HR admin
     */
    public function update(Request $request, $id)
    {
        $hrAdmin = HrAdmin::findOrFail($id);

        $validated = $request->validate([
            'full_name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'position' => 'nullable|string|max:255',
            'responsibilities' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $hrAdmin->update($validated);

        return response()->json([
            'message' => 'HR Admin updated successfully',
            'hr_admin' => $hrAdmin->load('user'),
        ]);
    }

    /**
     * Remove the specified HR admin
     */
    public function destroy($id)
    {
        $hrAdmin = HrAdmin::findOrFail($id);
        $hrAdmin->delete();

        return response()->json([
            'message' => 'HR Admin deleted successfully',
        ]);
    }

    /**
     * Get evaluations reviewed by this HR admin
     */
    public function reviewedEvaluations($id)
    {
        $hrAdmin = HrAdmin::findOrFail($id);
        $evaluations = $hrAdmin->reviewedEvaluations()
            ->with(['teacher', 'principal'])
            ->latest()
            ->get();

        return response()->json($evaluations);
    }
}
