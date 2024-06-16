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
        Schema::table('customers', function (Blueprint $table) {
            $table->uuid('customer_type_id')->nullable(false);
            $table->uuid('company_info_id')->nullable(true);

            $table->foreign('customer_type_id')->references('id')->on('customer_type');
            $table->foreign('company_info_id')->references('id')->on('company_informations');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customers', function (Blueprint $table) {
            $table->dropColumn('customer_type_id');
            $table->dropColumn('company_info_id');
        });
    }
};