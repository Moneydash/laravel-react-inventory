<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProductController extends Controller
{
    public function add_product(Request $request) {
        $request->validate([
            'prod_img' => 'required|mimes:jpeg,jpg,png,gif|max:5120', // max of 5MB
            'prod_name' => 'required',
            'prod_sku' => 'required',
            'prod_barcode' => 'required',
            'prod_price' => 'required',
            'stocks' => 'required|integer',
            'weight' => 'required',
            'dimensions' => 'required',
            'prod_desc' => 'required',
            'is_variant' => 'required',
            'parent_product_id' => [
                'nullable',
                Rule::requiredIf(function () use ($request) {
                    return $request->is_variant === true;
                }),
            ],
            'category_id' => 'required',
            'suppliers' => 'required'
        ]);

        if ($request->hasFile('prod_img')) {
            $uploadedFile = $request->file('prod_img');
            $filepath = $uploadedFile->store('public/products'); // store the file in the "public" directory
        }

        $product_data = [
            'prod_img' => $filepath, // store the file path in the database
            'prod_name' => $request->prod_name,
            'prod_sku' => $request->prod_sku,
            'prod_barcode' => $request->prod_barcode,
            'prod_price' => $request->prod_price,
            'stocks' => $request->stocks,
            'weight' => $request->weight,
            'dimensions' => $request->dimensions,
            'prod_desc' => $request->prod_desc,
            'is_variant' => $request->is_variant,
            'parent_product_id' => $request->parent_product_id,
            'category_id' => $request->category_id,
            'warranty_info' => $request->warranty_info,
            'prod_status' => 1,
        ];

        $supplier_ids = explode(',', $request->suppliers);

        DB::beginTransaction();
        try {
            $product = Product::create($product_data);
            
            foreach ($supplier_ids as $key) {
                $insert = $product->suppliers()->attach($key, ['status' => 1]);
            }

            DB::commit();
            return response()->json([ 'message' => 'New inventory item has been added successfully!' ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'error_message' => $e->getMessage() ]);
        }
    }

    public function get_products_infos() {
        $products = Product::with('category', 'suppliers')
        ->where('prod_status', 1)
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json([ 'product_supplier' => $products ]);
    }

    public function get_products() {
        $products = Product::where('prod_status', 1)
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json([ 'products' => $products ]);
    }

    public function get_product($product_id) {
        $product = Product::with('category', 'suppliers')
        ->where('id', $product_id)
        ->first();

        return response()->json([ 'product_info' => $product ]);
    }

    public function get_parent_products() {
        $parent_products = Product::where('prod_status', 1)
        ->where('parent_product_id', null)
        ->get();
        
        return response()->json([ 'parent_products' => $parent_products ]);
    }

    public function update_product($product_id, Request $request) {
        $request->validate([
            'prod_name' => 'required',
            'prod_desc' => 'required',
            'category_id' => 'required',
            'suppliers' => 'required',
            'prod_barcode' => 'required',
            'weight' => 'required',
            'dimensions' => 'required',
            'prod_price' => 'required'
        ]);

        DB::beginTransaction();
        try {
            $product = Product::with('category', 'suppliers')->findOrFail($product_id);

            $original_suppliers = $product->suppliers->pluck('id')->all();
            $updated_suppliers = explode(',', $request->suppliers);

            $suppliers_to_detach = array_diff($original_suppliers, $updated_suppliers);
            $suppliers_to_attach = array_diff($updated_suppliers, $original_suppliers);
            
            if ($request->hasFile('prod_img')) {
                $request->validate([
                    'prod_img' => 'mimes:jpeg,jpg,png,gif|max:5120', // max of 5MB
                ]);
                $filepath = $request->file('prod_img')->store('public/products');
                $product->prod_img = $filepath;
            }

            if ($request->prod_name != $product->prod_name) {
                $product->prod_name = $request->prod_name;
            }

            if ($request->prod_sku != $product->prod_sku) {
                $product->prod_sku = $request->prod_sku;
            }

            if ($request->prod_barcode != $product->prod_barcode) {
                $product->prod_barcode = $request->prod_barcode;
            }

            if ($request->weight != $product->weight) {
                $product->weight = $request->weight;
            }

            if ($request->dimensions != $product->dimensions) {
                $product->dimensions = $request->dimensions;
            }

            if ($request->prod_price != $product->prod_price) {
                $product->prod_price = $request->prod_price;
            }

            if ($request->prod_desc != $product->prod_desc) {
                $product->prod_desc = $request->prod_desc;
            }

            if ($request->category_id != $product->category_id) {
                $product->category_id = $request->category_id;
            }

            if ($request->warranty_info != $product->warranty_info) {
                $product->warranty_info = $request->warranty_info;
            }

            if (!empty($suppliers_to_detach)) {
                $product->suppliers()->detach($suppliers_to_detach);
            }

            if (!empty($suppliers_to_attach)) {
                $product->suppliers()->attach($suppliers_to_attach);
            }

            $product->save();

            DB::commit();
            return response()->json([ 'message' => 'Inventory item has been updated successfully!' ]);
        } catch (ModelNotFoundException $e) {
            DB::rollback();
            return response()->json([ 'error_message' => $e->getMessage() ]);
        }
    }

    public function remove_product($product_id) {
        DB::beginTransaction();

        try {
            $product = Product::findOrFail($product_id);

            $product->prod_status = 0;
            $product->save();

            DB::commit();
            return response()->json([ 'message' => 'Inventory item has been removed.' ]);
        } catch (ModelNotFoundException $e) {
            DB::rollback();
            return response()->json([ 'error_message' => $e->getMessage() ]);
        }
    }

    public function get_product_price($product_id) {
        try {
            $product = Product::where('id', $product_id)
            ->where('prod_status', 1)
            ->firstOrFail();

            return response()->json([ 'price' => $product->prod_price ], 200);
        } catch (\Exception $e) {
            return response()->json([ 'error' => $e->getMessage(), 'message' => 'Oops, something went wrong, try again later.' ]);
        }
    }
}
