<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    private $_try_again = 'Oops, something went wrong. Please try again later.';
    public function get_categories() {
        $category = Category::get();

        return response()->json([ 'categories' => $category ]);
    }

    public function store(Request $request) {
        $request->validate([
            'category_name' => 'required|unique:category',
            'slug' => 'required|unique:category'
        ]);

        $category_data = [
            'category_name' => $request->category_name,
            'slug' => $request->slug,
            'category_description' => trim($request->category_description)
        ];

        DB::beginTransaction();
        try {
            Category::create($category_data);

            DB::commit();
            return response()->json([ 'message' => 'Successfully created!' ], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'error' => $e->getMessage(), 'message' => $this->_try_again ], 500);
        }
    }

    public function get_category($category_id) {
        try {
            $category = Category::where('id', $category_id)
            ->firstOrFail();

            return response()->json([ 'category' => $category ], 200);
        } catch (ModelNotFoundException $ex) {
            return response()->json([ 'error' => $ex->getMessage, 'message' => $this->_try_again ], 500);
        }
    }

    public function update_category(Request $request, $category_id) {
        $request->validate([
            'category_name' => 'required|unique:category,category_name, ' . $category_id,
            'slug' => 'required|unique:category,slug, '. $category_id
        ]);

        DB::beginTransaction();
        try {
            $category = Category::where('id', $category_id)
            ->firstOrFail();

            foreach($request->all() as $key => $value) {
                if ($category->$key != $value) {
                    $category->$key = $value;
                }
            }

            $category->save();
            DB::commit();
            
            return response()->json([ 'message' => 'Category successfully updated!' ], 200);
        } catch (ModelNotFoundException $e) {
            DB::rollback();
            return response()->json([ 'error' => $e->getMessage(), 'message' => $this->_try_again ], 500);
        }
    }
}
