<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Leads extends Model
{
    use HasFactory, HasUuids, SoftDeletes;
    
    protected $table = 'leads';
    
    protected $fillable = [
        'lead_source_id',
        'lead_owner',
        'firstname',
        'lastname',
        'email',
        'contact_num',
        'company_name',
        'industry_type_id',
        'job_title_id',
        'lead_status',
        'notes',
        'website',
        'interests',
        'campaign'
    ];

    public function lead_source(): BelongsTo {
        return $this->belongsTo(LeadSource::class, 'lead_source_id', 'id');
    }

    public function lead_title(): BelongsTo {
        return $this->belongsTo(LeadTitle::class, 'job_title_id', 'id');
    }

    public function industry(): BelongsTo {
        return $this->belongsTo(IndustryType::class, 'industry_type_id', 'id');
    }
}
