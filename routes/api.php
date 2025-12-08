<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AnnualAppraisalController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClassroomObservationController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\ConfigurationController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\EngagementController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\HrAdminController;
use App\Http\Controllers\KpiController;
use App\Http\Controllers\KpiRequestController;
use App\Http\Controllers\MycpeRecordController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PrincipalController;
use App\Http\Controllers\ReevaluationRequestController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\VerificationController;

/*
|--------------------------------------------------------------------------
| API Routes - KSIS Evaluation and Performance System
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::get('/user/profile', [AuthController::class, 'profile']); // Match frontend call
    Route::get('/users', [AuthController::class, 'index']); // Fix for User Management
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/user/profile-photo', [AuthController::class, 'updateProfilePhoto']);

    // Departments
    Route::apiResource('departments', DepartmentController::class);
    Route::get('departments/{id}/teachers', [DepartmentController::class, 'teachers']);

    // Teachers
    Route::middleware('role:hr_admin,principal')->group(function () {
        Route::post('teachers', [TeacherController::class, 'store']);
        Route::put('teachers/{id}', [TeacherController::class, 'update']);
        Route::delete('teachers/{id}', [TeacherController::class, 'destroy']);
    });
    Route::get('teachers', [TeacherController::class, 'index']);
    Route::get('teachers/{id}', [TeacherController::class, 'show']);
    Route::get('teachers/{id}/kpis', [TeacherController::class, 'kpis']);
    Route::get('teachers/{id}/evaluations', [TeacherController::class, 'evaluations']);

    // Principals
    Route::middleware('role:hr_admin')->group(function () {
        Route::post('principals', [PrincipalController::class, 'store']);
        Route::put('principals/{id}', [PrincipalController::class, 'update']);
        Route::delete('principals/{id}', [PrincipalController::class, 'destroy']);
    });
    Route::get('principals/{id}', [PrincipalController::class, 'show']);
    Route::get('principals/{id}/evaluations', [PrincipalController::class, 'evaluations']);
    Route::get('principals/{id}/classroom-observations', [PrincipalController::class, 'classroomObservations']);
    Route::middleware('role:principal')->get('principals/{id}/observation-audit', [PrincipalController::class, 'observationAudit']);
    Route::middleware('role:principal')->get('principals/{id}/department-performance', [PrincipalController::class, 'departmentPerformance']);
    Route::middleware('role:principal')->get('principals/{id}/department-comparison', [PrincipalController::class, 'departmentComparison']);

    // HR Admins
    Route::middleware('role:hr_admin')->group(function () {
        Route::apiResource('hr-admins', HrAdminController::class);
        Route::get('hr-admins/{id}/reviewed-evaluations', [HrAdminController::class, 'reviewedEvaluations']);
    });

    // KPIs
    Route::apiResource('kpis', KpiController::class);
    Route::post('kpis/{id}/progress', [KpiController::class, 'updateProgress']);

    // KPI Requests
    Route::apiResource('kpi-requests', KpiRequestController::class)->except(['update', 'destroy']);
    Route::middleware('role:principal,hr_admin')->group(function () {
        Route::post('kpi-requests/{id}/approve', [KpiRequestController::class, 'approve']);
        Route::post('kpi-requests/{id}/reject', [KpiRequestController::class, 'reject']);
    });

    // Classroom Observations
    Route::get('classroom-observations', [ClassroomObservationController::class, 'index']);
    Route::get('classroom-observations/{id}', [ClassroomObservationController::class, 'show']);
    Route::middleware('role:principal,hr_admin')->group(function () {
        Route::post('classroom-observations', [ClassroomObservationController::class, 'store']);
        Route::put('classroom-observations/{id}', [ClassroomObservationController::class, 'update']);
        Route::delete('classroom-observations/{id}', [ClassroomObservationController::class, 'destroy']);
        Route::post('classroom-observations/{id}/complete', [ClassroomObservationController::class, 'complete']);
    });

    // Annual Appraisals
    Route::get('annual-appraisals', [AnnualAppraisalController::class, 'index']);
    Route::get('annual-appraisals/{id}', [AnnualAppraisalController::class, 'show']);
    Route::middleware('role:principal,hr_admin')->group(function () {
        Route::post('annual-appraisals', [AnnualAppraisalController::class, 'store']);
        Route::put('annual-appraisals/{id}', [AnnualAppraisalController::class, 'update']);
        Route::delete('annual-appraisals/{id}', [AnnualAppraisalController::class, 'destroy']);
    });
    Route::middleware('role:teacher')->post('annual-appraisals/{id}/submit', [AnnualAppraisalController::class, 'submit']);
    Route::middleware('role:principal,hr_admin')->post('annual-appraisals/{id}/feo-submit', [AnnualAppraisalController::class, 'feoSubmit']);
    Route::middleware('role:principal')->post('annual-appraisals/{id}/principal-review', [AnnualAppraisalController::class, 'principalReview']);
    Route::middleware('role:principal')->post('annual-appraisals/{id}/return-for-revision', [AnnualAppraisalController::class, 'returnForRevision']);
    Route::middleware('role:hr_admin')->post('annual-appraisals/{id}/hr-review', [AnnualAppraisalController::class, 'hrReview']);
    Route::middleware('role:principal,hr_admin')->post('annual-appraisals/{id}/recalculate', [AnnualAppraisalController::class, 'recalculateScores']);
    
    // Principal Dispute Management
    Route::middleware('role:principal')->get('disputes/dashboard', [AnnualAppraisalController::class, 'disputeDashboard']);
    Route::middleware('role:principal')->post('disputes/{id}/resolve', [AnnualAppraisalController::class, 'resolveDispute']);

    // MyCPE Records
    Route::get('mycpe-records', [MycpeRecordController::class, 'index']);
    Route::get('mycpe-records/{id}', [MycpeRecordController::class, 'show']);
    Route::middleware('role:teacher')->group(function () {
        Route::post('mycpe-records', [MycpeRecordController::class, 'store']);
        Route::put('mycpe-records/{id}', [MycpeRecordController::class, 'update']);
        Route::delete('mycpe-records/{id}', [MycpeRecordController::class, 'destroy']);
    });
    Route::middleware('role:principal,hr_admin')->post('mycpe-records/{id}/approve', [MycpeRecordController::class, 'approve']);
    Route::get('mycpe-records/compliance/check', [MycpeRecordController::class, 'getCompliance']);
    Route::middleware('role:principal,hr_admin')->get('mycpe-records/bulk-compliance', [MycpeRecordController::class, 'bulkCompliance']);
    Route::middleware('role:principal,hr_admin')->get('mycpe-records/compliance-by-department', [MycpeRecordController::class, 'complianceByDepartment']);
    Route::middleware('role:principal,hr_admin')->get('mycpe-records/teacher/{teacherId}/details', [MycpeRecordController::class, 'teacherCPEDetails']);

    // Configuration Management (HR Admin only)
    Route::middleware('role:hr_admin')->group(function () {
        Route::get('config/{key}', [ConfigurationController::class, 'show']);
        Route::post('config/{key}', [ConfigurationController::class, 'update']);
        Route::get('config/{key}/history', [ConfigurationController::class, 'history']);
        Route::post('config/{key}/restore/{version}', [ConfigurationController::class, 'restore']);
    });

    // Reporting & Analytics (HR Admin only)
    Route::middleware('role:hr_admin')->group(function () {
        Route::get('reports/teacher/{teacherId}', [ReportController::class, 'teacherReport']);
        Route::get('reports/department/{departmentId}', [ReportController::class, 'departmentReport']);
        Route::get('reports/school', [ReportController::class, 'schoolReport']);
        Route::get('reports/export', [ReportController::class, 'export']);
        Route::get('reports/training-dashboard', [ReportController::class, 'trainingDashboard']);
    });

    // Contract Management (HR Admin & Principal)
    Route::middleware('role:hr_admin,principal')->group(function () {
        Route::apiResource('contracts', ContractController::class);
    });
    Route::middleware('role:teacher')->get('my-contract', [ContractController::class, 'myContract']);

    // Attendance & Leave (Teacher)
    Route::middleware('role:teacher')->group(function () {
        Route::get('attendance', [AttendanceController::class, 'index']);
        Route::get('attendance/status', [AttendanceController::class, 'show']);
        Route::post('attendance/clock-in', [AttendanceController::class, 'clockIn']);
        Route::post('attendance/clock-out', [AttendanceController::class, 'clockOut']);
        Route::get('attendance/metrics', [AttendanceController::class, 'metrics']);

        Route::get('leave-requests', [LeaveRequestController::class, 'index']);
        Route::post('leave-requests', [LeaveRequestController::class, 'store']);

        // Dashboard Stats
        Route::get('teacher/dashboard-stats', [TeacherController::class, 'dashboardStats']);
        Route::get('teacher/recent-submissions', [TeacherController::class, 'recentSubmissions']);
    });

    // Engagement Dashboard (Teacher, Principal, HR Admin)
    Route::get('engagement/metrics', [EngagementController::class, 'metrics']);

    // Email Verification
    Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])
        ->middleware(['auth', 'signed'])->name('verification.verify');
    Route::post('/email/verification-notification', [VerificationController::class, 'resend'])
        ->middleware(['auth', 'throttle:6,1'])->name('verification.send');

    // Re-evaluation Requests
    Route::get('reevaluation-requests', [ReevaluationRequestController::class, 'index']);
    Route::get('reevaluation-requests/{id}', [ReevaluationRequestController::class, 'show']);
    Route::middleware('role:teacher')->group(function () {
        Route::post('reevaluation-requests', [ReevaluationRequestController::class, 'store']);
        Route::put('reevaluation-requests/{id}', [ReevaluationRequestController::class, 'update']);
        Route::delete('reevaluation-requests/{id}', [ReevaluationRequestController::class, 'destroy']);
        Route::post('reevaluation-requests/{id}/submit', [ReevaluationRequestController::class, 'submit']);
    });
    Route::middleware('role:principal,hr_admin')->post('reevaluation-requests/{id}/review', [ReevaluationRequestController::class, 'review']);

    // Evaluations
    Route::apiResource('evaluations', EvaluationController::class);
    Route::post('evaluations/{id}/submit', [EvaluationController::class, 'submit']);
    Route::middleware('role:hr_admin')->post('evaluations/{id}/review', [EvaluationController::class, 'review']);

    // Feedback
    Route::apiResource('feedback', FeedbackController::class)->only(['index', 'store', 'show']);
    Route::post('feedback/{id}/analyze', [FeedbackController::class, 'analyze']);

    // Notifications
    Route::get('notifications', [NotificationController::class, 'index']);
    Route::get('notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('notifications/{id}/mark-as-read', [NotificationController::class, 'markAsRead']);
    Route::post('notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead']);
});
