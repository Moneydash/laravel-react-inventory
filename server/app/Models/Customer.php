<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    use HasFactory, HasUuids, SoftDeletes;
    protected $table = 'customers';

    protected $fillable = [
        'account_number',
        'firstname',
        'middlename',
        'lastname',
        'contact_number',
        'email',
        'customer_location',
        'billing_address',
        'shipping_address',
        'tin',
        'website',
        'social_link',
        'customer_notes',
        'has_company',
        'customer_type_id',
        'company_info_id'
    ];

    protected $casts = [
        'has_company' => 'boolean',
    ];

    public function product_delivery(): HasMany {
        return $this->hasMany(ProductDelivery::class, 'customer_id', 'id');
    }

    public function credit_history(): HasMany {
        return $this->hasMany(CreditHistory::class, 'customer_id', 'id');
    }

    public function payment_history(): HasMany {
        return $this->hasMany(PaymentHistory::class, 'customer_id', 'id');
    }

    public function company_info(): BelongsTo {
        return $this->belongsTo(CompanyInformation::class, 'company_info_id', 'id');
    }

    public function customer_type(): BelongsTo {
        return $this->belongsTo(CustomerType::class, 'customer_type_id', 'id');
    }
}
