<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('organization_members', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->morphs('organization');
            $table->enum('role', ['ADMIN', 'MEMBER'])->default('MEMBER');
            $table->json('permissions')->nullable();
            $table->enum('status', ['PENDING', 'APPROVED', 'REJECTED'])->default('PENDING');
            $table->timestamp('joined_at')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->unique(['user_id', 'organization_type', 'organization_id'], 'org_members_unique');
            $table->index(['organization_type', 'organization_id']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organization_members');
    }
};