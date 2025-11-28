<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evaluation_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->enum('feedback_type', ['principal', 'hr']); // Only these two sources
            $table->foreignId('feedback_by')->constrained('users')->onDelete('cascade');
            $table->text('feedback_text');
            
            // NLP Analysis Results (populated by Django service)
            $table->decimal('sentiment_score', 3, 2)->nullable()->comment('Range: -1.00 to 1.00');
            $table->string('sentiment_label', 20)->nullable()->comment('positive, neutral, negative');
            $table->json('keywords')->nullable()->comment('Extracted keywords from NLP');
            $table->json('topics')->nullable()->comment('Identified topics');
            $table->json('entities')->nullable()->comment('Named entities');
            
            $table->boolean('is_analyzed')->default(false);
            $table->timestamp('analyzed_at')->nullable();
            
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('evaluation_id');
            $table->index('teacher_id');
            $table->index('feedback_type');
            $table->index('feedback_by');
            $table->index('is_analyzed');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feedback');
    }
};