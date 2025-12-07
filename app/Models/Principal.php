<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Principal extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'employee_id',
        'full_name',
        'phone',
        'date_appointed',
        'school_name',
        'qualifications',
        'is_active',
    ];

    protected $casts = [
        'date_appointed' => 'date',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }

    public function classroomObservations()
    {
        return $this->hasMany(ClassroomObservation::class);
    }

    public function kpiRequests()
    {
        return $this->hasMany(KpiRequest::class);
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
}
