<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Apartment extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'id',
        'building_id',
        'area_given',
        'area_total',
        'area_rooms_total',
        'finishing_id',
        'floor',
        'floors',
        'number',
        'plan',
        'price',
        'price_base',
        'room_id',
    ];

    protected $casts = [
        'area_given' => 'decimal:2',
        'area_total' => 'decimal:2',
        'area_rooms_total' => 'decimal:2',
        'price' => 'decimal:2',
        'price_base' => 'decimal:2',
        'floor' => 'integer',
        'floors' => 'integer',
    ];

    public function building(): BelongsTo
    {
        return $this->belongsTo(Building::class);
    }

    public function finishing(): BelongsTo
    {
        return $this->belongsTo(Finishing::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}
