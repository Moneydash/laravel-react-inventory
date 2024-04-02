<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Warehouse extends Model
{
    use HasFactory, HasUuids, SoftDeletes;
    protected $table = 'warehouse';

    protected $fillable = [
        'name',
        'location',
        'contact_person',
        'person_conno',
        'email',
        'hotline',
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
        'special_handling_info',
        'facebook_link',
        'twitter_link'
    ];

    protected $casts = [
        'opening_hrs' => 'datetime:H:i',
        'closing_hrs' => 'datetime:H:i',
        'is_biohazard' => 'boolean',
    ];

    public function warehouse_type(): BelongsTo {
        return $this->belongsTo(WarehouseType::class, 'warehouseType_id', 'id');
    }

    public function equipment(): BelongsToMany {
        return $this->belongsToMany(Equipment::class, 'warehouse_equipment', 'warehouse_id', 'equipment_id');
    }

    public function category(): BelongsToMany {
        return $this->belongsToMany(Category::class, 'warehouse_category', 'warehouse_id', 'category_id');
    }
}
