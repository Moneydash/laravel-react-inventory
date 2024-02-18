<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PrimaryId extends Model
{
    use HasFactory, HasUuids;
    protected $table = 'primary_ids_list';

    public function delivery_persons() {
        return $this->hasMany(DeliveryPerson::class, 'primaryID_id', 'id');
    }
}
