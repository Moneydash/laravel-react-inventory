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
        Schema::create('navigation_role', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('role_id');
            $table->uuid('navigation_id');
            $table->boolean('create');
            $table->boolean('read');
            $table->boolean('update');
            $table->boolean('delete');
            $table->boolean('download');
            $table->boolean('upload');
            $table->timestamps();

            $table->foreign('role_id')->references('id')->on('roles');
            $table->foreign('navigation_id')->references('id')->on('navigations');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('navigation_role');
    }
};
