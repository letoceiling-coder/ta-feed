<?php

namespace App\Providers;

use App\Services\Figma\FigmaClient;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(FigmaClient::class, function () {
            $token = config('services.figma.token');
            if (empty($token)) {
                throw new \RuntimeException('FIGMA_TOKEN is not set in .env');
            }

            return new FigmaClient($token);
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
