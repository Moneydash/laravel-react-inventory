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
        Schema::create('leads', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('lead_source_id');
            $table->string('lead_owner')->nullable(false); # owner or organization name
            $table->string('firstname')->nullable(false);
            $table->string('lastname')->nullable(false);
            $table->string('email')->unique()->nullable(false);
            $table->string('contact_num')->nullable(false);
            $table->string('company_name')->nullable(true);
            $table->uuid('industry_type_id');
            $table->uuid('job_title_id');
            $table->string('lead_status')->nullable(false);
            $table->string('notes')->nullable(true);
            $table->string('website')->nullable(true);
            $table->string('interests')->nullable(true);
            $table->string('campaign')->nullable(true); # campaign marketing or events
            $table->softDeletes($column = 'deleted_at');
            $table->timestamps();

            # foreign keys
            $table->foreign('lead_source_id')->references('id')->on('lead_sources');
            $table->foreign('job_title_id')->references('id')->on('lead_job_titles');
            $table->foreign('industry_type_id')->references('id')->on('industry_types');

            # add indexing for faster data retrieval
            $table->index('id');
            $table->index('lead_owner');
            $table->index('firstname');
            $table->index('lastname');
            $table->index('email');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
