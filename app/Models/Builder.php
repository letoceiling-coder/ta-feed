<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Builder extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = ['id', 'name'];

    public function blocks(): HasMany
    {
        return $this->hasMany(Block::class);
    }
}
