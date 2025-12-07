<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Evaluation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'teacher_id',
        'principal_id',
        'evaluation_period',
        'evaluation_type',
        'observation_id',
        'appraisal_id',
        'core_responsibilities_score',
        'school_service_score',
        'mycpe_score',
        'personality_score',
        'overall_score',
        'status',
        'principal_submitted_date',
        'hr_reviewed_date',
        'hr_admin_id',
    ];

    protected $casts = [
        'core_responsibilities_score' => 'decimal:2',
        'school_service_score' => 'decimal:2',
        'mycpe_score' => 'decimal:2',
        'personality_score' => 'decimal:2',
        'overall_score' => 'decimal:2',
        'principal_submitted_date' => 'datetime',
        'hr_reviewed_date' => 'datetime',
    ];

    // Relationships
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function principal()
    {
        return $this->belongsTo(Principal::class);
    }

    public function hrAdmin()
    {
        return $this->belongsTo(HrAdmin::class);
    }

    public function classroomObservation()
    {
        return $this->belongsTo(ClassroomObservation::class, 'observation_id');
    }

    public function annualAppraisal()
    {
        return $this->belongsTo(AnnualAppraisal::class, 'appraisal_id');
    }

    public function feedback()
    {
        return $this->hasMany(Feedback::class);
    }

    public function reevaluationRequests()
    {
        return $this->hasMany(ReevaluationRequest::class);
    }

    // Scopes
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByPeriod($query, $period)
    {
        return $query->where('evaluation_period', $period);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('evaluation_type', $type);
    }
}
