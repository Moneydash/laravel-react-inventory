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
        Schema::create('product_delivery', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('po_number')->nullable(false)->unique();
            $table->uuid('batch_id');
            $table->uuid('product_id');
            $table->string('quantity')->nullable(false);
            $table->float('price', 8, 2)->nullable(false);
            $table->float('subtotal', 10, 2)->nullable(false);
            $table->uuid('customer_id'); // name of the customer to deliver with
            $table->smallInteger('delivery_status')->default(0); // 0 = for delivery, 1 = on the way, 2 = delivered
            $table->uuid('delivery_person_id'); // name of the rider
            $table->timestamps();

            $table->foreign('product_id')->references('id')->on('products');
            $table->foreign('batch_id')->references('id')->on('batches');
            $table->foreign('delivery_person_id')->references('id')->on('delivery_persons');
            $table->foreign('customer_id')->references('id')->on('customers');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_delivery');
    }
};
