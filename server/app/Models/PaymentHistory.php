<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentHistory extends Model
{
    use HasFactory, HasUuids;
    protected $table = 'payment_history';

    public function customer() {
        return $this->belongsTo(Customer::class, 'customer_id', 'id');
    }

    public function credit_history() {
        return $this->belongsTo(CreditHistory::class, 'credit_id', 'id');
    }
}
