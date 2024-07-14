<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('secondary_ids_list', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('description')->nullable(false)->unique(); # ID Description
            $table->string('name')->nullable(false)->unique(); # ID Name
            $table->tinyInteger('order')->nullable(false); # order positioning of the ID's
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('secondary_ids_list');
    }
};
