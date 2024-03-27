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
            $table->string('prod_img')->nullable(false);
            $table->string('prod_name')->nullable(false);
            $table->string('prod_sku')->unique()->nullable(false);
            $table->string('prod_barcode')->unique()->nullable(false);
            $table->string('weight');
            $table->string('dimensions');
            $table->float('prod_price', 8, 2)->nullable(false);
            $table->string('prod_desc', 2000)->nullable(false);
            $table->boolean('is_variant');
            $table->uuid('parent_product_id')->nullable();
            $table->integer('stocks')->nullable(false);
            $table->uuid('category_id');
            $table->boolean('prod_status')->default(1);
            $table->string('warranty_info')->nullable();
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
