<?php

namespace App\Services\Figma;

use Illuminate\Support\Facades\Http;

class FigmaClient
{
    private const BASE_URL = 'https://api.figma.com/v1';

    public function __construct(
        private readonly string $token,
    ) {
    }

    /**
     * Нормализует node-id из формата "4-13" в формат API "4:13".
     */
    public static function normalizeNodeId(string $nodeId): string
    {
        return str_replace('-', ':', $nodeId);
    }

    /**
     * GET /files/{key}
     *
     * @return array{name?: string, document?: array, err?: string, status?: int}
     */
    public function getFile(string $fileKey): array
    {
        $response = $this->request('get', "/files/{$fileKey}");

        if ($response->failed()) {
            $this->throwFromResponse($response, 'getFile');
        }

        return $response->json() ?? [];
    }

    /**
     * GET /files/{key}/nodes?ids=...
     *
     * @param  array<int, string>|string  $nodeIds  e.g. ["4-13"] or "4-13"
     * @return array{nodes?: array, err?: string, status?: int}
     */
    public function getNode(string $fileKey, array|string $nodeIds): array
    {
        $ids = is_array($nodeIds) ? $nodeIds : [$nodeIds];
        $ids = array_map(self::class . '::normalizeNodeId', $ids);
        $idsStr = implode(',', $ids);

        $response = $this->request('get', "/files/{$fileKey}/nodes", [
            'ids' => $idsStr,
        ]);

        if ($response->failed()) {
            $this->throwFromResponse($response, 'getNode');
        }

        return $response->json() ?? [];
    }

    /**
     * GET /images/{key}?ids=...&format=...&scale=...
     * Возвращает массив [nodeId => imageUrl] (nodeId в формате "4:13").
     *
     * @param  array<int, string>  $nodeIds  не пустой
     * @param  'png'|'svg'  $format
     * @param  float  $scale  1..4
     * @return array<string, string>  nodeId (with colon) => url
     */
    public function exportImages(string $fileKey, array $nodeIds, string $format = 'png', float $scale = 2): array
    {
        if (empty($nodeIds)) {
            throw new \InvalidArgumentException('nodeIds must not be empty');
        }

        $allowedFormats = ['png', 'svg', 'jpg'];
        if (! in_array(strtolower($format), $allowedFormats, true)) {
            throw new \InvalidArgumentException("format must be one of: " . implode(', ', $allowedFormats));
        }

        if ($scale < 1 || $scale > 4) {
            throw new \InvalidArgumentException('scale must be between 1 and 4');
        }

        $ids = array_map(self::class . '::normalizeNodeId', $nodeIds);
        $idsStr = implode(',', $ids);

        $response = $this->request('get', "/images/{$fileKey}", [
            'ids' => $idsStr,
            'format' => strtolower($format),
            'scale' => $scale,
        ]);

        if ($response->failed()) {
            $this->throwFromResponse($response, 'exportImages');
        }

        $body = $response->json();
        $images = $body['images'] ?? [];

        return is_array($images) ? $images : [];
    }

    private function request(string $method, string $path, array $query = []): \Illuminate\Http\Client\Response
    {
        $url = self::BASE_URL . $path;

        return Http::withHeaders(['X-Figma-Token' => $this->token])
            ->timeout(30)
            ->{$method}($url, $method === 'get' ? $query : []);
    }

    /**
     * @throws FigmaApiException
     */
    private function throwFromResponse(\Illuminate\Http\Client\Response $response, string $context): void
    {
        $status = $response->status();
        $body = $response->json();
        $message = $body['err'] ?? $body['message'] ?? $response->body() ?: 'Unknown error';
        throw new FigmaApiException($message, $status, $context);
    }
}
