<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory, HasUuids;

    protected $table = "products";
    protected $fillable = [
        'prod_name',
        'stocks',
        'prod_desc',
        'prod_img',
        'prod_sku',
        'prod_barcode',
        'prod_price',
        'weight',
        'dimensions',
        'is_variant',
        'parent_product_id',
        'category_id',
        'warranty_info',
        'prod_status'
    ];

    protected $casts = [
        'prod_price' => 'float',
        'is_variant' => 'boolean',
        'prod_status' => 'boolean'
    ];

    public function suppliers()
    {
        return $this->belongsToMany(Supplier::class, 'product_supplier', 'product_id', 'supplier_id')
        ->withPivot('status');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }
}
