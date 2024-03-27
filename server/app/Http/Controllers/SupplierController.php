<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class SupplierController extends Controller
{
    private $_try_again = 'Oops, something went wrong. Please try again later.';
    public function add_supplier(Request $request) {
        $request->validate([
            'supp_name' => 'required',
            'supp_loc' => 'required',
            'supp_email' => 'required|email|unique:suppliers',
            'supp_hotline' => 'required|integer',
            'contact_person' => 'required',
            'contact_person_number' => 'required',
            'contract_expiry_date' => 'required|date',
            'terms' => 'required|mimes:pdf,doc,docx|max:5120',
            'agreement' => 'required|mimes:pdf,doc,docx|max:5120'
        ]);

        if ($request->hasFile('terms')) {
            $uploaded_terms = $request->file('terms');
            $filepath_terms = $uploaded_terms->store('public/suppliers/terms_and_conditions'); // store the file in the "public" directory
        }

        if ($request->hasFile('agreement')) {
            $uploaded_agreement = $request->file('agreement');
            $filepath_agreement = $uploaded_agreement->store('public/suppliers/agreements'); // store the file in the "public" directory
        }


        DB::beginTransaction();
        try {
            Supplier::create([
                'supp_name' => $request->supp_name,
                'supp_loc' => $request->supp_loc,
                'supp_email' => strtolower($request->supp_email),
                'supp_hotline' => $request->supp_hotline,
                'contact_person' => $request->contact_person,
                'contact_person_number' => $request->contact_person_number,
                'contract_expiry_date' => $request->contract_expiry_date,
                'terms_and_conditions' => $filepath_terms,
                'agreement' => $filepath_agreement
            ]);

            DB::commit();
            return response()->json([ 'message' => 'Supplier Partner has been added successfully!' ]);
        } catch (\Exception $exception) {
            DB::rollback();
            return response()->json([ 'message' => $this->_try_again, 'error' => $exception ]);
        }
    }

    public function get_suppliers() {
        $suppliers = Supplier::where('contract_expiry_date', '>', today())
        ->orderBy('created_at', 'desc')
        ->get();
        return response()->json([ 'suppliers' => $suppliers ]);
    }

    public function get_supplier($supplier_id) {
        try {
            $supplier = Supplier::where('id', $supplier_id)->firstOrFail();
            return response()->json([ 'supplier_info' => $supplier ]);
        } catch (ModelNotFoundException $exception) {
            return response()->json([ 'error' => $exception->getMessage(), 'message' => $this->_try_again ]);
        }
    }

    public function update_supplier($supplier_id, Request $request) {
        $request->validate([
            'supp_name' => 'required',
            'supp_loc' => 'required',
            'supp_email' => 'required|email',
            'supp_hotline' => 'required|integer',
            'contact_person' => 'required',
            'contact_person_number' => 'required',
            'contract_expiry_date' => 'required|date',
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

            if ($request->hasFile('terms')) {
                $request->validate([ 'terms' => 'mimes:pdf,doc,docx|max:5120' ]); // pdf, doc and docx file only, maximum to 5MB
                $filepath_terms = $request->file('terms')->store('public/suppliers/terms_and_conditions');
                $supplier->terms_and_conditions = $filepath_terms;
            }

            if ($request->hasFile('agreement')) {
                $request->validate([ 'agreement' => 'mimes:pdf,doc,docx|max:5120' ]);
                $filepath_agreement = $request->file('agreement')->store('public/suppliers/agreement');
                $supplier->agreement = $filepath_agreement;
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

            $supplier->delete();
            DB::commit();
            return response()->json([ 'message' => 'Supplier Partner has been removed.' ]);
        } catch (ModelNotFoundException $e) {
            DB::rollback();
            return response()->json([ 'message' => 'Supplier Partner removal failed, please try again later.' ]);
        }
    }

    public function get_removed_suppliers() {
        $suppliers = Supplier::onlyTrashed()->get();
        return response()->json([ 'removed_suppliers' => $suppliers ]);
    }

    public function restore_supplier($supplier_id) {
        DB::beginTransaction();
        try {
            $supplier = Supplier::withTrashed()->findOrFail($supplier_id);

            $supplier->restore();
            DB::commit();

            return response()->json([ 'message' => 'Supplier Partner has been restored.' ]);
        } catch (ModelNotFoundException $ex) {
            DB::rollback();
            return response()->json([ 'error' => $ex->getMessage(), 'message' => $this->_try_again ]);
        }
    }

    public function get_supplier_products($supplier_id) {
        $supplier_products = Product::whereHas('suppliers', function ($query) use ($supplier_id) {
            $query->where('suppliers.id', $supplier_id); // get the specific supplier id
        })->where('products.prod_status', 1)->get(); // get the active product status
    
        return response()->json([ 'supplier_products' => $supplier_products ]);
    }
}