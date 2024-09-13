<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Role extends Model
{
    use HasFactory, HasUuids, SoftDeletes;

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