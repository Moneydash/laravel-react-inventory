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
            $table->string('account_number')->unique()->nullable(false);
            $table->string('firstname')->nullable(false);
            $table->string('middlename')->nullable(true);
            $table->string('lastname')->nullable(false);
            $table->string('contact_number')->nullable(false);
            $table->string('email')->nullable(false)->unique();
            $table->string('customer_location')->nullable(false);
            $table->string('billing_address')->nullable(false);
            $table->string('shipping_address')->nullable(false);
            $table->string('tin')->nullable(false);
            $table->string('website')->nullable(true);
            $table->string('social_link')->nullable(true);
            $table->string('customer_notes')->nullable(true);
            $table->boolean('has_company')->nullable(false);
            $table->softDeletes($column = 'deleted_at');
            $table->timestamps();

            # add indexing for faster data retrieval
            $table->index('firstname');
            $table->index('lastname');
            $table->index('account_number');
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