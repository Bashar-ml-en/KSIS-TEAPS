<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Create audit trail table for appraisal status transitions
     */
    public function up(): void
    {
        Schema::create('appraisal_status_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('annual_appraisal_id')->constrained('annual_appraisals')->onDelete('cascade');
            $table->string('from_status', 50);
            $table->string('to_status', 50);
            $table->foreignId('actor_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('actor_role', 50)->nullable();
            $table->text('comment')->nullable();
            $table->json('metadata')->nullable(); // Additional data about the transition
            $table->timestamp('transitioned_at')->useCurrent();
            
            // Indexes
            $table->index('annual_appraisal_id');
            $table->index('to_status');
            $table->index('transitioned_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appraisal_status_history');
    }
};
