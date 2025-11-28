<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('classroom_observations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->foreignId('principal_id')->constrained()->onDelete('cascade');
            $table->date('observation_date');
            $table->string('subject', 100)->nullable();
            $table->string('grade_level', 50)->nullable();
            $table->string('lesson_topic')->nullable();
            
            // 9-section rubric scores (matching KSIS rubric)
            $table->integer('introduction_score')->nullable()->comment('Max: 5');
            $table->integer('content_score')->nullable()->comment('Max: 20');
            $table->integer('engagement_score')->nullable()->comment('Max: 15');
            $table->integer('lesson_flow_score')->nullable()->comment('Max: 10');
            $table->integer('enrichment_tools_score')->nullable()->comment('Max: 10');
            $table->integer('individual_care_score')->nullable()->comment('Max: 10');
            $table->integer('assessment_score')->nullable()->comment('Max: 10');
            $table->integer('classroom_mgmt_score')->nullable()->comment('Max: 10');
            $table->integer('conclusion_score')->nullable()->comment('Max: 5');
            
            // Auto-calculated total (sum of all scores, max 100)
            $table->integer('total_score')->nullable()->storedAs(
                'COALESCE(introduction_score, 0) + 
                 COALESCE(content_score, 0) + 
                 COALESCE(engagement_score, 0) + 
                 COALESCE(lesson_flow_score, 0) + 
                 COALESCE(enrichment_tools_score, 0) + 
                 COALESCE(individual_care_score, 0) + 
                 COALESCE(assessment_score, 0) + 
                 COALESCE(classroom_mgmt_score, 0) + 
                 COALESCE(conclusion_score, 0)'
            );
            
            $table->text('observation_notes')->nullable();
            $table->enum('status', ['draft', 'submitted', 'reviewed'])->default('draft');
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('teacher_id');
            $table->index('principal_id');
            $table->index('observation_date');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('classroom_observations');
    }
};