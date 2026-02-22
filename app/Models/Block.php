<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Block extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'id',
        'name',
        'builder_id',
        'geometry',
        'renderer',
        'progress',
        'plan',
    ];

    protected $casts = [
        'geometry' => 'array',
        'renderer' => 'array',
        'progress' => 'array',
        'plan' => 'array',
    ];

    public function builder(): BelongsTo
    {
        return $this->belongsTo(Builder::class);
    }

    public function regions(): BelongsToMany
    {
        return $this->belongsToMany(Region::class);
    }

    public function locations(): BelongsToMany
    {
        return $this->belongsToMany(Location::class);
    }

    public function subways(): BelongsToMany
    {
        return $this->belongsToMany(Subway::class)
            ->withPivot('distance_time', 'distance_type');
    }

    public function buildings(): HasMany
    {
        return $this->hasMany(Building::class);
    }
}
