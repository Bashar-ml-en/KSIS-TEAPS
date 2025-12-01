<?php

namespace App\Observers;

use App\Models\MycpeRecord;

class MycpeRecordObserver
{
    /**
     * Enforce 1 Hour = 1 CPE Point rule on creation
     */
    public function creating(MycpeRecord $record): void
    {
        // Auto-calculate CPE points based on duration
        // Rule: 1 Hour = 1 CPE Point
        $record->cpe_points = $record->duration_hours * 1;
    }

    /**
     * Prevent manual override on update
     * Recalculate if duration changes
     */
    public function updating(MycpeRecord $record): void
    {
        // If duration changes, recalculate CPE points
        if ($record->isDirty('duration_hours')) {
            $record->cpe_points = $record->duration_hours * 1;
        }
        
        // If someone tries to manually change cpe_points without changing duration, reset it
        // This prevents manual manipulation of CPE points
        if ($record->isDirty('cpe_points') && !$record->isDirty('duration_hours')) {
            $original = $record->getOriginal('duration_hours');
            $record->cpe_points = $original * 1;
        }
    }

    /**
     * After saving, validate CPE points match the rule
     */
    public function saved(MycpeRecord $record): void
    {
        // Additional validation to ensure integrity
        $expectedPoints = $record->duration_hours * 1;
        
        if ($record->cpe_points != $expectedPoints) {
            // Log discrepancy for audit
            \Log::warning('CPE points mismatch', [
                'record_id' => $record->id,
                'duration_hours' => $record->duration_hours,
                'expected_points' => $expectedPoints,
                'actual_points' => $record->cpe_points
            ]);
        }
    }
}
