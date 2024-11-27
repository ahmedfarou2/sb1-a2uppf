<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name_ar');
            $table->string('name_en');
            $table->string('commercial_registration', 20)->unique();
            $table->string('tax_registration', 20)->nullable();
            $table->string('subdomain', 50)->unique();
            $table->enum('status', ['PENDING', 'APPROVED', 'REJECTED'])->default('PENDING');
            $table->unsignedBigInteger('admin_id');
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('admin_id')->references('id')->on('users')->onDelete('restrict');
            $table->index(['status']);
            $table->index('commercial_registration');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};