<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $limit = $request->query('limit', 10);
        $attendances = Attendance::where('user_id', $request->user()->id)
            ->orderBy('date', 'desc')
            ->limit($limit)
            ->get();

        return response()->json($attendances);
    }

    public function show(Request $request)
    {
        // Check for today's status
        $today = Carbon::today()->toDateString();
        $attendance = Attendance::where('user_id', $request->user()->id)
            ->where('date', $today)
            ->first();

        return response()->json([
            'timed_in' => $attendance && $attendance->time_in && !$attendance->time_out,
            'time_in' => $attendance ? $attendance->time_in : null,
            'time_out' => $attendance ? $attendance->time_out : null,
        ]);
    }

    public function clockIn(Request $request)
    {
        $user = $request->user();
        $today = Carbon::today()->toDateString();
        $now = Carbon::now();

        $attendance = Attendance::firstOrCreate(
            ['user_id' => $user->id, 'date' => $today],
            [
                'time_in' => $now->toTimeString(),
                'status' => $now->hour > 8 ? 'late' : 'present'
            ]
        );

        return response()->json($attendance);
    }

    public function clockOut(Request $request)
    {
        $user = $request->user();
        $today = Carbon::today()->toDateString();
        $now = Carbon::now();

        $attendance = Attendance::where('user_id', $user->id)
            ->where('date', $today)
            ->firstOrFail();

        $startTime = Carbon::parse($attendance->date . ' ' . $attendance->time_in);
        $duration = $now->diffInHours($startTime);

        $attendance->update([
            'time_out' => $now->toTimeString(),
            'hours_worked' => $duration
        ]);

        return response()->json($attendance);
    }

    public function metrics(Request $request)
    {
        $user = $request->user();
        $currentMonth = Carbon::now()->startOfMonth();
        
        $attendances = Attendance::where('user_id', $user->id)
            ->where('date', '>=', $currentMonth)
            ->get();

        $totalDays = Carbon::now()->daysInMonth; 
        $workingDaysPassed = Carbon::now()->day; // Rough approximation
        $presentCount = $attendances->whereIn('status', ['present', 'late'])->count();
        $lateCount = $attendances->where('status', 'late')->count();
        
        return response()->json([
            'attendance_rate' => $workingDaysPassed > 0 ? round(($presentCount / $workingDaysPassed) * 100, 1) : 0,
            'total_days' => $workingDaysPassed,
            'present_days' => $presentCount,
            'late_days' => $lateCount,
            'leave_days' => $attendances->where('status', 'on_leave')->count(),
        ]);
    }
}
