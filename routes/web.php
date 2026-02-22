<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SpaController;

// API routes
Route::prefix('api')->group(function () {
    // Add your API routes here
});

// Frontend routes - все маршруты возвращают React приложение
Route::get('/{any?}', [SpaController::class, 'index'])->where('any', '.*');
