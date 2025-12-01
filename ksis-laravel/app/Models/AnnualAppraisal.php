<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AnnualAppraisal extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'teacher_id',
        'appraisal_year',
        // Core Responsibilities (60%)
        'teaching_load_lessons_per_week',
        'curriculum_content_score',
        'aligned_curriculum_score',
        'student_outcome_score',
        'classroom_management_score',
        'marking_students_work_score',
        // School Service (20%)
        'cocurricular_activities_score',
        'duties_other_tasks_score',
        'event_management_score',
        'other_responsibilities_score',
        'competition_score',
        // Community Service
        'community_quantity_score',
        'community_quality_score',
        // Personality & Work Culture
        'management_skills_score',
        'resilience_score',
        'motivation_score',
        'compassion_score',
        'networking_communication_score',
        'core_values_score',
        'attendance_score',
        // Comments
        'self_strengths',
        'self_areas_for_improvement',
        'self_goals_next_period',
        'principal_overall_comment',
        'principal_career_advancement',
        'hr_overall_comment',
        'hr_career_advancement',
        'status',
        // Calculated scores
        'part_2_score',
        'part_3_score',
        'cpe_score',
        'final_weighted_score',
        'calculated_at',
        // Workflow control
        'is_locked',
        'completed_at',
        // Override tracking
        'original_final_score',
        'score_override_justification',
        'score_overridden_at',
    ];

    protected $casts = [
        'appraisal_year' => 'integer',
        'teaching_load_lessons_per_week' => 'integer',
        'curriculum_content_score' => 'integer',
        'aligned_curriculum_score' => 'integer',
        'student_outcome_score' => 'integer',
        'classroom_management_score' => 'integer',
        'marking_students_work_score' => 'integer',
        'cocurricular_activities_score' => 'integer',
        'duties_other_tasks_score' => 'integer',
        'event_management_score' => 'integer',
        'other_responsibilities_score' => 'integer',
        'competition_score' => 'integer',
        'community_quantity_score' => 'integer',
        'community_quality_score' => 'integer',
        'management_skills_score' => 'integer',
        'resilience_score' => 'integer',
        'motivation_score' => 'integer',
        'compassion_score' => 'integer',
        'networking_communication_score' => 'integer',
        'core_values_score' => 'integer',
        'attendance_score' => 'integer',
        'part_2_score' => 'decimal:2',
        'part_3_score' => 'decimal:2',
        'cpe_score' => 'decimal:2',
        'final_weighted_score' => 'decimal:2',
        'original_final_score' => 'decimal:2',
        'calculated_at' => 'datetime',
        'completed_at' => 'datetime',
        'score_overridden_at' => 'datetime',
        'is_locked' => 'boolean',
    ];

    // Relationships
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class, 'appraisal_id');
    }

    // Scopes
    public function scopeByYear($query, $year)
    {
        return $query->where('appraisal_year', $year);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}
