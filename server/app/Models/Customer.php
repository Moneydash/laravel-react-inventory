<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory, HasUuids;
    protected $table = 'customers';

    protected $fillable = [
        'customer_img',
        'firstname',
        'middlename',
        'lastname',
        'contact_number',
        'email',
        'customer_location',
        'customer_payment_status',
        'customer_payment_amnt',
        'customer_credit_amnt',
        'customer_img'
    ];

    protected $casts = [
        'customer_status' => 'boolean'
    ];

    public function product_delivery() {
        return $this->hasMany(ProductDelivery::class, 'customer_id', 'id');
    }
}
