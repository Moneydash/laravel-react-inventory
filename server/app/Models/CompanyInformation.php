<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class CompanyInformation extends Model
{
    use HasFactory, HasUuids, SoftDeletes;
    protected $table = 'company_informations';

    protected $fillable = [
        'industry_type_id',
        'company_size',
        'years_of_operation'
    ];

    public $timestamps = false;

    public function customer(): HasOne {
        return $this->hasOne(Customer::class, 'company_info_id', 'id');
    }
}
