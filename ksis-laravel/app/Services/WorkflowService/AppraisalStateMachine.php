<?php

namespace App\Services\WorkflowService;

use App\Models\AnnualAppraisal;
use App\Models\KpiRequest;
use App\Models\MycpeRecord;
use Exception;

class AppraisalStateMachine
{
    /**
     * Valid workflow states
     */
    const STATE_DRAFT = 'draft';
    const STATE_KPI_PROPOSAL = 'kpi_proposal';
    const STATE_PENDING_FEO = 'pending_feo';
    const STATE_UNDER_REVISION = 'under_revision';  // FEO/Teacher revising
    const STATE_DISPUTED = 'disputed';
    const STATE_PENDING_PRINCIPAL = 'pending_principal';
    const STATE_REVISION_REQUIRED = 'revision_required';  // Principal sent back for revision
    const STATE_PENDING_HR = 'pending_hr';
    const STATE_COMPLETED = 'completed';

    /**
     * Get all valid states
     */
    public static function getStates(): array
    {
        return [
            self::STATE_DRAFT,
            self::STATE_KPI_PROPOSAL,
            self::STATE_PENDING_FEO,
            self::STATE_UNDER_REVISION,
            self::STATE_DISPUTED,
            self::STATE_PENDING_PRINCIPAL,
            self::STATE_REVISION_REQUIRED,
            self::STATE_PENDING_HR,
            self::STATE_COMPLETED,
        ];
    }

    /**
     * Validate if a state transition is allowed
     */
    public function canTransition(AnnualAppraisal $appraisal, string $toState): bool
    {
        $fromState = $appraisal->status;
        
        $allowedTransitions = $this->getAllowedTransitions();
        
        if (!isset($allowedTransitions[$fromState])) {
            return false;
        }
        
        return in_array($toState, $allowedTransitions[$fromState]);
    }

    /**
     * Transition appraisal to new state with validation and guards
     */
    public function transition(AnnualAppraisal $appraisal, string $toState, array $data = []): bool
    {
        $fromState = $appraisal->status;
        
        // Check if transition is allowed
        if (!$this->canTransition($appraisal, $toState)) {
            throw new Exception("Cannot transition from {$fromState} to {$toState}");
        }
        
        // Run guard checks
        $guardMethod = 'guard' . ucfirst($this->camelize($toState));
        if (method_exists($this, $guardMethod)) {
            if (!$this->$guardMethod($appraisal, $data)) {
                throw new Exception("Guard check failed for transition to {$toState}");
            }
        }
        
        // Update status
        $appraisal->status = $toState;
        $appraisal->save();
        
        // Log transition in history
        $this->logTransition($appraisal, $fromState, $toState, $data);
        
        // Run after hooks
        $afterMethod = 'after' . ucfirst($this->camelize($toState));
        if (method_exists($this, $afterMethod)) {
            $this->$afterMethod($appraisal, $data);
        }
        
        return true;
    }

    /**
     * Get allowed transitions from current state
     */
    private function getAllowedTransitions(): array
    {
        return [
            self::STATE_DRAFT => [self::STATE_KPI_PROPOSAL],
            self::STATE_KPI_PROPOSAL => [self::STATE_PENDING_FEO],
            self::STATE_PENDING_FEO => [
                self::STATE_PENDING_PRINCIPAL, 
                self::STATE_DISPUTED,
                self::STATE_UNDER_REVISION,  // FEO can send back for teacher revision
            ],
            self::STATE_UNDER_REVISION => [self::STATE_PENDING_FEO],  // Back to FEO after revision
            self::STATE_DISPUTED => [self::STATE_PENDING_PRINCIPAL],
            self::STATE_PENDING_PRINCIPAL => [
                self::STATE_PENDING_HR, 
                self::STATE_DISPUTED,
                self::STATE_REVISION_REQUIRED,  // Principal returns for revision
            ],
            self::STATE_REVISION_REQUIRED => [self::STATE_PENDING_PRINCIPAL],  // Back to Principal after revision
            self::STATE_PENDING_HR => [self::STATE_COMPLETED],
            self::STATE_COMPLETED => [], // No transitions from completed
        ];
    }

