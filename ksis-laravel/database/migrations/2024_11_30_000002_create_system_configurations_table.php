<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('system_configurations', function (Blueprint $table) {
            $table->id();
            $table->string('key')->index(); // e.g., 'appraisal_rubric', 'five_as_framework'
            $table->json('value'); // The actual configuration data
            $table->integer('version')->default(1);
            $table->boolean('is_active')->default(true);
            $table->string('description')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->timestamps();

            // Ensure only one active version per key
            // We can't enforce this with a unique index easily if we want history, 
            // but we can index key+version to be unique
            $table->unique(['key', 'version']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_configurations');
    }
};
