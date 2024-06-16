<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CustomerType extends Model
{
    use HasFactory, HasUuids;
    protected $table = 'customer_type';

    public function customer(): HasMany {
        return $this->hasMany(Customer::class, 'customer_type_id', 'id');
    }
}
