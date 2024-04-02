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
        Schema::create('warehouse_equipment', function (Blueprint $table) {
            $table->id();
            $table->uuid('equipment_id');
            $table->uuid('warehouse_id');
            $table->timestamps();

            $table->foreign('equipment_id')->references('id')->on('equipments');
            $table->foreign('warehouse_id')->references('id')->on('warehouse');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('warehouse_equipment');
    }
};
