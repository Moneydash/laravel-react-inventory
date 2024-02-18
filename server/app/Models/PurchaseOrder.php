<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseOrder extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'purchase_orders';
    protected $fillable = [
        'po_number',
        'supplier_id',
        'product_id',
        'quantity',
        'unit_price',
        'subtotal',
        'billing_address',
        'shipping_address',
        'purchase_order_notes',
        'delivery_notes',
        'order_status',
        'date_of_order'
    ];

    protected $casts = [
        'date_of_order' => 'datetime',
        'unit_price' => 'float',
        'subtotal' => 'float'
    ];

    public function suppliers() {
        return $this->belongsTo(Supplier::class, 'supplier_id', 'id');
    }

    public function products() {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}