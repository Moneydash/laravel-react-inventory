<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Supplier;
use App\Models\AuditTrail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class SupplierController extends Controller
{
    private $_try_again = 'Oops, something went wrong. Please try again later.';
    public function add_supplier(Request $request) {
        $request->validate([
            'name' => 'required',
            'location' => 'required',
            'email' => 'required|email|unique:suppliers',
            'hotline' => 'required|integer',
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
            $supplier = Supplier::create([
                'name' => $request->name,
                'location' => $request->location,
                'email' => strtolower($request->email),
                'hotline' => $request->hotline,
                'contact_person' => $request->contact_person,
                'contact_person_number' => $request->contact_person_number,
                'contract_expiry_date' => $request->contract_expiry_date,
                'terms_and_conditions' => $filepath_terms,
                'agreement' => $filepath_agreement
            ]);

            if ($supplier) {
                # track add supplier
                AuditTrail::create([
                    'user_id' => auth()->user()->id,
                    'action' => 'add',
                    'description' => 'Added a new supplier partner.'
                ]);
            }

            DB::commit();
            return response()->json([ 'message' => 'Supplier Partner has been added successfully!' ]);
        } catch (\Exception $exception) {
            DB::rollback();
            return response()->json([ 'message' => $this->_try_again, 'error' => $exception ]);
        }
    }

    # get all suppliers
    public function get_suppliers() {
        $suppliers = Supplier::where('contract_expiry_date', '>', today())
        ->orderBy('created_at', 'desc')
        ->get();

        # track view suppliers
        AuditTrail::create([
            'user_id' => auth()->user()->id,
            'action' => 'view',
            'description' => 'Viewed all supplier partners.'
        ]);

        return response()->json([ 'suppliers' => $suppliers ]);
    }

    # get specific supplier
    public function get_supplier($supplier_id) {
        try {
            $supplier = Supplier::where('id', $supplier_id)->firstOrFail();

            # track view supplier
            AuditTrail::create([
                'user_id' => auth()->user()->id,
                'action' => 'view',
                'description' => 'Viewed supplier partner. ID: '.$supplier_id
            ]);

            return response()->json([ 'supplier_info' => $supplier ]);
        } catch (ModelNotFoundException $exception) {
            return response()->json([ 'error' => $exception->getMessage(), 'message' => $this->_try_again ]);
        }
    }

    public function update_supplier($supplier_id, Request $request) {
        $request->validate([
            'name' => 'required',
            'location' => 'required',
            'email' => 'required|email|unique:suppliers,email,'.$supplier_id,
            'hotline' => 'required|integer',
            'contact_person' => 'required',
            'contact_person_number' => 'required',
            'contract_expiry_date' => 'required|date',
        ]);

        DB::beginTransaction();
        try {
            $supplier = Supplier::findOrFail($supplier_id);

            foreach ($request->except(['terms', 'agreement']) as $key => $value) {
                if ($value != $supplier->$key) {
                    $sanitized_value = strip_tags(trim($value));
                    $supplier->$key = $sanitized_value;
                }
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

            # track update supplier
            AuditTrail::create([
                'user_id' => auth()->user()->id,
                'action' => 'update',
                'description' => 'Updated supplier partner. ID: '.$supplier->id
            ]);

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

            # track remove supplier
            AuditTrail::create([
                'user_id' => auth()->user()->id,
                'action' => 'remove',
                'description' => 'Removed supplier partner. ID: '.$supplier->id
            ]);

            $supplier->delete();
            DB::commit();
            return response()->json([ 'message' => 'Supplier Partner has been removed.' ], 200);
        } catch (ModelNotFoundException $e) {
            DB::rollback();
            return response()->json([ 'message' => 'Supplier does not exists.' ], 404);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'message' => 'Supplier Partner removal failed, please try again later.' ], 500);
        }
    }

    # get the removed or deleted suppliers
    public function get_removed_suppliers() {
        $suppliers = Supplier::onlyTrashed()->get();
        return response()->json([ 'removed_suppliers' => $suppliers ]);
    }

    # restore the deleted or removed supplier
    public function restore_supplier($supplier_id) {
        DB::beginTransaction();
        try {
            $supplier = Supplier::withTrashed()->findOrFail($supplier_id);

            # track restore supplier
            AuditTrail::create([
                'user_id' => auth()->user()->id,
                'action' => 'restore',
                'description' => 'Restored supplier partner. ID: '.$supplier->id
            ]);

            $supplier->restore();
            DB::commit();

            return response()->json([ 'message' => 'Supplier Partner has been restored.' ]);
        } catch (ModelNotFoundException $ex) {
            DB::rollback();
            return response()->json([ 'error' => $ex->getMessage(), 'message' => $this->_try_again ]);
        }
    }

    # get the provided products of a specific supplier
    public function get_supplier_products($supplier_id) {
        $supplier_products = Product::whereHas('suppliers', function ($query) use ($supplier_id) {
            $query->where('suppliers.id', $supplier_id); // get the specific supplier id
        })->get();
    
        return response()->json([ 'supplier_products' => $supplier_products ]);
    }

    public function download_file($type, $supplier_id) {
        $supplier = Supplier::where('id', $supplier_id)->first();

        if (!$supplier) {
            return response()->json([ 'message' => 'Supplier does not exists.' ], 404);
        }
        
        $path = $type == 'terms'
        ? $supplier->terms_and_conditions
        : ($type == 'agreement'
        ? $supplier->agreement
        : '');

        // sanitized the file path, avoiding directory traversal attack
        $sanitized_path = trim($path);
        $ext = pathinfo($sanitized_path, PATHINFO_EXTENSION);

        # track download file
        AuditTrail::create([
            'user_id' => auth()->user()->id ?? null,
            'action' => 'download',
            'description' => 'Downloaded supplier file. ID: ' . $supplier->id
        ]);

        $filepath = storage_path("app/".$sanitized_path);
        $filename = $type == 'terms' ? '_Terms and Conditions.' : ($type == 'agreement' ? '_Contract Agreement.' : '');
        $filename = $supplier->id.$filename.$ext;
        
        return response()->download($filepath, $filename);
    }
}