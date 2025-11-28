<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            // Hierarchy fields
            $table->foreignId('parent_id')->nullable()->after('id')->constrained('departments')->nullOnDelete();
            $table->foreignId('principal_id')->nullable()->after('parent_id')->constrained('principals')->nullOnDelete();
            
            // Category: curriculum, student_affairs, co_curriculum
            $table->enum('category', ['curriculum', 'student_affairs', 'co_curriculum'])->nullable()->after('code');
            
            // Level: 0 = main department, 1 = sub-department
            $table->integer('level')->default(0)->after('category');
            
            // Add index for faster hierarchy queries
            $table->index('parent_id');
            $table->index('principal_id');
        });
    }

    public function down(): void
    {
        Schema::table('departments', function (Blueprint $table) {
            $table->dropForeign(['parent_id']);
            $table->dropForeign(['principal_id']);
            $table->dropIndex(['parent_id']);
            $table->dropIndex(['principal_id']);
            $table->dropColumn(['parent_id', 'principal_id', 'category', 'level']);
        });
    }
};
