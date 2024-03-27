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
        Schema::create('warehouse_warehouse_type', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('warehouse_type_id');
            $table->uuid('warehouse_id');
            $table->timestamps();

            $table->foreign('warehouse_type_id')->references('id')->on('warehouse_type');
            $table->foreign('warehouse_id')->references('id')->on('warehouse');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('warehouse_warehouse_type');
    }
};
