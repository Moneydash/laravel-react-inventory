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
        Schema::create('customers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('firstname')->nullable(false);
            $table->string('middlename')->nullable();
            $table->string('lastname')->nullable(false);
            $table->string('contact_number')->nullable(false);
            $table->string('email')->nullable(false)->unique();
            $table->string('customer_location')->nullable(false);
            $table->smallInteger('customer_payment_status')->default(1); // 0 = no orders, 1 = paid, 2 = partially paid, 3 = not paid
            $table->float('customer_latest_payment_amnt', 10, 2)->nullable(false);
            $table->float('customer_credit_amnt', 10, 2)->nullable(false);
            $table->string('customer_img')->nullable(false);
            $table->boolean('customer_status')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
