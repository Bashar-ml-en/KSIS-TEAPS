<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reevaluation_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->foreignId('evaluation_id')->constrained()->onDelete('cascade');
            $table->text('reason');
            $table->text('supporting_evidence')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected', 'completed'])->default('pending');
            $table->foreignId('principal_id')->nullable()->constrained()->onDelete('set null');
            $table->text('principal_response')->nullable();
            $table->timestamp('reviewed_date')->nullable();
            $table->date('scheduled_date')->nullable();
            $table->foreignId('new_evaluation_id')->nullable()->constrained('evaluations')->onDelete('set null');
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('teacher_id');
            $table->index('evaluation_id');
            $table->index('principal_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reevaluation_requests');
    }
};