<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Add revision tracking fields to annual_appraisals table
     */
    public function up(): void
    {
        Schema::table('annual_appraisals', function (Blueprint $table) {
            // Check if columns don't exist before adding them
            if (!Schema::hasColumn('annual_appraisals', 'revision_reason')) {
                $table->text('revision_reason')->nullable()->after('score_override_justification');
            }
            if (!Schema::hasColumn('annual_appraisals', 'revision_comments')) {
                $table->text('revision_comments')->nullable()->after('revision_reason');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('annual_appraisals', function (Blueprint $table) {
            $table->dropColumn(['revision_reason', 'revision_comments']);
        });
    }
};
