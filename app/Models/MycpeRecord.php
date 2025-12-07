<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MycpeRecord extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'teacher_id',
        'course_title',
        'date_attended',
        'duration_hours',
        'cpe_points',
        'location',
        'provider',
        'description',
        'certificate_path',
        'status',
    ];

    protected $casts = [
        'date_attended' => 'date',
        'cpe_points' => 'integer',
    ];

    // Relationships
    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }

    // Scopes
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeByYear($query, $year)
    {
        return $query->whereYear('date_attended', $year);
    }
}
