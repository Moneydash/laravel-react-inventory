<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Equipment extends Model
{
    use HasFactory, HasUuids, SoftDeletes;
    protected $table = 'equipments';

    public function warehouse(): BelongsToMany {
        return $this->belongsToMany(Warehouse::class, 'warehouse_equipment', 'equipment_id', 'warehouse_id');
    }
}
