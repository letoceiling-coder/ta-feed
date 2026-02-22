<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FeedService
{
    private string $baseUrl = 'https://dataout.trendagent.ru';
    private string $region = 'msk';

    public function __construct(?string $region = null)
    {
        if ($region) {
            $this->region = $region;
        }
    }

    /**
     * Получить список всех доступных фидов
     */
    public function getAbout(): ?array
    {
        try {
            $response = Http::timeout(30)->get("{$this->baseUrl}/{$this->region}/about.json");
            
            if ($response->successful()) {
                $data = $response->json();
                if (json_last_error() !== JSON_ERROR_NONE) {
                    Log::error("JSON decode error in about.json", [
                        'error' => json_last_error_msg()
                    ]);
                    return null;
                }
                return $data;
            }
            
            $status = $response->status();
            $body = $response->body();
            
            Log::error("Failed to fetch about.json", [
                'status' => $status,
                'body' => substr($body, 0, 500)
            ]);
            
            if ($status === 403) {
                throw new \Exception("Доступ запрещен (403). Запросы должны выполняться с сервера, IP которого добавлен в белый список.");
            }
            
            return null;
        } catch (\Exception $e) {
            Log::error("Exception while fetching about.json", [
                'message' => $e->getMessage()
            ]);
            throw $e;
        }
    }

    /**
     * Получить данные по ЖК (blocks)
     */
    public function getBlocks(): ?array
    {
        return $this->fetchFeed("{$this->baseUrl}/{$this->region}/blocks.json");
    }

    /**
     * Получить данные по застройщикам
     */
    public function getBuilders(): ?array
    {
        return $this->fetchFeed("{$this->baseUrl}/{$this->region}/builders.json");
    }

    /**
     * Получить данные по регионам
     */
    public function getRegions(): ?array
    {
        return $this->fetchFeed("{$this->baseUrl}/{$this->region}/regions.json");
    }

    /**
     * Получить данные по метро
     */
    public function getSubways(): ?array
    {
        return $this->fetchFeed("{$this->baseUrl}/{$this->region}/subways.json");
    }

    /**
     * Получить данные по корпусам
     */
    public function getBuildings(): ?array
    {
        return $this->fetchFeed("{$this->baseUrl}/{$this->region}/buildings.json");
    }

    /**
     * Получить данные по квартирам
     */
    public function getApartments(): ?array
    {
        return $this->fetchFeed("{$this->baseUrl}/{$this->region}/apartments.json");
    }

    /**
     * Получить данные по комнатности
     */
    public function getRooms(): ?array
    {
        return $this->fetchFeed("{$this->baseUrl}/{$this->region}/room.json");
    }

    /**
     * Получить данные по отделке
     */
    public function getFinishings(): ?array
    {
        return $this->fetchFeed("{$this->baseUrl}/{$this->region}/finishings.json");
    }

    /**
     * Получить данные по технологиям строительства
     */
    public function getBuildingTypes(): ?array
    {
        return $this->fetchFeed("{$this->baseUrl}/{$this->region}/buildingtypes.json");
    }

    /**
     * Универсальный метод для получения данных из фида
     */
    private function fetchFeed(string $url): ?array
    {
        try {
            $response = Http::timeout(300)->get($url); // Увеличиваем таймаут до 5 минут для больших файлов
            
            if ($response->successful()) {
                $data = $response->json();
                if (json_last_error() !== JSON_ERROR_NONE) {
                    Log::error("JSON decode error", [
                        'url' => $url,
                        'error' => json_last_error_msg()
                    ]);
                    return null;
                }
                return $data;
            }
            
            $status = $response->status();
            $body = $response->body();
            
            Log::error("Failed to fetch feed", [
                'url' => $url,
                'status' => $status,
                'body' => substr($body, 0, 500) // Ограничиваем длину для логов
            ]);
            
            // Если 403 - это ограничение по IP
            if ($status === 403) {
                throw new \Exception("Доступ запрещен (403). Запросы должны выполняться с сервера, IP которого добавлен в белый список.");
            }
            
            return null;
        } catch (\Exception $e) {
            Log::error("Exception while fetching feed", [
                'url' => $url,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e; // Пробрасываем исключение для лучшей диагностики
        }
    }

    /**
     * Сохранить ответ в файл
     */
    public function saveResponse(string $filename, array $data): bool
    {
        $path = storage_path("app/feeds/{$this->region}");
        
        if (!is_dir($path)) {
            mkdir($path, 0755, true);
        }
        
        $filePath = "{$path}/{$filename}";
        
        return file_put_contents($filePath, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT)) !== false;
    }
}
