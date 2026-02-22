<?php

namespace App\Console\Commands;

use App\Services\FeedService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class TestFeedStructure extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'feed:test {region=msk : Регион для тестирования}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Проверить структуру данных из фида и соответствие документации';

    private FeedService $feedService;

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $region = $this->argument('region');
        $this->feedService = new FeedService($region);

        $this->info("=== Тестирование структуры фида для региона: {$region} ===\n");

        // Тест 1: Проверка about.json
        $this->testAbout();

        // Тест 2: Проверка справочников
        $this->testReferenceData();

        // Тест 3: Проверка основных данных
        $this->testMainData();

        $this->info("\n=== Тестирование завершено ===");
    }

    private function testAbout(): void
    {
        $this->info("1. Проверка about.json...");
        
        $about = $this->feedService->getAbout();
        
        if (!$about) {
            $this->error("   ✗ Не удалось получить about.json (возможно, нет доступа по IP)");
            $this->warn("   → Запросы должны выполняться с сервера, IP которого добавлен в белый список");
            return;
        }

        $this->info("   ✓ about.json получен");
        
        if (!is_array($about)) {
            $this->error("   ✗ about.json должен быть массивом");
            return;
        }

        $this->info("   ✓ Структура: массив из " . count($about) . " элементов");

        // Проверяем наличие всех необходимых фидов
        $requiredFeeds = [
            'blocks' => 'Жилые комплексы',
            'builders' => 'Застройщики',
            'regions' => 'Районы',
            'subways' => 'Метро',
            'buildings' => 'Корпуса',
            'apartments' => 'Квартиры',
            'room' => 'Комнатность',
            'finishings' => 'Отделка',
            'buildingtypes' => 'Технология строительства',
        ];

        $foundFeeds = [];
        foreach ($about as $feed) {
            if (isset($feed['name'])) {
                $foundFeeds[$feed['name']] = $feed;
            }
        }

        $this->info("\n   Проверка наличия всех фидов:");
        foreach ($requiredFeeds as $name => $description) {
            if (isset($foundFeeds[$name])) {
                $this->info("   ✓ {$name} ({$description}) - найден");
                if (isset($foundFeeds[$name]['url'])) {
                    $this->line("      URL: {$foundFeeds[$name]['url']}");
                }
                if (isset($foundFeeds[$name]['exported_at'])) {
                    $this->line("      Обновлено: {$foundFeeds[$name]['exported_at']}");
                }
            } else {
                $this->error("   ✗ {$name} ({$description}) - не найден");
            }
        }
    }

    private function testReferenceData(): void
    {
        $this->info("\n2. Проверка справочников...");

        // Builders
        $this->testDataStructure('builders', $this->feedService->getBuilders(), [
            'id' => 'integer',
            'name' => 'string',
        ], 'Застройщики');

        // Regions
        $this->testDataStructure('regions', $this->feedService->getRegions(), [
            'id' => 'integer',
            'name' => 'string',
        ], 'Регионы');

        // Subways
        $this->testDataStructure('subways', $this->feedService->getSubways(), [
            'id' => 'integer',
            'name' => 'string',
        ], 'Метро');

        // Rooms
        $this->testDataStructure('room', $this->feedService->getRooms(), [
            'id' => 'integer',
            'name' => 'string',
            'value' => 'integer',
        ], 'Комнатность');

        // Finishings
        $this->testDataStructure('finishings', $this->feedService->getFinishings(), [
            'id' => 'integer',
            'name' => 'string',
        ], 'Отделка');

        // Building Types
        $this->testDataStructure('buildingtypes', $this->feedService->getBuildingTypes(), [
            'id' => 'integer',
            'name' => 'string',
        ], 'Технологии строительства');
    }

    private function testMainData(): void
    {
        $this->info("\n3. Проверка основных данных...");

        // Blocks
        $this->testBlocksStructure();

        // Buildings
        $this->testBuildingsStructure();

        // Apartments
        $this->testApartmentsStructure();
    }

    private function testBlocksStructure(): void
    {
        $this->info("\n   Проверка структуры Blocks (ЖК)...");
        
        $blocks = $this->feedService->getBlocks();
        
        if (!$blocks) {
            $this->error("   ✗ Не удалось получить blocks.json");
            return;
        }

        if (!is_array($blocks) || empty($blocks)) {
            $this->warn("   ⚠ blocks.json пуст или не является массивом");
            return;
        }

        $this->info("   ✓ Получено " . count($blocks) . " ЖК");

        // Проверяем структуру первого элемента
        $firstBlock = $blocks[0];
        
        $requiredFields = [
            'id' => 'ID ЖК',
            'name' => 'Название ЖК',
            'builder_id' => 'ID застройщика',
        ];

        $optionalFields = [
            'district' => 'ID региона (массив)',
            'locations' => 'ID локаций (массив)',
            'subway' => 'Метро (массив объектов)',
            'geometry' => 'Геометка ЖК',
            'renderer' => 'Рендеры ЖК',
            'progress' => 'Ход строительства',
            'plan' => 'Ген. план',
        ];

        $this->checkFields($firstBlock, $requiredFields, $optionalFields, 'Block');

        // Проверяем структуру subway
        if (isset($firstBlock['subway']) && is_array($firstBlock['subway'])) {
            $this->info("   → Проверка структуры subway:");
            if (!empty($firstBlock['subway'])) {
                $subwayItem = $firstBlock['subway'][0];
                $this->checkFields($subwayItem, [
                    'subway_id' => 'ID метро',
                ], [
                    'distance_time' => 'Расстояние в минутах',
                    'distance_type' => 'Тип расстояния (1-пешком, 2-транспортом)',
                ], 'Subway item');
            }
        }
    }

    private function testBuildingsStructure(): void
    {
        $this->info("\n   Проверка структуры Buildings (Корпуса)...");
        
        $buildings = $this->feedService->getBuildings();
        
        if (!$buildings) {
            $this->error("   ✗ Не удалось получить buildings.json");
            return;
        }

        if (!is_array($buildings) || empty($buildings)) {
            $this->warn("   ⚠ buildings.json пуст или не является массивом");
            return;
        }

        $this->info("   ✓ Получено " . count($buildings) . " корпусов");

        $firstBuilding = $buildings[0];

        $requiredFields = [
            'id' => 'ID корпуса',
            'block_id' => 'ID ЖК',
        ];

        $optionalFields = [
            'name' => 'Название корпуса',
            'queue' => 'Очередь',
            'address' => 'Адрес',
            'deadline' => 'Срок сдачи',
            'building_type' => 'ID технологии строительства',
            'mortgages' => 'ID ипотечных программ (массив)',
            'geometry' => 'Геометка корпуса',
        ];

        $this->checkFields($firstBuilding, $requiredFields, $optionalFields, 'Building');
    }

    private function testApartmentsStructure(): void
    {
        $this->info("\n   Проверка структуры Apartments (Квартиры)...");
        
        $apartments = $this->feedService->getApartments();
        
        if (!$apartments) {
            $this->error("   ✗ Не удалось получить apartments.json");
            return;
        }

        if (!is_array($apartments) || empty($apartments)) {
            $this->warn("   ⚠ apartments.json пуст или не является массивом");
            return;
        }

        $this->info("   ✓ Получено " . count($apartments) . " квартир");

        $firstApartment = $apartments[0];

        $requiredFields = [
            'id' => 'ID квартиры',
            'building_id' => 'ID корпуса',
        ];

        $optionalFields = [
            'area_given' => 'Приведённая площадь',
            'area_total' => 'Общая площадь',
            'area_rooms_total' => 'Жилая площадь',
            'finishing' => 'ID отделки',
            'floor' => 'Этаж',
            'floors' => 'Этажей в секции',
            'number' => 'Номер квартиры',
            'plan' => 'Планировка',
            'price' => 'Цена при 100% оплате',
            'price_base' => 'Базовая цена',
            'room' => 'ID комнатности',
        ];

        $this->checkFields($firstApartment, $requiredFields, $optionalFields, 'Apartment');
    }

    private function testDataStructure(string $name, ?array $data, array $expectedFields, string $description): void
    {
        if (!$data) {
            $this->error("   ✗ {$description} - не удалось получить данные");
            return;
        }

        if (!is_array($data)) {
            $this->error("   ✗ {$description} - данные не являются массивом");
            return;
        }

        $this->info("   ✓ {$description}: получено " . count($data) . " записей");

        if (empty($data)) {
            $this->warn("   ⚠ {$description} - массив пуст");
            return;
        }

        $firstItem = $data[0];
        $this->checkFields($firstItem, $expectedFields, [], $description);
    }

    private function checkFields(array $item, array $requiredFields, array $optionalFields, string $entityName): void
    {
        $this->line("      Проверка полей для {$entityName}:");

        // Проверка обязательных полей
        foreach ($requiredFields as $field => $description) {
            if (array_key_exists($field, $item)) {
                $value = $item[$field];
                $type = gettype($value);
                $this->info("      ✓ {$field} ({$description}): {$type}" . ($value !== null ? " = " . (is_array($value) ? 'массив[' . count($value) . ']' : (is_string($value) && strlen($value) > 50 ? substr($value, 0, 50) . '...' : $value)) : 'null'));
            } else {
                $this->error("      ✗ {$field} ({$description}) - отсутствует");
            }
        }

        // Проверка опциональных полей
        foreach ($optionalFields as $field => $description) {
            if (array_key_exists($field, $item)) {
                $value = $item[$field];
                $type = gettype($value);
                $displayValue = $value !== null 
                    ? (is_array($value) ? 'массив[' . count($value) . ']' : (is_string($value) && strlen($value) > 50 ? substr($value, 0, 50) . '...' : $value))
                    : 'null';
                $this->line("      → {$field} ({$description}): {$type} = {$displayValue}");
            } else {
                $this->line("      - {$field} ({$description}) - отсутствует (опционально)");
            }
        }
    }
}
