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
        Schema::create('category', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('category_name')->unique();
            $table->string('slug')->nullable(false)->unique();
            $table->string('category_description', 2000)->nullable(true);
            $table->softDeletes($column = "deleted_at");
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category');
    }
};
