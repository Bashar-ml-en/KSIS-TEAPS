<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Auth;

class AuditService
{
    /**
     * Log an action in the system.
     *
     * @param string $action The action performed (e.g., 'create', 'update', 'login')
     * @param string $module The module affected (e.g., 'kpi', 'user', 'auth')
     * @param string|int|null $targetId The ID of the affected record
     * @param string|null $description Human-readable description
     * @param array|null $oldValues Previous state of the record (for updates)
     * @param array|null $newValues New state of the record
     * @return AuditLog
     */
    public function log(
        string $action,
        string $module,
        $targetId = null,
        ?string $description = null,
        ?array $oldValues = null,
        ?array $newValues = null
    ): AuditLog {
        return AuditLog::create([
            'user_id' => Auth::id(), // Records who did it, or null if system/guest
            'action' => $action,
            'module' => $module,
            'target_id' => (string) $targetId,
            'description' => $description,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => Request::ip(),
            'user_agent' => Request::userAgent(),
        ]);
    }
}
