<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mycpe_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('teacher_id')->constrained()->onDelete('cascade');
            $table->string('course_title');
            $table->date('date_attended');
            $table->time('duration_hours'); // Store as time (HH:MM:SS)
            $table->integer('cpe_points')->comment('1 hour = 1 CPE point');
            $table->string('location')->nullable();
            $table->string('provider')->nullable();
            $table->text('description')->nullable();
            $table->string('certificate_path')->nullable(); // File upload path
            $table->enum('status', ['completed', 'pending', 'rejected'])->default('completed');
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('teacher_id');
            $table->index('date_attended');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mycpe_records');
    }
};