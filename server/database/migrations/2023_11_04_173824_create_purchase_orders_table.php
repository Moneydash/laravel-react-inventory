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
            $table->uuid('supplier_id')->nullable(false);
            $table->uuid('product_id')->nullable(false);
            $table->integer('quantity')->nullable(false);
            $table->float('unit_price', 8, 2)->nullable(false);
            $table->float('subtotal', 15, 2)->nullable(false);
            $table->integer('tax_rate')->nullable(false);
            $table->float('tax_amount', 15, 2)->nullable(false);
            $table->float('discount', 8, 2)->nullable(false);
            $table->float('total')->nullable(false);
            $table->date('shipping_date')->nullable();
            $table->string('shipping_method')->nullable(); # standard or express
            $table->string('billing_address')->nullable(false);
            $table->string('additional_charges')->nullable();
            $table->string('documents')->nullable(false);
            $table->string('po_notes')->nullable(true);
            $table->smallInteger('priority_lvl')->nullable(false); # 3 = low, 2 = normal, 1 = high
            $table->string('tracking_num')->unique()->nullable(false);
            $table->smallInteger('order_status')->default(0)->nullable(false); # 0 = pending, 1 = close
            $table->smallInteger('approval_status')->default(0)->nullable(false); # 0 - not yet approve, 1 = approve, 2 = disapprove
            $table->datetime('date_of_order')->nullable(false)->nullable(false);
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
