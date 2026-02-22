<?php

namespace App\Console\Commands;

use App\Models\Apartment;
use App\Models\Block;
use App\Models\Building;
use App\Models\Builder;
use App\Models\Region;
use App\Models\Subway;
use App\Models\Room;
use App\Models\Finishing;
use App\Models\BuildingType;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ValidateFeedData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'feed:validate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Проверить целостность данных в БД и соответствие документации';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("=== Проверка целостности данных в БД ===\n");

        $this->validateReferenceData();
        $this->validateMainData();
        $this->validateRelationships();

        $this->info("\n=== Проверка завершена ===");
    }

    private function validateReferenceData(): void
    {
        $this->info("1. Проверка справочников:");

        $this->checkTable('builders', Builder::class, 'Застройщики');
        $this->checkTable('regions', Region::class, 'Регионы');
        $this->checkTable('subways', Subway::class, 'Метро');
        $this->checkTable('rooms', Room::class, 'Комнатность');
        $this->checkTable('finishings', Finishing::class, 'Отделка');
        $this->checkTable('building_types', BuildingType::class, 'Технологии строительства');
    }

    private function validateMainData(): void
    {
        $this->info("\n2. Проверка основных данных:");

        $this->checkTable('blocks', Block::class, 'ЖК');
        $this->checkTable('buildings', Building::class, 'Корпуса');
        $this->checkTable('apartments', Apartment::class, 'Квартиры');

        // Проверка наличия обязательных полей
        $this->info("\n   Проверка обязательных полей:");

        // Проверка Blocks
        $blocksWithoutBuilder = Block::whereNull('builder_id')->count();
        if ($blocksWithoutBuilder > 0) {
            $this->warn("   ⚠ ЖК без застройщика: {$blocksWithoutBuilder}");
        } else {
            $this->info("   ✓ Все ЖК имеют застройщика");
        }

        // Проверка Buildings
        $buildingsWithoutBlock = Building::whereNull('block_id')->count();
        if ($buildingsWithoutBlock > 0) {
            $this->warn("   ⚠ Корпуса без ЖК: {$buildingsWithoutBlock}");
        } else {
            $this->info("   ✓ Все корпуса привязаны к ЖК");
        }

        // Проверка Apartments
        $apartmentsWithoutBuilding = Apartment::whereNull('building_id')->count();
        if ($apartmentsWithoutBuilding > 0) {
            $this->warn("   ⚠ Квартиры без корпуса: {$apartmentsWithoutBuilding}");
        } else {
            $this->info("   ✓ Все квартиры привязаны к корпусу");
        }
    }

    private function validateRelationships(): void
    {
        $this->info("\n3. Проверка связей:");

        // Проверка связей Block-Region
        $blockRegionsCount = DB::table('block_region')->count();
        $this->info("   → Связей ЖК-Регион: {$blockRegionsCount}");

        // Проверка связей Block-Subway
        $blockSubwaysCount = DB::table('block_subway')->count();
        $this->info("   → Связей ЖК-Метро: {$blockSubwaysCount}");

        // Проверка связей Building-Mortgage
        $buildingMortgagesCount = DB::table('building_mortgage')->count();
        $this->info("   → Связей Корпус-Ипотека: {$buildingMortgagesCount}");

        // Проверка целостности внешних ключей
        $this->info("\n   Проверка целостности внешних ключей:");

        // Проверка orphaned records
        $orphanedBuildings = Building::whereDoesntHave('block')->count();
        if ($orphanedBuildings > 0) {
            $this->error("   ✗ Найдено {$orphanedBuildings} корпусов без ЖК");
        } else {
            $this->info("   ✓ Все корпуса имеют валидную связь с ЖК");
        }

        $orphanedApartments = Apartment::whereDoesntHave('building')->count();
        if ($orphanedApartments > 0) {
            $this->error("   ✗ Найдено {$orphanedApartments} квартир без корпуса");
        } else {
            $this->info("   ✓ Все квартиры имеют валидную связь с корпусом");
        }

        // Проверка данных согласно документации
        $this->info("\n4. Проверка соответствия документации:");

        // Проверка наличия данных по ЖК
        $blocksWithGeometry = Block::whereNotNull('geometry')->count();
        $this->info("   → ЖК с геометкой: {$blocksWithGeometry}");

        $blocksWithRenderer = Block::whereNotNull('renderer')->count();
        $this->info("   → ЖК с рендерами: {$blocksWithRenderer}");

        // Проверка данных по квартирам
        $apartmentsWithPrice = Apartment::whereNotNull('price')->count();
        $this->info("   → Квартир с ценой: {$apartmentsWithPrice}");

        $apartmentsWithArea = Apartment::whereNotNull('area_total')->count();
        $this->info("   → Квартир с площадью: {$apartmentsWithArea}");

        $apartmentsWithRoom = Apartment::whereNotNull('room_id')->count();
        $this->info("   → Квартир с комнатностью: {$apartmentsWithRoom}");

        $apartmentsWithFinishing = Apartment::whereNotNull('finishing_id')->count();
        $this->info("   → Квартир с отделкой: {$apartmentsWithFinishing}");
    }

    private function checkTable(string $tableName, string $modelClass, string $description): void
    {
        $count = $modelClass::count();
        if ($count > 0) {
            $this->info("   ✓ {$description}: {$count} записей");
        } else {
            $this->warn("   ⚠ {$description}: нет данных");
        }
    }
}
