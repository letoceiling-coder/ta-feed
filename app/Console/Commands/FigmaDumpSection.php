<?php

namespace App\Console\Commands;

use App\Services\Figma\FigmaApiException;
use App\Services\Figma\FigmaClient;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class FigmaDumpSection extends Command
{
    protected $signature = 'figma:dump-section
                            {--output= : Path to output JSON (default: frontend/src/data/figma-section-4-13.json)}';

    protected $description = 'Fetch Figma node 4-13 and save to JSON for pixel-perfect implementation';

    public function handle(): int
    {
        if (! config('services.figma.token')) {
            $this->error('FIGMA_TOKEN not set in .env');
            return self::FAILURE;
        }

        $fileKey = config('services.figma.file_key');
        if (! $fileKey) {
            $this->error('FIGMA_FILE_KEY not set in .env');
            return self::FAILURE;
        }

        $outputPath = $this->option('output') ?? base_path('frontend/src/data/figma-section-4-13.json');

        try {
            $figma = app(FigmaClient::class);
        } catch (\Throwable $e) {
            $this->error($e->getMessage());
            return self::FAILURE;
        }

        $this->info('Fetching file info and node 4-13...');

        try {
            $file = $figma->getFile($fileKey);
            $nodes = $figma->getNode($fileKey, '4-13');
        } catch (FigmaApiException $e) {
            $this->error('Figma API: ' . $e->getMessage());
            return self::FAILURE;
        } catch (\Throwable $e) {
            $this->error($e->getMessage());
            return self::FAILURE;
        }

        $data = [
            'file' => [
                'name' => $file['name'] ?? null,
                'lastModified' => $file['lastModified'] ?? null,
            ],
            'nodeId' => '4-13',
            'nodes' => $nodes,
            'exportedAt' => now()->toIso8601String(),
        ];

        $dir = dirname($outputPath);
        if (! File::isDirectory($dir)) {
            File::makeDirectory($dir, 0755, true);
        }

        File::put($outputPath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        $this->info("Saved to: {$outputPath}");
        return self::SUCCESS;
    }
}
