<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class DeliveryPerson extends Model
{
    use HasFactory, HasUuids, SoftDeletes;
    protected $table = 'delivery_persons';

    protected $fillable = [
        'firstname',
        'middlename',
        'lastname',
        'primaryID_id',
        'primary_id_img',
        'secondaryID_id',
        'secondary_id_img',
        'contact_number',
        'email_address',
        'home_address',
        'delivery_status'
    ];

    protected $casts = [
        'delivery_status' => 'boolean'
    ];

    public function primaryId() {
        return $this->belongsTo(PrimaryId::class, 'primaryID_id', 'id');
    }

    public function secondaryId() {
        return $this->belongsTo(SecondaryId::class, 'secondaryID_id', 'id');
    }

    public function product_delivery() {
        return $this->hasMany(ProductDelivery::class, 'delivery_person_id', 'id');
    }
}
