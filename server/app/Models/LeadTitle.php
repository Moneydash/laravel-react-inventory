<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class LeadTitle extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'lead_job_titles';
    public $timestamps = false;

}
