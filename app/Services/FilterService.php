<?php

namespace App\Services;

use App\Models\Apartment;
use App\Models\Block;
use App\Models\Building;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class FilterService
{
    /**
     * Фильтрация квартир
     */
    public function filterApartments(array $filters = []): Builder
    {
        $query = Apartment::query()->with(['building.block', 'room', 'finishing']);

        // Фильтр по цене
        if (isset($filters['price_min'])) {
            $query->where('price', '>=', $filters['price_min']);
        }
        if (isset($filters['price_max'])) {
            $query->where('price', '<=', $filters['price_max']);
        }

        // Фильтр по площади
        if (isset($filters['area_min'])) {
            $query->where('area_total', '>=', $filters['area_min']);
        }
        if (isset($filters['area_max'])) {
            $query->where('area_total', '<=', $filters['area_max']);
        }

        // Фильтр по этажу
        if (isset($filters['floor_min'])) {
            $query->where('floor', '>=', $filters['floor_min']);
        }
        if (isset($filters['floor_max'])) {
            $query->where('floor', '<=', $filters['floor_max']);
        }

        // Фильтр по комнатности
        if (isset($filters['room_id'])) {
            $query->where('room_id', $filters['room_id']);
        }

        // Фильтр по отделке
        if (isset($filters['finishing_id'])) {
            $query->where('finishing_id', $filters['finishing_id']);
        }

        // Фильтр по ЖК
        if (isset($filters['block_id'])) {
            $query->whereHas('building', function ($q) use ($filters) {
                $q->where('block_id', $filters['block_id']);
            });
        }

        // Фильтр по застройщику
        if (isset($filters['builder_id'])) {
            $query->whereHas('building.block', function ($q) use ($filters) {
                $q->where('builder_id', $filters['builder_id']);
            });
        }

        // Фильтр по региону
        if (isset($filters['region_id'])) {
            $query->whereHas('building.block.regions', function ($q) use ($filters) {
                $q->where('regions.id', $filters['region_id']);
            });
        }

        // Фильтр по метро
        if (isset($filters['subway_id'])) {
            $query->whereHas('building.block.subways', function ($q) use ($filters) {
                $q->where('subways.id', $filters['subway_id']);
            });
        }

        return $query;
    }

    /**
     * Фильтрация ЖК
     */
    public function filterBlocks(array $filters = []): Builder
    {
        $query = Block::query()->with(['builder', 'regions', 'subways', 'buildings']);

        // Фильтр по застройщику
        if (isset($filters['builder_id'])) {
            $query->where('builder_id', $filters['builder_id']);
        }

        // Фильтр по региону
        if (isset($filters['region_id'])) {
            $query->whereHas('regions', function ($q) use ($filters) {
                $q->where('regions.id', $filters['region_id']);
            });
        }

        // Фильтр по метро
        if (isset($filters['subway_id'])) {
            $query->whereHas('subways', function ($q) use ($filters) {
                $q->where('subways.id', $filters['subway_id']);
            });
        }

        return $query;
    }

    /**
     * Фильтрация корпусов
     */
    public function filterBuildings(array $filters = []): Builder
    {
        $query = Building::query()->with(['block', 'buildingType', 'apartments']);

        // Фильтр по ЖК
        if (isset($filters['block_id'])) {
            $query->where('block_id', $filters['block_id']);
        }

        // Фильтр по технологии строительства
        if (isset($filters['building_type_id'])) {
            $query->where('building_type_id', $filters['building_type_id']);
        }

        return $query;
    }
}
