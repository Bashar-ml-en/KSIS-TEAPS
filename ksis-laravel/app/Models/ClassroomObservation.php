<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ClassroomObservation extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'teacher_id',
        'principal_id',
        'observation_date',
        'subject',
        'grade_level',
        'lesson_topic',
        'introduction_score',
        'content_score',
        'engagement_score',
        'lesson_flow_score',
        'enrichment_tools_score',
        'individual_care_score',
        'assessment_score',
        'classroom_mgmt_score',
        'conclusion_score',
        'observation_notes',
        'status',
    ];

    protected $casts = [
        'observation_date' => 'date',
        'introduction_score' => 'integer',
        'content_score' => 'integer',
        'engagement_score' => 'integer',
        'lesson_flow_score' => 'integer',
        'enrichment_tools_score' => 'integer',
        'individual_care_score' => 'integer',
        'assessment_score' => 'integer',
        'classroom_mgmt_score' => 'integer',
        'conclusion_score' => 'integer',
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

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class, 'observation_id');
    }

    // Accessors
    public function getTotalScoreAttribute()
    {
        return ($this->introduction_score ?? 0) +
               ($this->content_score ?? 0) +
               ($this->engagement_score ?? 0) +
               ($this->lesson_flow_score ?? 0) +
               ($this->enrichment_tools_score ?? 0) +
               ($this->individual_care_score ?? 0) +
               ($this->assessment_score ?? 0) +
               ($this->classroom_mgmt_score ?? 0) +
               ($this->conclusion_score ?? 0);
    }

    // Scopes
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
