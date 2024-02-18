<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Navigation extends Model
{
    use HasFactory, HasUuids;
    protected $table = 'navigations';

    public function roles() {
        return $this->belongsToMany(Role::class);
    }
}