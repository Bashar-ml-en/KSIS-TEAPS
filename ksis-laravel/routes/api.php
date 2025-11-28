<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\KpiController;
use App\Http\Controllers\KpiRequestController;
use App\Http\Controllers\EvaluationController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PrincipalController;
use App\Http\Controllers\HrAdminController;
use App\Http\Controllers\ClassroomObservationController;
use App\Http\Controllers\AnnualAppraisalController;
use App\Http\Controllers\MycpeRecordController;
use App\Http\Controllers\ReevaluationRequestController;

/*
|--------------------------------------------------------------------------
| API Routes - KSIS Evaluation and Performance System
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login'])->name('login');

// GET route for register endpoint (provides API info when accessed via browser)
Route::get('/register', function () {
    return response()->json([
        'message' => 'KSIS Evaluation System API - Register Endpoint',
        'method' => 'POST',
        'endpoint' => '/api/register',
        'required_fields' => [
            'name' => 'string (required)',
            'email' => 'string (required)',
            'password' => 'string (required)',
            'password_confirmation' => 'string (required)',
        ],
        'example' => [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ],
        'note' => 'This is a POST-only endpoint. Use a tool like Postman, cURL, or your frontend application to send POST requests.'
    ], 200);
});

// GET route for login endpoint (provides API info when accessed via browser)
Route::get('/login', function () {
    return response()->json([
        'message' => 'KSIS Evaluation System API - Login Endpoint',
        'method' => 'POST',
        'endpoint' => '/api/login',
        'required_fields' => [
            'email' => 'string (required)',
            'password' => 'string (required)',
        ],
        'example' => [
            'email' => 'user@example.com',
            'password' => 'your-password'
        ],
        'response' => [
            'success' => [
                'token' => 'authentication_token',
                'user' => '{ user details }'
            ],
            'error' => [
                'message' => 'error description'
            ]
        ],
        'note' => 'This is a POST-only endpoint. Use a tool like Postman, cURL, or your frontend application to send POST requests.'
    ], 200);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Departments
    Route::apiResource('departments', DepartmentController::class);
    Route::get('departments/{id}/teachers', [DepartmentController::class, 'teachers']);

    // Teachers - HR Admin and Principal can manage, Teachers can view
    Route::middleware('role:hr_admin,principal')->group(function () {
        Route::post('teachers', [TeacherController::class, 'store']);
        Route::put('teachers/{id}', [TeacherController::class, 'update']);
        Route::delete('teachers/{id}', [TeacherController::class, 'destroy']);
    });
    Route::get('teachers', [TeacherController::class, 'index']);
    Route::get('teachers/{id}', [TeacherController::class, 'show']);
    Route::get('teachers/{id}/kpis', [TeacherController::class, 'kpis']);
    Route::get('teachers/{id}/evaluations', [TeacherController::class, 'evaluations']);

    // Principals - HR Admin only for create/update/delete
    Route::middleware('role:hr_admin')->group(function () {
        Route::post('principals', [PrincipalController::class, 'store']);
        Route::put('principals/{id}', [PrincipalController::class, 'update']);
        Route::delete('principals/{id}', [PrincipalController::class, 'destroy']);
    });
    Route::get('principals', [PrincipalController::class, 'index']);
    Route::get('principals/{id}', [PrincipalController::class, 'show']);
    Route::get('principals/{id}/evaluations', [PrincipalController::class, 'evaluations']);
    Route::get('principals/{id}/classroom-observations', [PrincipalController::class, 'classroomObservations']);

    // HR Admins - HR Admin only
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
    Route::middleware('role:principal')->post('annual-appraisals/{id}/principal-review', [AnnualAppraisalController::class, 'principalReview']);
    Route::middleware('role:hr_admin')->post('annual-appraisals/{id}/hr-review', [AnnualAppraisalController::class, 'hrReview']);

    // MyCPE Records
    Route::get('mycpe-records', [MycpeRecordController::class, 'index']);
    Route::get('mycpe-records/{id}', [MycpeRecordController::class, 'show']);
    Route::middleware('role:teacher')->group(function () {
        Route::post('mycpe-records', [MycpeRecordController::class, 'store']);
        Route::put('mycpe-records/{id}', [MycpeRecordController::class, 'update']);
        Route::delete('mycpe-records/{id}', [MycpeRecordController::class, 'destroy']);
    });
    Route::middleware('role:principal,hr_admin')->post('mycpe-records/{id}/approve', [MycpeRecordController::class, 'approve']);

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
