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
            $table->string('name')->nullable(false);
            $table->string('location')->nullable(false);
            $table->string('email')->unique();
            $table->string('hotline')->nullable(false);
            $table->string('contact_person')->nullable(false);
            $table->string('contact_person_number')->nullable(false);
            $table->date('contract_expiry_date')->nullable(false);
            $table->string('terms_and_conditions')->nullable(false); // file
            $table->string('agreement')->nullable(false);
            $table->softDeletes($column = 'deleted_at');
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
