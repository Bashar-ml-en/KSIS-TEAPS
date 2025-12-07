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


    /**
     * Principal observation score audit interface
     * View all classroom observation scores aggregated for quality control
     */
    public function observationAudit(Request $request, $id)
    {
        $principal = Principal::findOrFail($id);

        $query = ClassroomObservation::with(['teacher', 'principal'])
            ->where('principal_id', $id);

        // Filter by teacher
        if ($request->has('teacher_id')) {
            $query->where('teacher_id', $request->teacher_id);
        }

        // Filter by department
        if ($request->has('department_id')) {
            $query->whereHas('teacher', function($q) use ($request) {
                $q->where('department_id', $request->department_id);
            });
        }

        // Filter by date range
        if ($request->has('from_date')) {
            $query->whereDate('observed_date', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->whereDate('observed_date', '<=', $request->to_date);
        }

        $observations = $query->latest('observed_date')->get();

        // Calculate statistics
        $stats = [
            'total_observations' => $observations->count(),
            'average_attendance_score' => $observations->avg('attendance_score'),
            'average_lesson_plan_score' => $observations->avg('lesson_plan_score'),
            'average_teaching_strategy_score' => $observations->avg('teaching_strategy_score'),
            'average_student_engagement_score' => $observations->avg('student_engagement_score'),
            'average_classroom_management_score' => $observations->avg('classroom_management_score'),
            'average_assessment_score' => $observations->avg('assessment_score'),
            'average_total_score' => $observations->avg('total_score'),
        ];

        // Group by teacher for comparison
        $byTeacher = $observations->groupBy('teacher_id')->map(function($teacherObs) {
            return [
                'teacher' => $teacherObs->first()->teacher,
                'observation_count' => $teacherObs->count(),
                'average_total_score' => $teacherObs->avg('total_score'),
                'latest_observation_date' => $teacherObs->first()->observed_date,
            ];
        })->values();

        // Identify outliers (scores 2 standard deviations away from mean)
        $mean = $stats['average_total_score'];
        $variance = $observations->map(function($obs) use ($mean) {
            return pow($obs->total_score - $mean, 2);
        })->avg();
        $standardDeviation = sqrt($variance);

        $outliers = $observations->filter(function($obs) use ($mean, $standardDeviation) {
            return abs($obs->total_score - $mean) > (2 * $standardDeviation);
        })->values();

        return response()->json([
            'statistics' => $stats,
            'observations' => $observations,
            'by_teacher' => $byTeacher,
            'outliers' => $outliers,
            'outlier_threshold' => [
                'mean' => $mean,
                'std_dev' => $standardDeviation,
                'lower_bound' => $mean - (2 * $standardDeviation),
                'upper_bound' => $mean + (2 * $standardDeviation),
            ],
        ]);
    }



    /**
     * Get department performance dashboard
     */
    public function departmentPerformance(Request $request, $id)
    {
        $principal = Principal::findOrFail($id);
        
        $year = $request->get('year', now()->year);
        
        $performanceService = new \App\Services\ReportingService\DepartmentPerformanceService();
        $report = $performanceService->getDepartmentPerformance($year, $principal->id);
        
        return response()->json($report);
    }
    
    /**
     * Get year-over-year department comparison  
     */
    public function departmentComparison(Request $request, $id)
    {
        $principal = Principal::findOrFail($id);
        
        $validated = $request->validate([
            'department_id' => 'required|exists:departments,id',
            'current_year' => 'required|integer|min:2000|max:2100',
            'previous_year' => 'required|integer|min:2000|max:2100',
        ]);
        
        $performanceService = new \App\Services\ReportingService\DepartmentPerformanceService();
        $comparison = $performanceService->getYearOverYearComparison(
            $validated['department_id'],
            $validated['current_year'],
            $validated['previous_year']
        );
        
        return response()->json($comparison);
    }

}

