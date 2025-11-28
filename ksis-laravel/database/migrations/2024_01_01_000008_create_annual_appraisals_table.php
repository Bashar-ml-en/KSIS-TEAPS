<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('annual_appraisals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->year('appraisal_year');
            
            // Section 1: Core Responsibilities (60% weight)
            $table->integer('teaching_load_lessons_per_week')->nullable();
            $table->integer('curriculum_content_score')->nullable()->comment('1-10');
            $table->integer('aligned_curriculum_score')->nullable()->comment('1-10');
            $table->integer('student_outcome_score')->nullable()->comment('1-10');
            $table->integer('classroom_management_score')->nullable()->comment('1-10');
            $table->integer('marking_students_work_score')->nullable()->comment('1-10');
            
            // Section 2: School Service (20% weight)
            $table->integer('cocurricular_activities_score')->nullable()->comment('1-10');
            $table->integer('duties_other_tasks_score')->nullable()->comment('1-10');
            $table->integer('event_management_score')->nullable()->comment('1-10');
            $table->integer('other_responsibilities_score')->nullable()->comment('1-10');
            $table->integer('competition_score')->nullable()->comment('1-10');
            
            // Section 3: Community Service & 3-Zeros (separate tracking)
            $table->integer('community_quantity_score')->nullable()->comment('1-10');
            $table->integer('community_quality_score')->nullable()->comment('1-10');
            
            // Part 3: Personality & Work Culture
            $table->integer('management_skills_score')->nullable()->comment('1-10');
            $table->integer('resilience_score')->nullable()->comment('1-10');
            $table->integer('motivation_score')->nullable()->comment('1-10');
            $table->integer('compassion_score')->nullable()->comment('1-10');
            $table->integer('networking_communication_score')->nullable()->comment('1-10');
            $table->integer('core_values_score')->nullable()->comment('1-10');
            $table->integer('attendance_score')->nullable()->comment('1-10');
            
            // Self-assessment fields
            $table->text('self_strengths')->nullable();
            $table->text('self_areas_for_improvement')->nullable();
            $table->text('self_goals_next_period')->nullable();
            
            // Evaluator comments
            $table->text('principal_overall_comment')->nullable();
            $table->text('principal_career_advancement')->nullable();
            $table->text('hr_overall_comment')->nullable();
            $table->text('hr_career_advancement')->nullable();
            
            $table->enum('status', ['draft', 'submitted', 'approved'])->default('draft');
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('teacher_id');
            $table->index('appraisal_year');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('annual_appraisals');
    }
};