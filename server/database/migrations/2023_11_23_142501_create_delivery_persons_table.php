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
            $table->string('middlename')->nullable();
            $table->string('lastname')->nullable(false);
            $table->string('primaryID_id')->nullable(false); // primary goverment id name
            $table->string('primary_id_img')->nullable(false); // primary government id image
            $table->string('secondaryID_id')->nullable();
            $table->string('secondary_id_img')->nullable();
            $table->string('contact_number')->nullable(false);
            $table->string('email_address')->nullable()->unique();
            $table->string('home_address')->nullable(false);
            $table->boolean('status')->default(1); // 1 = active, 0 = deleted
            $table->boolean('delivery_status')->default(1); // 1 = available, 0 = unavailable
            $table->timestamps();

            $table->foreign('primaryID_id')->references('id')->on('primary_ids_list');
            $table->foreign('secondaryID_id')->references('id')->on('secondary_ids_list');
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
