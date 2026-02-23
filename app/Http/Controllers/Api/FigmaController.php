<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Figma\FigmaApiException;
use App\Services\Figma\FigmaClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FigmaController extends Controller
{
    public function __construct(
        private readonly FigmaClient $figma
    ) {
    }

    /**
     * GET /api/figma/file
     * Возвращает данные файла (имя документа и т.д.).
     */
    public function file(): JsonResponse
    {
        try {
            $fileKey = config('services.figma.file_key');
            if (! $fileKey) {
                return response()->json(['error' => 'FIGMA_FILE_KEY not configured'], 500);
            }

            $data = $this->figma->getFile($fileKey);

            if (isset($data['err'])) {
                return response()->json(['error' => $data['err']], $data['status'] ?? 500);
            }

            return response()->json($data);
        } catch (FigmaApiException $e) {
            return response()->json(
                ['error' => $e->getMessage()],
                $e->getStatusCode()
            );
        }
    }

    /**
     * GET /api/figma/nodes?ids=4-13 или ids[]=4-13
     * Возвращает узлы по id.
     */
    public function nodes(Request $request): JsonResponse
    {
        try {
            $fileKey = config('services.figma.file_key');
            if (! $fileKey) {
                return response()->json(['error' => 'FIGMA_FILE_KEY not configured'], 500);
            }

            $ids = $request->input('ids');
            if (is_string($ids)) {
                $ids = array_map('trim', explode(',', $ids));
            }
            if (! is_array($ids) || empty($ids)) {
                return response()->json(['error' => 'ids required (comma-separated or array)'], 422);
            }

            $data = $this->figma->getNode($fileKey, $ids);

            if (isset($data['err'])) {
                return response()->json(['error' => $data['err']], $data['status'] ?? 500);
            }

            return response()->json($data);
        } catch (FigmaApiException $e) {
            return response()->json(
                ['error' => $e->getMessage()],
                $e->getStatusCode()
            );
        }
    }

    /**
     * POST /api/figma/export
     * Body: ids (array|string), format ('png'|'svg'), scale (1..4).
     * Возвращает { nodeId: imageUrl }.
     */
    public function export(Request $request): JsonResponse
    {
        try {
            $fileKey = config('services.figma.file_key');
            if (! $fileKey) {
                return response()->json(['error' => 'FIGMA_FILE_KEY not configured'], 500);
            }

            $ids = $request->input('ids');
            if (is_string($ids)) {
                $ids = array_map('trim', explode(',', $ids));
            }
            if (! is_array($ids) || empty($ids)) {
                return response()->json(['error' => 'ids required (array or comma-separated)'], 422);
            }

            $format = $request->input('format', 'png');
            if (! in_array($format, ['png', 'svg'], true)) {
                return response()->json(['error' => 'format must be png or svg'], 422);
            }

            $scale = (float) $request->input('scale', 2);
            if ($scale < 1 || $scale > 4) {
                return response()->json(['error' => 'scale must be between 1 and 4'], 422);
            }

            $images = $this->figma->exportImages($fileKey, $ids, $format, $scale);

            return response()->json($images);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 422);
        } catch (FigmaApiException $e) {
            return response()->json(
                ['error' => $e->getMessage()],
                $e->getStatusCode()
            );
        }
    }
}
