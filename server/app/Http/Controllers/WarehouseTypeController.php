<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WarehouseType;

class WarehouseTypeController extends Controller
{
    public function get_types() {
        $types = WarehouseType::get();

        return response()->json([ 'types' => $types ], 200);
    }
}
