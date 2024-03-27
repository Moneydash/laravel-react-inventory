<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

    protected $table = "category";
    public $timestamps = false;
    
    protected $fillable = [
        'category_name',
        'slug',
        'category_description'
    ];

    public function products()
    {
        return $this->hasMany(Product::class, 'category_id', 'id');
    }
}
