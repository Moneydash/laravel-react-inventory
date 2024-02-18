<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubNavigation extends Model
{
    use HasFactory, HasUuids;
    protected $table = 'sub_navigations';

    public function roles() {
        return $this->belongsToMany(Role::class);
    }

    public function navigation() {
        return $this->belongsToMany(Navigation::class);
    }
}
