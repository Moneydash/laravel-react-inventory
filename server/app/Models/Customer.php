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
        'customer_img'
    ];

    protected $casts = [
        'customer_status' => 'boolean'
    ];

    public function product_delivery() {
        return $this->hasMany(ProductDelivery::class, 'customer_id', 'id');
    }

    public function credit_history() {
        return $this->hasMany(CreditHistory::class, 'customer_id', 'id');
    }

    public function payment_history() {
        return $this->hasMany(PaymentHistory::class, 'customer_id', 'id');
    }
}
