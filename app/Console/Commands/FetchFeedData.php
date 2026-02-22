<?php

namespace App\Console\Commands;

use App\Models\Apartment;
use App\Models\Block;
use App\Models\Builder;
use App\Models\Building;
use App\Models\BuildingType;
use App\Models\Finishing;
use App\Models\Location;
use App\Models\Mortgage;
use App\Models\Region;
use App\Models\Room;
use App\Models\Subway;
use App\Services\FeedService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class FetchFeedData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'feed:fetch {region=msk : Регион (msk, spb, krasnodar, nsk, rostov, kzn, ekb, crimea)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Загрузить данные из фида и сохранить в БД';

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

        $this->info("Начинаю загрузку данных для региона: {$region}");

        // Сохраняем все ответы в файлы
        $this->saveAllFeeds($region);

        // Загружаем справочники
        $this->loadReferenceData();

        // Загружаем основные данные
        $this->loadMainData();

        $this->info("Загрузка данных завершена!");
    }

    private function saveAllFeeds(string $region): void
    {
        $this->info("Сохраняю ответы API в файлы...");

        $feeds = [
            'about.json' => fn() => $this->feedService->getAbout(),
            'blocks.json' => fn() => $this->feedService->getBlocks(),
            'builders.json' => fn() => $this->feedService->getBuilders(),
            'regions.json' => fn() => $this->feedService->getRegions(),
            'subways.json' => fn() => $this->feedService->getSubways(),
            'buildings.json' => fn() => $this->feedService->getBuildings(),
            'apartments.json' => fn() => $this->feedService->getApartments(),
            'room.json' => fn() => $this->feedService->getRooms(),
            'finishings.json' => fn() => $this->feedService->getFinishings(),
            'buildingtypes.json' => fn() => $this->feedService->getBuildingTypes(),
        ];

        foreach ($feeds as $filename => $callback) {
            $this->info("Загружаю {$filename}...");
            $data = $callback();
            if ($data) {
                $this->feedService->saveResponse($filename, $data);
                $this->info("✓ {$filename} сохранен");
            } else {
                $this->warn("✗ Не удалось загрузить {$filename}");
            }
        }
    }

    private function loadReferenceData(): void
    {
        $this->info("Загружаю справочники...");

        // Застройщики
        $builders = $this->feedService->getBuilders();
        if ($builders) {
            $this->loadBuilders($builders);
        }

        // Регионы
        $regions = $this->feedService->getRegions();
        if ($regions) {
            $this->loadRegions($regions);
        }

        // Метро
        $subways = $this->feedService->getSubways();
        if ($subways) {
            $this->loadSubways($subways);
        }

        // Комнатность
        $rooms = $this->feedService->getRooms();
        if ($rooms) {
            $this->loadRooms($rooms);
        }

        // Отделка
        $finishings = $this->feedService->getFinishings();
        if ($finishings) {
            $this->loadFinishings($finishings);
        }

        // Технологии строительства
        $buildingTypes = $this->feedService->getBuildingTypes();
        if ($buildingTypes) {
            $this->loadBuildingTypes($buildingTypes);
        }
    }

    private function loadMainData(): void
    {
        $this->info("Загружаю основные данные...");

        // ЖК
        $blocks = $this->feedService->getBlocks();
        if ($blocks) {
            $this->loadBlocks($blocks);
        }

        // Корпуса
        $buildings = $this->feedService->getBuildings();
        if ($buildings) {
            $this->loadBuildings($buildings);
        }

        // Квартиры
        $apartments = $this->feedService->getApartments();
        if ($apartments) {
            $this->loadApartments($apartments);
        }
    }

    private function loadBuilders(array $data): void
    {
        $this->info("Загружаю застройщиков...");
        $count = 0;
        foreach ($data as $item) {
            $id = $item['_id'] ?? $item['id'] ?? null;
            if ($id) {
                Builder::updateOrCreate(
                    ['id' => $id],
                    ['name' => $item['name'] ?? null]
                );
                $count++;
            }
        }
        $this->info("Загружено застройщиков: {$count}");
    }

    private function loadRegions(array $data): void
    {
        $this->info("Загружаю регионы...");
        $count = 0;
        foreach ($data as $item) {
            $id = $item['_id'] ?? $item['id'] ?? null;
            if ($id) {
                Region::updateOrCreate(
                    ['id' => $id],
                    ['name' => $item['name'] ?? null]
                );
                $count++;
            }
        }
        $this->info("Загружено регионов: {$count}");
    }

    private function loadSubways(array $data): void
    {
        $this->info("Загружаю метро...");
        $count = 0;
        foreach ($data as $item) {
            $id = $item['_id'] ?? $item['id'] ?? null;
            if ($id) {
                Subway::updateOrCreate(
                    ['id' => $id],
                    ['name' => $item['name'] ?? null]
                );
                $count++;
            }
        }
        $this->info("Загружено метро: {$count}");
    }

    private function loadRooms(array $data): void
    {
        $this->info("Загружаю комнатность...");
        $count = 0;
        foreach ($data as $item) {
            $id = $item['_id'] ?? $item['id'] ?? null;
            if ($id) {
                Room::updateOrCreate(
                    ['id' => $id],
                    [
                        'name' => $item['name'] ?? null,
                        'value' => $item['value'] ?? null,
                    ]
                );
                $count++;
            }
        }
        $this->info("Загружено комнатности: {$count}");
    }

    private function loadFinishings(array $data): void
    {
        $this->info("Загружаю отделку...");
        $count = 0;
        foreach ($data as $item) {
            $id = $item['_id'] ?? $item['id'] ?? null;
            if ($id) {
                Finishing::updateOrCreate(
                    ['id' => $id],
                    ['name' => $item['name'] ?? null]
                );
                $count++;
            }
        }
        $this->info("Загружено отделок: {$count}");
    }

    private function loadBuildingTypes(array $data): void
    {
        $this->info("Загружаю технологии строительства...");
        $count = 0;
        foreach ($data as $item) {
            $id = $item['_id'] ?? $item['id'] ?? null;
            if ($id) {
                BuildingType::updateOrCreate(
                    ['id' => $id],
                    ['name' => $item['name'] ?? null]
                );
                $count++;
            }
        }
        $this->info("Загружено технологий: {$count}");
    }

    private function loadBlocks(array $data): void
    {
        $this->info("Загружаю ЖК...");
        $count = 0;
        DB::transaction(function () use ($data, &$count) {
            foreach ($data as $item) {
                $id = $item['_id'] ?? $item['id'] ?? null;
                if (!$id) continue;
                
                $block = Block::updateOrCreate(
                    ['id' => $id],
                    [
                        'name' => $item['name'] ?? null,
                        'builder_id' => $item['builder_id'] ?? $item['builder'] ?? null,
                        'geometry' => is_array($item['geometry'] ?? null) ? json_encode($item['geometry']) : ($item['geometry'] ?? null),
                        'renderer' => is_array($item['renderer'] ?? null) ? json_encode($item['renderer']) : ($item['renderer'] ?? null),
                        'progress' => is_array($item['progress'] ?? null) ? json_encode($item['progress']) : ($item['progress'] ?? null),
                        'plan' => is_array($item['plan'] ?? null) ? json_encode($item['plan']) : ($item['plan'] ?? null),
                    ]
                );

                // Связи с регионами
                if (isset($item['district'])) {
                    $districts = is_array($item['district']) ? $item['district'] : [$item['district']];
                    foreach ($districts as $regionId) {
                        if ($regionId) {
                            $region = Region::find($regionId);
                            if (!$region) {
                                Region::create(['id' => $regionId, 'name' => 'Неизвестно']);
                            }
                            $block->regions()->syncWithoutDetaching([$regionId]);
                        }
                    }
                }

                // Связи с локациями
                if (isset($item['locations']) && is_array($item['locations'])) {
                    foreach ($item['locations'] as $locationId) {
                        $location = Location::firstOrCreate(['id' => $locationId]);
                        $block->locations()->syncWithoutDetaching([$locationId]);
                    }
                }

                // Связи с метро
                if (isset($item['subway']) && is_array($item['subway'])) {
                    foreach ($item['subway'] as $subwayData) {
                        if (isset($subwayData['subway_id'])) {
                            $subwayId = $subwayData['subway_id'];
                            // Проверяем существование метро, если нет - создаем
                            $subway = Subway::find($subwayId);
                            if (!$subway) {
                                Subway::create(['id' => $subwayId, 'name' => 'Неизвестно']);
                            }
                            $block->subways()->syncWithoutDetaching([
                                $subwayId => [
                                    'distance_time' => $subwayData['distance_time'] ?? null,
                                    'distance_type' => $subwayData['distance_type'] ?? null,
                                ]
                            ]);
                        }
                    }
                }

                $count++;
            }
        });
        $this->info("Загружено ЖК: {$count}");
    }

    private function loadBuildings(array $data): void
    {
        $this->info("Загружаю корпуса...");
        $count = 0;
        DB::transaction(function () use ($data, &$count) {
            foreach ($data as $item) {
                $id = $item['_id'] ?? $item['id'] ?? null;
                if (!$id) continue;
                
                // Обработка address - может быть массивом или строкой
                $address = $item['address'] ?? null;
                if (is_array($address)) {
                    $address = !empty($address) ? (is_string($address[0] ?? null) ? implode(', ', $address) : json_encode($address)) : null;
                }
                
                $building = Building::updateOrCreate(
                    ['id' => $id],
                    [
                        'name' => $item['name'] ?? null,
                        'block_id' => $item['block_id'] ?? null,
                        'queue' => $item['queue'] ?? null,
                        'address' => $address,
                        'deadline' => isset($item['deadline']) ? $item['deadline'] : null,
                        'building_type_id' => $item['building_type'] ?? $item['building_type_id'] ?? null,
                        'geometry' => is_array($item['geometry'] ?? null) ? json_encode($item['geometry']) : ($item['geometry'] ?? null),
                    ]
                );

                // Связи с ипотечными программами
                if (isset($item['mortgages']) && is_array($item['mortgages'])) {
                    foreach ($item['mortgages'] as $mortgageId) {
                        if ($mortgageId) {
                            $mortgage = Mortgage::find($mortgageId);
                            if (!$mortgage) {
                                Mortgage::create(['id' => $mortgageId, 'name' => 'Неизвестно']);
                            }
                            $building->mortgages()->syncWithoutDetaching([$mortgageId]);
                        }
                    }
                }

                $count++;
            }
        });
        $this->info("Загружено корпусов: {$count}");
    }

    private function loadApartments(array $data): void
    {
        $this->info("Загружаю квартиры...");
        $count = 0;
        DB::transaction(function () use ($data, &$count) {
            foreach ($data as $item) {
                $id = $item['_id'] ?? $item['id'] ?? null;
                if (!$id) continue;
                
                // Обработка room_id - может быть числом (value) или ObjectId
                $roomId = $item['room'] ?? $item['room_id'] ?? null;
                if ($roomId && $roomId !== 0 && $roomId !== '0') {
                    if (!is_string($roomId)) {
                        // Если число, ищем комнатность по value
                        $room = Room::where('value', $roomId)->first();
                        $roomId = $room ? $room->id : null;
                    } else {
                        // Если строка, проверяем существование
                        $room = Room::find($roomId);
                        if (!$room) {
                            $roomId = null;
                        }
                    }
                } else {
                    $roomId = null;
                }
                
                Apartment::updateOrCreate(
                    ['id' => $id],
                    [
                        'building_id' => $item['building_id'] ?? null,
                        'area_given' => $item['area_given'] ?? null,
                        'area_total' => $item['area_total'] ?? null,
                        'area_rooms_total' => $item['area_rooms_total'] ?? null,
                        'finishing_id' => $item['finishing'] ?? $item['finishing_id'] ?? null,
                        'floor' => $item['floor'] ?? null,
                        'floors' => $item['floors'] ?? null,
                        'number' => $item['number'] ?? null,
                        'plan' => is_array($item['plan'] ?? null) ? json_encode($item['plan']) : ($item['plan'] ?? null),
                        'price' => $item['price'] ?? null,
                        'price_base' => $item['price_base'] ?? null,
                        'room_id' => $roomId,
                    ]
                );
                $count++;
            }
        });
        $this->info("Загружено квартир: {$count}");
    }
}
