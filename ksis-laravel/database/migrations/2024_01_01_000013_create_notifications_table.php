<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', [
                'registration_approved',
                'registration_rejected',
                'kpi_approved',
                'kpi_rejected',
                'reevaluation_approved',
                'reevaluation_rejected',
                'observation_scheduled',
                'feedback_received',
                'evaluation_completed',
                'report_ready',
                'general'
            ]);
            $table->string('title');
            $table->text('message');
            $table->json('data')->nullable(); // Additional metadata
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            $table->string('link')->nullable(); // Link to related resource
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('user_id');
            $table->index('type');
            $table->index('is_read');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};