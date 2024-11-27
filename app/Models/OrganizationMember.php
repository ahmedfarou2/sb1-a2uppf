<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrganizationMember extends Model
{
    protected $fillable = [
        'user_id',
        'role',
        'permissions',
        'status',
        'joined_at',
    ];

    protected $casts = [
        'permissions' => 'array',
        'joined_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function organization(): MorphTo
    {
        return $this->morphTo();
    }
}