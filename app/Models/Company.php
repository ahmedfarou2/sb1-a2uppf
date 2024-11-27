<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Company extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name_ar',
        'name_en',
        'commercial_registration',
        'tax_registration',
        'subdomain',
        'status',
        'admin_id',
    ];

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function members(): MorphMany
    {
        return $this->morphMany(OrganizationMember::class, 'organization');
    }

    public function joinRequests(): MorphMany
    {
        return $this->morphMany(JoinRequest::class, 'organization');
    }

    public function documents(): MorphMany
    {
        return $this->morphMany(Document::class, 'documentable');
    }
}