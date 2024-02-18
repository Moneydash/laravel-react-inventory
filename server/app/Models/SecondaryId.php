<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecondaryId extends Model
{
    use HasFactory, HasUuids;
    protected $table = 'secondary_ids_list';

    public function delivery_persons() {
        return $this->hasMany(DeliveryPerson::class, 'secondaryID_id', 'id');
    }
}
