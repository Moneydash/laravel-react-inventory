<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Warehouse extends Model
{
    use HasFactory, HasUuids, SoftDeletes;
    protected $table = 'warehouse';

    protected $fillable = [
        'name',
        'location',
        'contact_person',
        'person_conno',
        'warehouseType_id',
        'opening_hrs',
        'closing_hrs',
        'landmark',
        'description',
        'size_area',
        'insurance_info',
        'certifications_compliance',
        'usage',
        'is_biohazard',
        'precautionary_measure',
        'maintenance_schedule',
        'vendor_contracts',
        'min_temp',
        'max_temp',
        'special_handling_info'
    ];

    protected $casts = [
        'opening_hrs' => 'time',
        'closing_hrs' => 'time',
        'is_biohazard' => 'boolean',
    ];
}
