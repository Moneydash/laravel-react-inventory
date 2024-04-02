<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WarehouseType extends Model
{
    use HasFactory, HasUuids, SoftDeletes;
    protected $table = 'warehouse_type';

    public $timestamps = false;

    public function warehouse(): HasMany {
        return $this->hasMany(Warehouse::class, 'warehouseType_id', 'id');
    }
}
