<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Supplier;
use App\Models\AuditTrail;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProductController extends Controller
{
    public function add_product(Request $request) {
        $request->validate([
            'image' => 'required|mimes:jpeg,jpg,png,gif|max:5120', // max of 5MB
            'name' => 'required',
            'sku' => 'required',
            'barcode' => 'required',
            'price' => 'required',
            'stocks' => 'required|integer',
            'weight' => 'required',
            'dimensions' => 'required',
            'description' => 'required',
            'is_variant' => 'required',
            'parent_product_id' => [
                'nullable',
                Rule::requiredIf(function () use ($request) {
                    return $request->is_variant === true;
                }),
            ],
            'has_serial' => 'required',
            'serial_number' => 'required_if:has_serial,==,1',
            'category_id' => 'required',
            'warehouse_id' => 'required',
            'suppliers' => 'required'
        ]);

        if ($request->hasFile('image')) {
            $uploadedFile = $request->file('image');
            $filepath = $uploadedFile->store('public/products'); // store the file in the "public" directory
        }

        $product_data = [
            'image' => $filepath, // store the file path in the database
            'name' => $request->name,
            'sku' => $request->sku,
            'barcode' => $request->barcode,
            'price' => $request->price,
            'stocks' => $request->stocks,
            'weight' => $request->weight,
            'dimensions' => $request->dimensions,
            'description' => $request->description,
            'is_variant' => $request->is_variant,
            'parent_product_id' => $request->parent_product_id,
            'has_serial' => $request->has_serial,
            'serial_number' => $request->serial_number,
            'category_id' => $request->category_id,
            'warehouse_id' => $request->warehouse_id,
            'warranty_info' => $request->warranty_info,
            'status' => $request->stocks <= 0
            ? 0 
            : ($request->stocks <= 20
            ? 2
            : ($request->stocks >= 100
            ? 1
            : 0)),
        ];

        $supplier_ids = explode(',', $request->suppliers);

        DB::beginTransaction();
        try {
            $product = Product::create($product_data);
            
            foreach ($supplier_ids as $key) {
                $product->suppliers()->attach($key, ['status' => 1]);
            }

            if ($product) {
                # track product creation
                AuditTrail::create([
                    'user_id' => auth()->user()->id,
                    'action' => 'create',
                    'description' => 'Created product ID: ' . $product->id
                ]);
            }

            DB::commit();
            return response()->json([ 'message' => 'New inventory item has been added successfully!' ], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'error_message' => $e->getMessage() ], 500);
        }
    }

    public function get_products_infos() {
        $products = Product::with('category', 'suppliers', 'warehouse')
        ->orderBy('created_at', 'desc')
        ->get();

        # track product view
        AuditTrail::create([
            'user_id' => auth()->user()->id,
            'action' => 'view',
            'description' => 'Viewed all products.'
        ]);

        return response()->json([ 'product_supplier' => $products ]);
    }

    public function get_products() {
        $products = Product::where('status', 1)
        ->orderBy('created_at', 'desc')
        ->get();

        # track product view
        AuditTrail::create([
            'user_id' => auth()->user()->id,
            'action' => 'view',
            'description' => 'Viewed all products.'
        ]);

        return response()->json([ 'products' => $products ]);
    }

    public function get_product($product_id) {
        $product = Product::with('category', 'suppliers')
        ->where('id', $product_id)
        ->first();

        if (!$product) {
            return response()->json([ 'error' => 'Product not found.' ], 404);
        }

        # track product view
        AuditTrail::create([
            'user_id' => auth()->user()->id,
            'action' => 'view',
            'description' => 'Viewed product ID: ' . $product->id
        ]);

        return response()->json([ 'product_info' => $product ]);
    }

    public function get_parent_products() {
        $parent_products = Product::where('parent_product_id', null)
        ->get();
        
        return response()->json([ 'parent_products' => $parent_products ], 200);
    }

    public function get_parent_products_exclude_self($product_id) {
        $parent_products = Product::where('parent_product_id', null)
        ->where('id', '!=', $product_id)
        ->get();

        return response()->json([ 'parent_products' => $parent_products ], 200);
    }

    public function update_product($product_id, Request $request) {
        $request->validate([
            'name' => 'required',
            'description' => 'required',
            'category_id' => 'required',
            'suppliers' => 'required',
            'barcode' => 'required',
            'weight' => 'required',
            'dimensions' => 'required',
            'price' => 'required'
        ]);

        DB::beginTransaction();
        try {
            $product = Product::with('category', 'suppliers')->findOrFail($product_id);

            $original_suppliers = $product->suppliers->pluck('id')->all();
            $updated_suppliers = explode(',', $request->suppliers);

            $suppliers_to_detach = array_diff($original_suppliers, $updated_suppliers);
            $suppliers_to_attach = array_diff($updated_suppliers, $original_suppliers);
            
            foreach ($request->except(['image', 'suppliers']) as $key => $value) {
                if ($value != $product->$key) {
                    $product->$key = $value;
                }
            }

            if ($request->hasFile('image')) {
                $request->validate([
                    'image' => 'mimes:jpeg,jpg,png,gif|max:5120', // max of 5MB
                ]);
                $filepath = $request->file('image')->store('public/products');
                $product->image = $filepath;
            }

            if (!empty($suppliers_to_detach)) {
                $product->suppliers()->detach($suppliers_to_detach);
            }

            if (!empty($suppliers_to_attach)) {
                $product->suppliers()->attach($suppliers_to_attach);
            }

            # track product update
            AuditTrail::create([
                'user_id' => auth()->user()->id,
                'action' => 'update',
                'description' => 'Updated product ID: ' . $product->id
            ]);

            $product->save();
            DB::commit();
            return response()->json([ 'message' => 'Inventory item has been updated successfully!' ]);
        } catch (ModelNotFoundException $e) {
            DB::rollback();
            return response()->json([ 'error_message' => $e->getMessage() ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'error_message' => $e->getMessage() ]);
        }
    }

    public function remove_product($product_id) {
        DB::beginTransaction();
        try {
            $product = Product::findOrFail($product_id);

            # track product removal
            AuditTrail::create([
                'user_id' => auth()->user()->id,
                'action' => 'remove',
                'description' => 'Removed product ID: ' . $product->id
            ]);

            $product->delete();
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
            ->where('status', 1)
            ->firstOrFail();

            return response()->json([ 'price' => $product->price ], 200);
        } catch (\Exception $e) {
            return response()->json([ 'error' => $e->getMessage(), 'message' => 'Oops, something went wrong, try again later.' ]);
        }
    }

    public function download_image($product_id) {
        $product = Product::where('id', $product_id)->first();

        $path = $product->image;
        $sanitized_path = trim($path);
        $ext = pathinfo($sanitized_path, PATHINFO_EXTENSION);

        # track product image download
        AuditTrail::create([
            'user_id' => auth()->user()->id ?? null,
            'action' => 'download',
            'description' => 'Downloaded product image. ID: ' . $product->id
        ]);

        $file_path = storage_path("app/".$sanitized_path);
        $file_name = $product_id.'_Product Image.'.$ext;

        return response()->download($file_path, $file_name);
    }
}
