<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditFirm extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name_ar',
        'name_en',
        'license_number',
        'global_network',
        'subdomain',
        'allowed_email_domain',
        'restrict_email_domain',
        'registration_type',
        'verification_status',
        'status',
        'admin_id',
        'registered_by',
        'agreement_accepted',
        'agreement_date',
        'verified_at',
    ];

    protected $casts = [
        'registered_by' => 'array',
        'restrict_email_domain' => 'boolean',
        'agreement_accepted' => 'boolean',
        'agreement_date' => 'datetime',
        'verified_at' => 'datetime',
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

    public function canJoin(User $user): bool
    {
        if (!$this->restrict_email_domain || !$this->allowed_email_domain) {
            return true;
        }

        $userEmailDomain = explode('@', $user->email)[1] ?? '';
        return $userEmailDomain === $this->allowed_email_domain;
    }
}