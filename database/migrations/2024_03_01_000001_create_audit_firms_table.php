<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_firms', function (Blueprint $table) {
            $table->id();
            $table->string('name_ar');
            $table->string('name_en');
            $table->string('license_number', 20)->unique();
            $table->string('global_network')->nullable();
            $table->string('subdomain', 50)->unique();
            $table->string('allowed_email_domain')->nullable();
            $table->boolean('restrict_email_domain')->default(false);
            $table->enum('registration_type', ['PARTNER', 'EMPLOYEE']);
            $table->enum('verification_status', ['PENDING', 'VERIFIED', 'REJECTED'])->default('PENDING');
            $table->enum('status', ['PENDING', 'APPROVED', 'REJECTED'])->default('PENDING');
            $table->unsignedBigInteger('admin_id');
            $table->json('registered_by');
            $table->boolean('agreement_accepted')->default(false);
            $table->timestamp('agreement_date')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('admin_id')->references('id')->on('users')->onDelete('restrict');
            $table->index(['verification_status', 'status']);
            $table->index('license_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_firms');
    }
};