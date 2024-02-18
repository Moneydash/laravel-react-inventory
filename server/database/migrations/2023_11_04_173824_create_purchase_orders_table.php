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
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('po_number')->unique()->nullable(false);
            $table->uuid('supplier_id');
            $table->uuid('product_id');
            $table->integer('quantity');
            $table->float('unit_price', 8, 2);
            $table->float('subtotal', 10, 2);
            $table->string('billing_address');
            $table->string('shipping_address');
            $table->string('purchase_order_notes')->nullable();
            $table->string('delivery_notes')->nullable();
            $table->smallInteger('order_status')->default(0); # 0 = open, 1 = pending, 2 = close
            $table->datetime('date_of_order')->nullable(false);
            $table->timestamps();

            $table->foreign('supplier_id')->references('id')->on('suppliers');
            $table->foreign('product_id')->references('id')->on('products');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_orders');
    }
};