    /**
     * Guard: Check if teacher has completed self-evaluation
     */
    protected function guardKpiProposal(AnnualAppraisal $appraisal, array $data): bool
    {
        // Teacher must complete self-evaluation sections
        return !empty($appraisal->self_strengths) && 
               !empty($appraisal->self_areas_for_improvement);
    }

    /**
     * Guard: Check if all KPIs are approved by FEO
     */
    protected function guardPendingFeo(AnnualAppraisal $appraisal, array $data): bool
    {
        // All KPI requests must be approved or rejected (not pending)
        $pendingKPIs = KpiRequest::where('teacher_id', $appraisal->teacher_id)
            ->where('status', 'pending')
            ->count();
        
        return $pendingKPIs === 0;
    }

    /**
     * Guard: Check if FEO has completed scoring
     */
    protected function guardPendingPrincipal(AnnualAppraisal $appraisal, array $data): bool
    {
        // FEO must have entered scores for core criteria
        return !is_null($appraisal->curriculum_content_score) &&
               !is_null($appraisal->student_outcome_score);
    }

    /**
     * Guard: Check if Principal has provided comments
     */
    protected function guardPendingHr(AnnualAppraisal $appraisal, array $data): bool
    {
        // Principal must provide overall comment
        return !empty($appraisal->principal_overall_comment);
    }

    /**
     * Guard: Check CPE compliance before completion
     */
    protected function guardCompleted(AnnualAppraisal $appraisal, array $data): bool
    {
        // HR must provide comment
        if (empty($appraisal->hr_overall_comment)) {
            return false;
        }
        
        // Check CPE compliance (minimum 40 points)
        $totalCPE = MycpeRecord::where('teacher_id', $appraisal->teacher_id)
            ->where('status', 'approved')
            ->whereYear('date_attended', $appraisal->appraisal_year)
            ->sum('cpe_points');
        
        return $totalCPE >= 40;
    }

    /**
     * After hook: Calculate scores when moving to pending_principal
     */
    protected function afterPendingPrincipal(AnnualAppraisal $appraisal, array $data): void
    {
        // Trigger scoring service calculation
        $scoringService = new \App\Services\ScoringService\WeightedScoreCalculator();
        
        try {
            $scores = $scoringService->calculateFinalScore($appraisal);
            
            $appraisal->update([
                'part_2_score' => $scores['part_2_raw_score'],
                'part_3_score' => $scores['part_3_raw_score'],
                'cpe_score' => $scores['cpe_raw_score'],
                'final_weighted_score' => $scores['final_weighted_score'],
                'calculated_at' => now(),
            ]);
        } catch (Exception $e) {
            \Log::error('Score calculation failed', [
                'appraisal_id' => $appraisal->id,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * After hook: Lock record when completed
     */
    protected function afterCompleted(AnnualAppraisal $appraisal, array $data): void
    {
        // Mark appraisal as locked (readonly)
        $appraisal->update([
            'completed_at' => now(),
            'is_locked' => true,
        ]);
    }

    /**
     * Log transition to history table
     */
    private function logTransition(AnnualAppraisal $appraisal, string $fromState, string $toState, array $data): void
    {
        // Log to database
        \App\Models\AppraisalStatusHistory::create([
            'annual_appraisal_id' => $appraisal->id,
            'from_status' => $fromState,
            'to_status' => $toState,
            'actor_id' => auth()->id(),
            'actor_role' => auth()->user()?->role,
            'comment' => $data['comment'] ?? null,
            'metadata' => $data,
            'transitioned_at' => now(),
        ]);
        
        // Also log to Laravel log for backup
        \Log::info('Appraisal status transition', [
            'appraisal_id' => $appraisal->id,
            'teacher_id' => $appraisal->teacher_id,
            'from_state' => $fromState,
            'to_state' => $toState,
            'actor_id' => auth()->id(),
            'timestamp' => now()
        ]);
    }

    /**
     * Convert snake_case to camelCase
     */
    private function camelize(string $string): string
    {
        return str_replace('_', '', ucwords($string, '_'));
    }

    /**
     * Get next possible states from current state
     */
    public function getNextStates(AnnualAppraisal $appraisal): array
    {
        $transitions = $this->getAllowedTransitions();
        return $transitions[$appraisal->status] ?? [];
    }
}
