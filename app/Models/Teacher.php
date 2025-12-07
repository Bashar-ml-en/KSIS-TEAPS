<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teacher extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'employee_id',
        'full_name',
        'phone',
        'department_id',
        'date_joined',
        'specialization',
        'qualifications',
        'documents',
        'is_active',
    ];

    protected $casts = [
        'date_joined' => 'date',
        'documents' => 'array',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function kpis()
    {
        return $this->hasMany(Kpi::class);
    }

    public function kpiRequests()
    {
        return $this->hasMany(KpiRequest::class);
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }

    public function classroomObservations()
    {
        return $this->hasMany(ClassroomObservation::class);
    }

    public function annualAppraisals()
    {
        return $this->hasMany(AnnualAppraisal::class);
    }

    public function mycpeRecords()
    {
        return $this->hasMany(MycpeRecord::class);
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
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByDepartment($query, $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }
}
