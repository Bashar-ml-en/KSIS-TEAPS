<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kpis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('kpi_title');
            $table->text('kpi_description');
            $table->enum('category', [
                'Teaching Load',
                'Curriculum Content',
                'Student Outcome',
                'Classroom Management',
                'Co-curricular',
                'School Service',
                'Community Service',
                'Professional Development',
                'Custom'
            ]);
            $table->string('target_value')->nullable();
            $table->string('current_value')->nullable();
            $table->integer('progress_percentage')->default(0);
            $table->text('measurement_criteria')->nullable();
            $table->integer('weight')->default(1); // For weighted scoring
            $table->enum('type', ['institutional', 'custom'])->default('institutional');
            $table->enum('status', ['active', 'completed', 'cancelled'])->default('active');
            $table->date('start_date')->nullable();
            $table->date('target_date')->nullable();
            $table->date('completion_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes for performance
            $table->index('teacher_id');
            $table->index('category');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kpis');
    }
};