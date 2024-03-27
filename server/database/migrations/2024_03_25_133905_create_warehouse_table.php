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
        Schema::create('warehouse', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->nullable(false);
            $table->string('location')->nullable(false);
            $table->string('contact_person')->nullable(false);
            $table->string('person_conno')->nullable(false);
            $table->string('email')->nullable(false);
            $table->string('hotline')->nullable(false);
            $table->uuid('warehouseType_id');
            $table->time('opening_hrs')->nullable(false);
            $table->time('closing_hrs')->nullable(false);
            $table->string('landmark')->nullable(false);
            $table->string('description')->nullable(true);
            $table->string('size_area')->nullable(false);
            $table->string('insurance_info')->nullable(false); // file
            $table->string('certifications_compliance')->nullable(false); // file
            $table->string('usage')->nullable(false); // e.g. temporary storage, distribution, transfer
            $table->boolean('is_biohazard')->nullable(false);
            $table->string('precautionary_measure')->nullable(true); // only if biohazard
            $table->string('maintenance_schedule')->nullable(false);
            $table->string('vendor_contracts')->nullable(false);
            $table->string('min_temp')->nullable(true); // minimum temperature
            $table->string('max_temp')->nullable(true);
            $table->string('special_handling_info')->nullable(true);
            $table->string('facebook_link')->nullable(true); // fb page
            $table->string('twitter_link')->nullable(true); // twitter page
            $table->softDeletes($column = 'deleted_at');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('warehouse');
    }
};
