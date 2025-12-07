<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Add scoring fields and workflow fields to annual_appraisals table
     */
    public function up(): void
    {
        Schema::table('annual_appraisals', function (Blueprint $table) {
            // Check if columns exist before adding them
            if (!Schema::hasColumn('annual_appraisals', 'part_2_score')) {
                $table->decimal('part_2_score', 5, 2)->nullable()->after('status');
            }
            if (!Schema::hasColumn('annual_appraisals', 'part_3_score')) {
                $table->decimal('part_3_score', 5, 2)->nullable()->after('part_2_score');
            }
            if (!Schema::hasColumn('annual_appraisals', 'cpe_score')) {
                $table->decimal('cpe_score', 5, 2)->nullable()->after('part_3_score');
            }
            if (!Schema::hasColumn('annual_appraisals', 'final_weighted_score')) {
                $table->decimal('final_weighted_score', 5, 2)->nullable()->after('cpe_score');
            }
            if (!Schema::hasColumn('annual_appraisals', 'calculated_at')) {
                $table->timestamp('calculated_at')->nullable()->after('final_weighted_score');
            }
            
            // Workflow control fields
            if (!Schema::hasColumn('annual_appraisals', 'is_locked')) {
                $table->boolean('is_locked')->default(false)->after('calculated_at');
            }
            if (!Schema::hasColumn('annual_appraisals', 'completed_at')) {
                $table->timestamp('completed_at')->nullable()->after('is_locked');
            }
            
            // Principal override tracking
            if (!Schema::hasColumn('annual_appraisals', 'original_final_score')) {
                $table->decimal('original_final_score', 5, 2)->nullable()->after('completed_at');
            }
            if (!Schema::hasColumn('annual_appraisals', 'score_override_justification')) {
                $table->text('score_override_justification')->nullable()->after('original_final_score');
            }
            if (!Schema::hasColumn('annual_appraisals', 'score_overridden_at')) {
                $table->timestamp('score_overridden_at')->nullable()->after('score_override_justification');
            }
        });
        
        // Add indexes using raw SQL to handle duplicates
        DB::statement('CREATE INDEX IF NOT EXISTS annual_appraisals_status_index ON annual_appraisals (status)');
        DB::statement('CREATE INDEX IF NOT EXISTS annual_appraisals_teacher_id_appraisal_year_index ON annual_appraisals (teacher_id, appraisal_year)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('annual_appraisals', function (Blueprint $table) {
            $table->dropIndex(['status']);
            $table->dropIndex(['teacher_id', 'appraisal_year']);
            
            $table->dropColumn([
                'part_2_score',
                'part_3_score',
                'cpe_score',
                'final_weighted_score',
                'calculated_at',
                'is_locked',
                'completed_at',
                'original_final_score',
                'score_override_justification',
                'score_overridden_at',
            ]);
        });
    }
};
