<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Feedback extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'feedback';

    protected $fillable = [
        'evaluation_id',
        'teacher_id',
        'feedback_type',
        'feedback_by',
        'feedback_text',
        // NLP Analysis fields
        'sentiment_score',
        'sentiment_label',
        'keywords',
        'topics',
        'entities',
        'is_analyzed',
        'analyzed_at',
    ];

    protected $casts = [
        'sentiment_score' => 'decimal:2',
        'keywords' => 'array',
        'topics' => 'array',
        'entities' => 'array',
        'is_analyzed' => 'boolean',
        'analyzed_at' => 'datetime',
    ];

    // Relationships
    public function evaluation()
    {
        return $this->belongsTo(Evaluation::class);
    }

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    public function feedbackBy()
    {
        return $this->belongsTo(User::class, 'feedback_by');
    }

    // Scopes
    public function scopeAnalyzed($query)
    {
        return $query->where('is_analyzed', true);
    }

    public function scopeUnanalyzed($query)
    {
        return $query->where('is_analyzed', false);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('feedback_type', $type);
    }

    public function scopeBySentiment($query, $sentiment)
    {
        return $query->where('sentiment_label', $sentiment);
    }
}
