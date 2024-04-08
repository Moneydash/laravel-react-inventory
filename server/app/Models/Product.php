<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = "products";
    protected $fillable = [
        'name',
        'stocks',
        'description',
        'image',
        'sku',
        'barcode',
        'price',
        'weight',
        'dimensions',
        'is_variant',
        'parent_product_id',
        'category_id',
        'warehouse_id',
        'has_serial',
        'serial_number',
        'warranty_info',
        'status'
    ];

    protected $casts = [
        'price' => 'float',
        'is_variant' => 'boolean',
        'status' => 'boolean'
    ];

    public function suppliers(): BelongsToMany {
        return $this->belongsToMany(Supplier::class, 'product_supplier', 'product_id', 'supplier_id')
        ->withPivot('status');
    }

    public function category(): BelongsTo {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }

    public function warehouse(): BelongsTo {
        return $this->belongsTo(Warehouse::class, 'warehouse_id', 'id');
    }
}
