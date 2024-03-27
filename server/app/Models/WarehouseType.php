<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class WarehouseType extends Model
{
    use HasFactory, HasUuids, SoftDeletes;
    protected $table = 'warehouse_type';

    public $timestamps = false;
}
