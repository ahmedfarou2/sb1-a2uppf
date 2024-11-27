<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->morphs('documentable');
            $table->string('name');
            $table->string('path');
            $table->string('type', 50);
            $table->enum('category', ['NATIONAL_ID', 'COMMERCIAL_REGISTER', 'SOCPA_LICENSE', 'OTHER']);
            $table->timestamps();

            $table->index(['documentable_type', 'documentable_id']);
            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};