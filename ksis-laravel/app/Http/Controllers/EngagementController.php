<?php

namespace App\Http\Controllers;

use App\Models\Teacher;
use App\Models\Kpi; // Assuming Kpi model exists
use App\Models\MycpeRecord;
use App\Models\ClassroomObservation;
use Illuminate\Http\Request;

class EngagementController extends Controller
{
    /**
     * Get engagement metrics for a teacher
     */
    public function metrics(Request $request)
    {
        $user = $request->user();
        $teacher = null;

        if ($user->role === 'teacher') {
            $teacher = Teacher::where('user_id', $user->id)->firstOrFail();
        } elseif ($request->has('teacher_id')) {
            // Allow principals/admins to view specific teacher metrics
            $teacher = Teacher::findOrFail($request->teacher_id);
        } else {
            return response()->json(['message' => 'Teacher ID required'], 400);
        }

        $year = $request->get('year', now()->year);

        // 1. KPIs Created
        // Check if Kpi model exists and has teacher_id
        $kpiCount = 0;
        if (class_exists(\App\Models\Kpi::class)) {
             $kpiCount = Kpi::where('teacher_id', $teacher->id)
                ->whereYear('start_date', $year)
                ->count();
        }

        // 2. CPE Hours Logged
        $cpeHours = MycpeRecord::where('teacher_id', $teacher->id)
            ->whereYear('date_attended', $year)
            ->sum('duration_hours');
            
        $cpePoints = MycpeRecord::where('teacher_id', $teacher->id)
            ->whereYear('date_attended', $year)
            ->where('status', 'approved')
            ->sum('cpe_points');

        // 3. Classroom Observations Participated
        $observationCount = ClassroomObservation::where('teacher_id', $teacher->id)
            ->whereYear('observation_date', $year)
            ->count();

        // 4. Calculate Engagement Score (Simple algorithm)
        // Base score: 50
        // +5 per KPI (max 20)
        // +1 per CPE point (max 20)
        // +10 per observation (max 30)
        
        $score = 50;
        $score += min($kpiCount * 5, 20);
        $score += min($cpePoints, 20);
        $score += min($observationCount * 10, 30);
        
        // Cap at 100
        $score = min($score, 100);

        return response()->json([
            'teacher_id' => $teacher->id,
            'year' => $year,
            'metrics' => [
                'kpis_created' => $kpiCount,
                'cpe_hours' => $cpeHours,
                'cpe_points' => $cpePoints,
                'observations_count' => $observationCount,
            ],
            'engagement_score' => $score,
            'rating' => $this->getEngagementRating($score),
        ]);
    }

    private function getEngagementRating($score)
    {
        if ($score >= 90) return 'Highly Engaged';
        if ($score >= 75) return 'Engaged';
        if ($score >= 60) return 'Moderately Engaged';
        return 'Low Engagement';
    }
}
