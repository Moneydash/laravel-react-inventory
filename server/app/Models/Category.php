<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $table = "category";
    public $timestamps = false;

    public function products()
    {
        return $this->hasMany(Product::class, 'category_id', 'id');
    }
}
