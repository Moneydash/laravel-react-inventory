<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class SupplierController extends Controller
{
    public function add_supplier(Request $request) {
        $request->validate([
            'supp_name' => 'required',
            'supp_loc' => 'required',
            'supp_email' => 'required|email|unique:suppliers',
            'supp_hotline' => 'required|integer',
            'contact_person' => 'required',
            'contact_person_number' => 'required',
            'contract_expiry_date' => 'required|date'
        ]);

        DB::beginTransaction();

        try {
            Supplier::create([
                'supp_name' => $request->supp_name,
                'supp_loc' => $request->supp_loc,
                'supp_email' => strtolower($request->supp_email),
                'supp_hotline' => $request->supp_hotline,
                'contact_person' => $request->contact_person,
                'contact_person_number' => $request->contact_person_number,
                'contract_expiry_date' => $request->contract_expiry_date
            ]);

            DB::commit();
            return response()->json([ 'message' => 'Supplier Partner has been added successfully!' ]);
        } catch (\Exception $exception) {
            DB::rollback();
            return response()->json([ 'message' => 'Error occur, please try again later!', 'error' => $exception ]);
        }
    }

    public function get_suppliers() {
        $suppliers = Supplier::where('supp_status', 1)
        ->where('contract_expiry_date', '>', today())
        ->orderBy('created_at', 'desc')
        ->get();
        return response()->json([ 'suppliers' => $suppliers ]);
    }

    public function get_supplier($supplier_id) {
        $supplier = Supplier::where('id', $supplier_id)->first();
        return response()->json([ 'supplier_info' => $supplier ]);
    }

    public function update_supplier($supplier_id, Request $request) {
        $request->validate([
            'supp_name' => 'required',
            'supp_loc' => 'required',
            'supp_email' => 'required|email',
            'supp_hotline' => 'required|integer',
            'contact_person' => 'required',
            'contact_person_number' => 'required',
            'contract_expiry_date' => 'required|date'
        ]);

        DB::beginTransaction();
        try {
            $supplier = Supplier::findOrFail($supplier_id);

            // check if there are changes on the fields.
            if ($request->supp_name !== $supplier->supp_name) {
                $supplier->supp_name = $request->supp_name;
            }

            if ($request->supp_loc !== $supplier->supp_loc) {
                $supplier->supp_loc = $request->supp_loc;
            }

            if (strtolower($request->supp_email) !== strtolower($supplier->supp_email)) {
                $request->validate([ 'supp_email' => 'unique:suppliers' ]);
                $supplier->supp_email = strtolower($request->supp_email);
            }

            if ($request->supp_hotline !== $supplier->supp_hotline) {
                $supplier->supp_hotline = $request->supp_hotline;
            }

            if ($request->contact_person !== $supplier->contact_person) {
                $supplier->contact_person = $request->contact_person;
            }

            if ($request->contact_person_number !== $supplier->contact_person_number) {
                $supplier->contact_person_number = $request->contact_person_number;
            }

            if ($request->contract_expiry_date !== $supplier->contract_expiry_date) {
                $supplier->contract_expiry_date = $request->contract_expiry_date;
            }

            $supplier->save();

            DB::commit();
            return response()->json([ 'message' => 'Supplier Information has been updated!' ]);
        } catch (ModelNotFoundException $e) {
            DB::rollback();
            return response()->json([ 'message' => 'Update failed, please try again later!' ]);
        }
    }

    public function remove_supplier($supplier_id) {
        DB::beginTransaction();

        try {
            $supplier = Supplier::findOrFail($supplier_id);

            $supplier->supp_status = 0;
            $supplier->save();
            DB::commit();
            return response()->json([ 'message' => 'Supplier Partner has been removed.' ]);
        } catch (ModelNotFoundException $e) {
            DB::rollback();
            return response()->json([ 'message' => 'Supplier Partner removal failed, please try again later.' ]);
        }
    }

    public function get_removed_suppliers() {
        $suppliers = Supplier::where('supp_status', 0)->get();
        return response()->json([ 'removed_suppliers' => $suppliers ]);
    }

    public function get_supplier_products($supplier_id) {
        $supplier_products = Product::whereHas('suppliers', function ($query) use ($supplier_id) {
            $query->where('suppliers.id', $supplier_id); // get the specific supplier id
        })->where('products.prod_status', 1)->get(); // get the active product status
    
        return response()->json(['supplier_products' => $supplier_products]);
    }
}