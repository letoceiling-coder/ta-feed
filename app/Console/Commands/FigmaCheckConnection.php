<?php

namespace App\Console\Commands;

use App\Services\Figma\FigmaApiException;
use App\Services\Figma\FigmaClient;
use Illuminate\Console\Command;
use Illuminate\Http\Client\ConnectionException;

class FigmaCheckConnection extends Command
{
    protected $signature = 'figma:check';

    protected $description = 'Check Figma API connection (token, file access, node 4-13)';

    public function handle(): int
    {
        if (! config('services.figma.token')) {
            $this->error('FIGMA_TOKEN is not set in .env');
            $this->line('Add: FIGMA_TOKEN=your_token');
            return self::FAILURE;
        }

        $fileKey = config('services.figma.file_key');
        if (! $fileKey) {
            $this->error('FIGMA_FILE_KEY is not set in .env');
            $this->line('Add: FIGMA_FILE_KEY=CRzpnYXL4h8ud0LXsAclqG');
            return self::FAILURE;
        }

        $this->info('Checking Figma connection...');
        $this->newLine();

        try {
            $figma = app(FigmaClient::class);
        } catch (\Throwable $e) {
            $this->error('Failed to create Figma client: ' . $e->getMessage());
            return self::FAILURE;
        }

        // 1. Get file
        $this->line('1. Loading file...');
        try {
            $file = $figma->getFile($fileKey);
            $name = $file['name'] ?? 'unknown';
            $this->info("   OK. File: {$name}");
        } catch (ConnectionException $e) {
            $this->error('   Connection failed: ' . $e->getMessage());
            if (str_contains($e->getMessage(), 'SSL certificate')) {
                $this->line('   → On Windows: set CA bundle or use PHP with updated certificates.');
                $this->line('   → On server (Linux) this usually works without changes.');
            }
            return self::FAILURE;
        } catch (FigmaApiException $e) {
            $this->error('   Failed: ' . $e->getMessage());
            $this->line('   Status: ' . $e->getStatusCode());
            if ($e->getStatusCode() === 403) {
                $this->line('   → Check that the token has access to this file and is not expired.');
            }
            if ($e->getStatusCode() === 401) {
                $this->line('   → Check FIGMA_TOKEN in .env.');
            }
            return self::FAILURE;
        }

        // 2. Get node 4-13
        $this->line('2. Loading node 4-13 (section frame)...');
        try {
            $nodes = $figma->getNode($fileKey, '4-13');
            $nodeKey = \App\Services\Figma\FigmaClient::normalizeNodeId('4-13');
            $node = $nodes['nodes'][$nodeKey] ?? $nodes['nodes']['4-13'] ?? null;
            if ($node && isset($node['document'])) {
                $docName = $node['document']['name'] ?? 'unnamed';
                $children = isset($node['document']['children']) ? count($node['document']['children']) : 0;
                $this->info("   OK. Node name: {$docName}, children: {$children}");
            } else {
                $this->warn('   Node 4-13 not found or empty.');
            }
        } catch (FigmaApiException $e) {
            $this->error('   Failed: ' . $e->getMessage());
            return self::FAILURE;
        }

        $this->newLine();
        $this->info('Figma connection is OK. You can run: php artisan figma:export-icons');

        return self::SUCCESS;
    }
}
