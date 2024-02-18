<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    public function get_categories() {
        $category = Category::get();

        return response()->json([ 'categories' => $category ]);
    }
}
