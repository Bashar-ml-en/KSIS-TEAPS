<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
// ... imports ...

Route::get('/test-route', function () {
    return 'API is working';
});

// ... rest of file ...
