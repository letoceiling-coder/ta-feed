<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SpaController;

// API routes (if any)
Route::prefix('api')->group(function () {
    // Add your API routes here
});

// SPA routes - all frontend routes should return the SPA view
Route::get('/{any}', [SpaController::class, 'index'])->where('any', '.*');
