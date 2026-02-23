<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SpaController;
use App\Http\Controllers\Api\FigmaController;

// API routes
Route::prefix('api')->group(function () {
    // Figma proxy (token only on server). Throttle: 30 requests per minute.
    Route::middleware('throttle:30,1')->prefix('figma')->group(function () {
        Route::get('file', [FigmaController::class, 'file']);
        Route::get('nodes', [FigmaController::class, 'nodes']);
        Route::post('export', [FigmaController::class, 'export']);
    });
});

// Frontend routes - все маршруты возвращают React приложение
Route::get('/{any?}', [SpaController::class, 'index'])->where('any', '.*');
