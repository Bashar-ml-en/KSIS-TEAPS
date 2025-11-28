<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Department extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'description',
        'total_teachers',
        'is_active',
        'parent_id',
        'principal_id',
        'category',
        'level',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'total_teachers' => 'integer',
        'level' => 'integer',
    ];

    // Hierarchy Relationships
    public function parent()
    {
        return $this->belongsTo(Department::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Department::class, 'parent_id');
    }

    public function principal()
    {
        return $this->belongsTo(Principal::class);
    }

    // Other Relationships
    public function teachers()
    {
        return $this->hasMany(Teacher::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeMainDepartments($query)
    {
        return $query->where('level', 0)->whereNull('parent_id');
    }

    public function scopeSubDepartments($query)
    {
        return $query->where('level', 1)->whereNotNull('parent_id');
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    // Helper Methods
    public function isMainDepartment()
    {
        return $this->level === 0 && $this->parent_id === null;
    }

    public function isSubDepartment()
    {
        return $this->level === 1 && $this->parent_id !== null;
    }
}
