<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
        'tax_rate',
        'tax_amount',
        'discount',
        'total',
        'shipping_date',
        'shipping_method',
        'billing_address',
        'additional_charges',
        'documents',
        'po_notes',
        'priority_lvl',
        'tracking_num',
        'order_status',
        'approval_status',
        'date_of_order',
        'warehouse_id'
    ];

    protected $casts = [
        'date_of_order' => 'datetime',
        'unit_price' => 'float',
        'tax_amount' => 'float',
        'subtotal' => 'float',
        'total' => 'float',
        'subtotal' => 'float'
    ];

    public function suppliers(): BelongsTo {
        return $this->belongsTo(Supplier::class, 'supplier_id', 'id');
    }

    public function products(): BelongsTo {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }

    public function warehouse(): BelongsTo {
        return $this->belongsTo(Warehouse::class, 'warehouse_id', 'id');
    }
}