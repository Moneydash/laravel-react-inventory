<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = 'suppliers';
    protected $fillable = [
        "supp_name",
        "supp_loc",
        "supp_email",
        "supp_hotline",
        "contact_person",
        "contact_person_number",
        "contract_expiry_date",
        "terms_and_conditions",
        "agreement"
    ];

    protected $casts = [
        'supp_status' => 'boolean',
        'contract_expiry_date' => 'date',
        'deleted_at' => 'datetime'
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_supplier', 'supplier_id', 'product_id')
        ->withPivot('status');
    }
}
