<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->foreignId('principal_id')->constrained()->onDelete('cascade');
            $table->string('evaluation_period', 50); // e.g., "Q1 2025", "Annual 2025"
            $table->enum('evaluation_type', [
                'classroom_observation',
                'annual_appraisal',
                'quarterly_review',
                'probation_review'
            ]);
            
            // Links to detailed forms
            $table->foreignId('observation_id')->nullable()->constrained('classroom_observations')->onDelete('set null');
            $table->foreignId('appraisal_id')->nullable()->constrained('annual_appraisals')->onDelete('set null');
            
            // Weighted scoring (matching KSIS rubric)
            $table->decimal('core_responsibilities_score', 5, 2)->nullable()->comment('60% weight');
            $table->decimal('school_service_score', 5, 2)->nullable()->comment('20% weight');
            $table->decimal('mycpe_score', 5, 2)->nullable()->comment('20% weight');
            $table->decimal('personality_score', 5, 2)->nullable();
            $table->decimal('overall_score', 5, 2)->nullable();
            
            // Workflow status
            $table->enum('status', [
                'in_progress',
                'submitted_to_hr',
                'hr_reviewed',
                'approved',
                'rejected'
            ])->default('in_progress');
            
            $table->timestamp('principal_submitted_date')->nullable();
            $table->timestamp('hr_reviewed_date')->nullable();
            $table->foreignId('hr_admin_id')->nullable()->constrained('hr_admins')->onDelete('set null');
            
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('teacher_id');
            $table->index('principal_id');
            $table->index('evaluation_period');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evaluations');
    }
};