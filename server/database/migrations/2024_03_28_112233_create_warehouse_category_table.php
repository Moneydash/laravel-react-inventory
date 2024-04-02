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
        Schema::create('warehouse_category', function (Blueprint $table) {
            $table->id();
            $table->uuid('category_id');
            $table->uuid('warehouse_id');
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('category');
            $table->foreign('warehouse_id')->references('id')->on('warehouse');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('warehouse_category');
    }
};
