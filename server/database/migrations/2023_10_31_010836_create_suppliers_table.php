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
        Schema::create('suppliers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('supp_name')->nullable(false);
            $table->string('supp_loc')->nullable(false);
            $table->string('supp_email')->unique();
            $table->string('supp_hotline')->nullable(false);
            $table->string('contact_person')->nullable(false);
            $table->string('contact_person_number')->nullable(false);
            $table->date('contract_expiry_date')->nullable(false);
            $table->boolean('supp_status')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('suppliers');
    }
};
