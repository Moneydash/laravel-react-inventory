<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Role as SpatieRole;

class Role extends SpatieRole
{
    use HasFactory;

    protected $fillable = ['name', 'guard_name'];

    public function navigations()
    {
        return $this->belongsToMany(Navigation::class);
    }

    public function sub_navigations()
    {
        return $this->belongsToMany(SubNavigation::class);
    }
}