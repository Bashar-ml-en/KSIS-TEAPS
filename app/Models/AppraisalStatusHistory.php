<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppraisalStatusHistory extends Model
{
    public $timestamps = false; // Using custom timestamp field
    
    protected $table = 'appraisal_status_history';

    protected $fillable = [
        'annual_appraisal_id',
        'from_status',
        'to_status',
        'actor_id',
        'actor_role',
        'comment',
        'metadata',
        'transitioned_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'transitioned_at' => 'datetime',
    ];

    // Relationships
    public function appraisal()
    {
        return $this->belongsTo(AnnualAppraisal::class, 'annual_appraisal_id');
    }

    public function actor()
    {
        return $this->belongsTo(User::class, 'actor_id');
    }
}
