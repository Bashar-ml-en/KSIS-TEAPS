<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReevaluationRequest extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'teacher_id',
        'evaluation_id',
        'reason',
        'supporting_evidence',
        'status',
        'principal_id',
        'principal_response',
        'reviewed_date',
        'scheduled_date',
        'new_evaluation_id',
    ];

    protected $casts = [
        'reviewed_date' => 'datetime',
        'scheduled_date' => 'date',
    ];

    // Relationships
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function evaluation()
    {
        return $this->belongsTo(Evaluation::class);
    }

    public function principal()
    {
        return $this->belongsTo(Principal::class);
    }

    public function newEvaluation()
    {
        return $this->belongsTo(Evaluation::class, 'new_evaluation_id');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }
}
