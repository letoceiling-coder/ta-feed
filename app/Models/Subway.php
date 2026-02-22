<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Subway extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = ['id', 'name'];

    public function blocks(): BelongsToMany
    {
        return $this->belongsToMany(Block::class)
            ->withPivot('distance_time', 'distance_type');
    }
}
