<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kpi_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->string('kpi_title');
            $table->text('kpi_description');
            $table->text('justification');
            $table->string('category');
            $table->string('target_value')->nullable();
            $table->text('measurement_criteria')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->foreignId('principal_id')->nullable()->constrained()->onDelete('set null');
            $table->text('principal_comments')->nullable();
            $table->timestamp('reviewed_date')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('teacher_id');
            $table->index('principal_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kpi_requests');
    }
};