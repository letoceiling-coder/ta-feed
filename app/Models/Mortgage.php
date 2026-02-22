<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Mortgage extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = ['id', 'name'];

    public function buildings(): BelongsToMany
    {
        return $this->belongsToMany(Building::class);
    }
}
