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
        Schema::create('products', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('image')->nullable(false);
            $table->string('name')->nullable(false);
            $table->string('sku')->unique()->nullable(false);
            $table->string('barcode')->unique()->nullable(false);
            $table->string('weight');
            $table->string('dimensions');
            $table->float('price', 8, 2)->nullable(false);
            $table->string('description', 2000)->nullable(false);
            $table->boolean('is_variant');
            $table->uuid('parent_product_id')->nullable(true);
            $table->integer('stocks')->nullable(false);
            $table->uuid('category_id');
            $table->boolean('status')->default(1); // 0 = out of stocks, 1 = available, 2 = low stocks
            $table->string('warranty_info')->nullable(true);
            $table->boolean('has_serial')->default(0);
            $table->string('serial_number')->nullable(true);
            $table->softDeletes($column = 'deleted_at');
            $table->timestamps();

            $table->foreign('category_id')->references('id')->on('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
