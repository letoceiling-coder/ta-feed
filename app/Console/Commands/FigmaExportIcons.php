<?php

namespace App\Console\Commands;

use App\Services\Figma\FigmaApiException;
use App\Services\Figma\FigmaClient;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class FigmaExportIcons extends Command
{
    /**
     * Секция в Figma: node-id 4-13 (фрейм с карточками категорий).
     */
    private const SECTION_NODE_ID = '4-13';

    /**
     * Папка фронта — отдельная (Vite React). Иконки в src/assets/livegrid/.
     */
    private string $assetsPath;

    protected $signature = 'figma:export-icons
                            {--format=png : Export format: png or svg}
                            {--scale=2 : Scale 1..4}
                            {--ids= : Comma-separated node IDs to export (default: children of 4-13)}';

    protected $description = 'Export Figma section icons (node 4-13) to frontend/src/assets/livegrid/';

    public function __construct()
    {
        parent::__construct();
        $this->assetsPath = base_path('frontend/src/assets/livegrid');
    }

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

        $figma = app(FigmaClient::class);

        $format = $this->option('format');
        if (! in_array($format, ['png', 'svg'], true)) {
            $this->error('format must be png or svg');

            return self::FAILURE;
        }

        $scale = (float) $this->option('scale');
        if ($scale < 1 || $scale > 4) {
            $this->error('scale must be between 1 and 4');

            return self::FAILURE;
        }

        $customIds = $this->option('ids');
        $nodeIds = $customIds
            ? array_map('trim', explode(',', $customIds))
            : $this->collectNodeIdsFromSection($figma, $fileKey);

        if (empty($nodeIds)) {
            $this->warn('No node IDs to export. Check --ids or structure of node 4-13.');

            return self::FAILURE;
        }

        $this->info("Exporting " . count($nodeIds) . " nodes as {$format} (scale {$scale})...");

        try {
            $imageUrls = $figma->exportImages($fileKey, $nodeIds, $format, $scale);
        } catch (FigmaApiException $e) {
            $this->error("Figma API: [{$e->getStatusCode()}] {$e->getMessage()}");

            return self::FAILURE;
        } catch (\Throwable $e) {
            $this->error($e->getMessage());

            return self::FAILURE;
        }

        if (empty($imageUrls)) {
            $this->warn('Figma returned no image URLs.');

            return self::FAILURE;
        }

        if (! is_dir($this->assetsPath)) {
            if (! mkdir($this->assetsPath, 0755, true)) {
                $this->error("Cannot create directory: {$this->assetsPath}");

                return self::FAILURE;
            }
        }

        $table = [];
        foreach ($imageUrls as $nodeId => $url) {
            if (empty($url)) {
                $this->warn("Empty URL for node {$nodeId}, skip.");
                continue;
            }

            $filename = $this->nodeIdToFilename($nodeId) . '.' . $format;
            $savedPath = $this->downloadToFile($url, $filename);

            if ($savedPath !== null) {
                $table[] = [$nodeId, $savedPath];
            } else {
                $this->warn("Failed to download: {$nodeId}");
            }
        }

        if ($format === 'png') {
            $this->line('PNG export from Figma uses transparent background by default for supported layers.');
        }

        $this->table(['nodeId', 'saved path'], $table);
        $this->info('Done.');

        return self::SUCCESS;
    }

    /**
     * Получить список node id из секции 4-13 (дочерние узлы фрейма).
     *
     * @return array<int, string>
     */
    private function collectNodeIdsFromSection(FigmaClient $figma, string $fileKey): array
    {
        try {
            $data = $figma->getNode($fileKey, self::SECTION_NODE_ID);
        } catch (FigmaApiException $e) {
            $this->error("Could not load node 4-13: {$e->getMessage()}");

            return [];
        }

        $nodes = $data['nodes'] ?? [];
        $sectionNode = $nodes[FigmaClient::normalizeNodeId(self::SECTION_NODE_ID)] ?? null;
        if (! $sectionNode) {
            $sectionNode = $nodes[self::SECTION_NODE_ID] ?? null;
        }

        $document = $sectionNode['document'] ?? null;
        if (! $document) {
            return [];
        }

        // Только прямые дети фрейма (карточки категорий), без глубокой рекурсии
        $ids = [];
        foreach ($document['children'] ?? [] as $child) {
            if (is_array($child) && ! empty($child['id'])) {
                $ids[] = str_replace(':', '-', $child['id']);
            }
        }

        return $ids;
    }

    private function nodeIdToFilename(string $nodeId): string
    {
        $s = str_replace(':', '-', $nodeId);
        $s = preg_replace('/[^a-zA-Z0-9\-_]/', '_', $s);

        return strtolower($s) ?: 'node';
    }

    private function downloadToFile(string $url, string $filename): ?string
    {
        $response = Http::timeout(60)->get($url);

        if (! $response->successful()) {
            return null;
        }

        $path = $this->assetsPath . DIRECTORY_SEPARATOR . $filename;
        $bytes = file_put_contents($path, $response->body());

        return $bytes !== false ? $path : null;
    }
}
