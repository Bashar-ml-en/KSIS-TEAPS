<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kpi extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'teacher_id',
        'kpi_title',
        'kpi_description',
        'category',
        'target_value',
        'current_value',
        'progress_percentage',
        'measurement_criteria',
        'weight',
        'type',
        'status',
        'start_date',
        'target_date',
        'completion_date',
        'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'target_date' => 'date',
        'completion_date' => 'date',
        'progress_percentage' => 'integer',
        'weight' => 'integer',
    ];

    // Relationships
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    // Accessors & Mutators
    public function getIsCompletedAttribute()
    {
        return $this->status === 'completed';
    }
}
