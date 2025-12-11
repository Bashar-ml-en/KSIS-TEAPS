<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// Explicitly handle the root URL
Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

// Handle all other routes (except API)
Route::get('/{any}', function () {
    $path = public_path('app/index.html');
    
    if (!File::exists($path)) {
        return "React app not found at: " . $path;
    }

    return File::get($path);
})->where('any', '^(?!api).*$');
