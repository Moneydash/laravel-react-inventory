<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CreditHistory extends Model
{
    use HasFactory, HasUuids;
    protected $table = 'credit_history';

    protected $fillable = [
        'customer_id',
        'credit_amnt',
        'credit_status',
        'credit_dateTime'
    ];

    public function customers() {
        return $this->belongsTo(Customer::class, 'customer_id', 'id');
    }

    public function payment_history() {
        return $this->hasMany(PaymentHistory::class, 'customer_id', 'id');
    }
}
