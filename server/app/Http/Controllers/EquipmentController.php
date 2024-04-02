<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Equipment;

class EquipmentController extends Controller
{
    public function get_equipments() {
        $equipments = Equipment::get();

        return response()->json([ 'equipments' => $equipments ]);
    }
}
