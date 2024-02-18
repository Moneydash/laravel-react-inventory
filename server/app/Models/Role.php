<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Role extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'roles';
    protected $casts = [
        'role_status' => 'boolean'
    ];

    public function users() {
        return $this->belongsToMany(User::class);
    }

    public function navigations() {
        return $this->belongsToMany(Navigation::class);
    }

    public function sub_navigations() {
        return $this->belongsToMany(SubNavigation::class);
    }
}