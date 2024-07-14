<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Navigation;
use Illuminate\Support\Facades\Cache;

class NavigationController extends Controller
{
    public function get_navigations($role_id, $user_id) {
        $cacheKey = 'navigations_' . $role_id . '_' .$user_id;
        $cacheTags = [$role_id . '_' . $user_id];
        $minutes = 180;
    
        // Attempt to retrieve the data from the cache
        $navigations = Cache::tags($cacheTags)->remember($cacheKey, $minutes, function () use ($role_id) {
            // If the data is not in the cache, retrieve it from the database
            return Navigation::whereHas('roles', function ($query) use ($role_id) {
                $query->where('role_id', $role_id);
            })
            ->orderBy('order')
            ->get();
        });
    
        return response()->json(['navigations' => $navigations]);
    }
}
