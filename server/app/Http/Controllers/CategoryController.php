<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\AuditTrail;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CategoryController extends Controller
{
    private $_try_again = 'Oops, something went wrong. Please try again later.';
    public function get_categories() {
        $category = Category::get();

        AuditTrail::create([
            'user_id' => auth()->user()->id,
            'action' => 'view',
            'description' => 'Viewed all categories.'
        ]);

        return response()->json([ 'categories' => $category ]);
    }

    public function store(Request $request) {
        $request->validate([
            'name' => 'required|unique:category',
            'slug' => 'required|unique:category'
        ]);

        $category_data = [
            'name' => $request->name,
            'slug' => $request->slug,
            'description' => trim($request->description)
        ];

        DB::beginTransaction();
        try {
            $category = Category::create($category_data);

            # Ensure the category is created before logging the audit trail
            if ($category) {
                # track category creation
                AuditTrail::create([
                    'user_id' => auth()->user()->id,
                    'action' => 'create',
                    'description' => 'Category ' . $category->name . ' has been created.'
                ]);
            }

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

            # track category view
            AuditTrail::create([
                'user_id' => auth()->user()->id,
                'action' => 'view',
                'description' => 'Viewed category ' . $category->name . '.'
            ]);

            return response()->json([ 'category' => $category ], 200);
        } catch (ModelNotFoundException $ex) {
            return response()->json([ 'error' => $ex->getMessage, 'message' => $this->_try_again ], 500);
        }
    }

    public function update_category(Request $request, $category_id) {
        DB::beginTransaction();
        try {
            $category = Category::where('id', $category_id)
            ->firstOrFail();

            foreach($request->all() as $key => $value) {
                if ($category->$key != $value) {
                    if ($key != 'description') {
                        $request->validate([
                            $key => "unique:category,$key," . $category_id,
                        ]);
                        $category->$key = $value;
                    } else {
                        $category->$key = $value;
                    }
                }
            }

            # track category update
            AuditTrail::create([
                'user_id' => auth()->user()->id,
                'action' => 'update',
                'description' => 'Category has been updated. ID: '.$category_id
            ]);

            $category->save();
            DB::commit();
            
            return response()->json([ 'message' => 'Category successfully updated!' ], 200);
        } catch (ModelNotFoundException $e) {
            DB::rollback();
            return response()->json([ 'error' => $e->getMessage(), 'message' => $this->_try_again ], 500);
        }
    }
}
