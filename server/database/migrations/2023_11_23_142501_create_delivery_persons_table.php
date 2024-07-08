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
        Schema::create('delivery_persons', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('firstname')->nullable(false);
            $table->string('middlename')->nullable(true);
            $table->string('lastname')->nullable(false);
            $table->uuid('primaryID_id')->nullable(false); # primary goverment id --- uuid
            $table->string('primary_id_img')->nullable(false); # primary government id image
            $table->uuid('secondaryID_id')->nullable(true);
            $table->string('secondary_id_img')->nullable(true);
            $table->string('contact_number')->nullable(false);
            $table->string('email_address')->nullable(true)->unique();
            $table->string('home_address')->nullable(false);
            $table->boolean('delivery_status')->default(1); # 1 = available, 0 = unavailable --- unavailable if currently on the delivery job
            $table->softDeletes($column = 'deleted_at');
            $table->timestamps();

            $table->foreign('primaryID_id')->references('id')->on('primary_ids_list');
            $table->foreign('secondaryID_id')->references('id')->on('secondary_ids_list');

            # add indexing for faster data retrieval
            $table->index('firstname');
            $table->index('lastname');
            $table->index('contact_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('delivery_persons');
    }
};
