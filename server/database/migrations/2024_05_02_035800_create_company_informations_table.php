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
        Schema::create('company_informations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('industry_type_id')->nullable(false);
            $table->string('company_size')->nullable(false);
            $table->string('years_of_operation')->nullable(false);
            $table->softDeletes($column = 'deleted_at');
            $table->timestamps();

            $table->foreign('industry_type_id')->references('id')->on('industry_types');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_informations');
    }
};
