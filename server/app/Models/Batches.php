<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Batches extends Model
{
    use HasFactory, HasUuids;
    protected $table = 'batches';

    protected $fillable = [ 'batch_num' ];

    public function product_delivery() {
        return $this->hasMany(ProductDelivery::class, 'batch_id', 'id');
    }
}
