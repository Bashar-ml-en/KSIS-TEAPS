<?php

use App\Models\Department;

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Create a default department if none exists
$dept = Department::first();
if (!$dept) {
    $dept = Department::create([
        'name' => 'General Education',
        'code' => 'GEN',
        'description' => 'General Education Department'
    ]);
    echo "✅ Created default department: General Education (ID: {$dept->id})\n";
} else {
    echo "ℹ️  Department already exists: {$dept->name} (ID: {$dept->id})\n";
}
