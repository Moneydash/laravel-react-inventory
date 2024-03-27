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
        Schema::create('sub_navigations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('parent_navigation_id')->nullable(false);
            $table->string('sub_navigation_name')->nullable(false)->unique();
            $table->string('sub_navigation_url')->nullable(false)->unique();
            $table->string('sub_navigation_desc', 1000)->nullable(false); // description of sub nav
            $table->boolean('status')->default(1);
            $table->timestamps();

            $table->foreign('parent_navigation_id')->references('id')->on('navigations');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sub_navigations');
    }
};
