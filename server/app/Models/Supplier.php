<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'suppliers';
    protected $fillable = [
        "supp_name",
        "supp_loc",
        "supp_email",
        "supp_hotline",
        "contact_person",
        "contact_person_number",
        "contract_expiry_date"
    ];

    protected $casts = [
        'supp_status' => 'boolean',
        'contract_expiry_date' => 'date'
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_supplier', 'supplier_id', 'product_id')
        ->withPivot('status');
    }
}
