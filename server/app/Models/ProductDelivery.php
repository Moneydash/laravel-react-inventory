<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductDelivery extends Model
{
    use HasFactory, HasUuids;
    protected $table = 'product_delivery';

    public function products() {
        return $this->belongsToMany(Product::class, 'product_id', 'id');
    }

    public function delivery_persons() {
        return $this->belongsTo(DeliveryPerson::class, 'delivery_person_id', 'id');
    }

    public function batches() {
        return $this->belongsTo(Batches::class, 'batch_id', 'id');
    }

    public function customers() {
        return $this->belongsTo(Customer::class, 'customer_id', 'id');
    }
}