<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SubNavigation;
use App\Models\Navigation;
use Illuminate\Support\Facades\Cache;

class SubNavigationController extends Controller
{
    public function get_profile_sub_navigations($role_id, $user_id) {
        $cacheKey = 'profile_subNavigations_' . $role_id . '_' . $user_id;
        $cacheTags = [$role_id . '_' . $user_id];
        $minutes = 180;

        // remember the navigations using cache for fast initial retrieval
        $sub_navigations = Cache::tags($cacheTags)->remember($cacheKey, $minutes, function () use ($role_id) {
            // If the data is not in the cache, retrieve it from the database
            return SubNavigation::whereHas('roles', function ($query) use ($role_id) {
                // Attempt to retrieve the data from the cache
                $profile = Navigation::where('navigation_url', 'profile')->first();
                $query->where('role_id', $role_id)->where('parent_navigation_id', $profile->id);
            })->get();
        });

        return response()->json([ 'sub_navigations' => $sub_navigations ]);
    }

    public function get_productDelivery_sub_navigations($role_id, $user_id) {
        $cacheKey = 'prodDelivery_subNavigations_' . $role_id . '_' . $user_id;
        $cacheTags = [$role_id . '_' . $user_id];
        $minutes = 180;

        // remember the navigations using cache for fast initial retrieval
        $sub_navigations = Cache::tags($cacheTags)->remember($cacheKey, $minutes, function () use ($role_id) {
            // If the data is not in the cache, retrieve it from the database
            return SubNavigation::whereHas('roles', function ($query) use ($role_id) {
                // Attempt to retrieve the data from the cache
                $product_delivery = Navigation::where('navigation_url', 'delivery')->first();
                $query->where('role_id', $role_id)->where('parent_navigation_id', $product_delivery->id);
            })->get();
        });

        return response()->json([ 'sub_navigations' => $sub_navigations ]);
    }

    public function get_inventoryControl_sub_navigations($role_id, $user_id) {
        $cacheKey = 'inventoryControl_subNavigations_' . $role_id . '_' . $user_id;
        $cacheTags = [$role_id . '_' . $user_id];
        $minutes = 180;

        // remember the navigations using cache for fast initial retrieval
        $sub_navigations = Cache::tags($cacheTags)->remember($cacheKey, $minutes, function () use ($role_id) {
            // If the data is not in the cache, retrieve it from the database
            return SubNavigation::whereHas('roles', function ($query) use ($role_id) {
                // Attempt to retrieve the data from the cache
                $products = Navigation::where('navigation_url', 'inventory')->first();
                $query->where('role_id', $role_id)->where('parent_navigation_id', $products->id);
            })->get();
        });

        return response()->json([ 'sub_navigations' => $sub_navigations ]);
    }
}
