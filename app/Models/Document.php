<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Document extends Model
{
    protected $fillable = [
        'name',
        'path',
        'type',
        'category',
    ];

    public function documentable(): MorphTo
    {
        return $this->morphTo();
    }
}