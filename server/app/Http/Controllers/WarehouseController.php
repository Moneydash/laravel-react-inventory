<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;

class WarehouseController extends Controller
{
    private $_try_again = 'Oops, something went wrong. Please try again later.';
    public function store(Request $request) {
        // return response()->json([ 'request' => $request->all() ]);
        $request->validate([
            'name' => 'required',
            'location' => 'required',
            'contact_person' => 'required',
            'person_conno' => 'required',
            'email' => 'required|email|unique:warehouse',
            'hotline' => 'required',
            'warehouseType_id' => 'required',
            'opening_hrs' => 'required',
            'closing_hrs' => 'required',
            'landmark' => 'required',
            'size_area' => 'required',
            'insurance_info' => 'required|mimes:pdf,doc,docx|max:5120',
            'certifications_compliance' => 'required|mimes:pdf,doc,docx|max:5120',
            'usage' => 'required',
            'is_biohazard' => 'required|boolean',
            'precautionary_measure' => 'required_if:is_biohazard,==,true',
            'maintenance_schedule' => 'required',
            'vendor_contracts' => 'required|mimes:pdf,doc,docx|max:5120',
            'equipments' => 'required',
            'categories' => 'required'
        ]);

        if ($request->hasFile('insurance_info')) {
            $uploaded_insurance = $request->file('insurance_info');
            $filepath_insurance = $uploaded_insurance->store('public/warehouse/insurance');
        }

        if ($request->hasFile('certifications_compliance')) {
            $uploaded_certifications = $request->file('certifications_compliance');
            $filepath_certifications = $uploaded_certifications->store('public/warehouse/certifications');
        }
        
        if ($request->hasFile('vendor_contracts')) {
            $uploaded_vendorContract = $request->file('vendor_contracts');
            $filepath_contract = $uploaded_vendorContract->store('public/warehouse/vendor_contracts');
        }

        $warehouse_data = [
            'name' => $request->name,
            'location' => $request->location,
            'contact_person' => $request->contact_person,
            'person_conno' => $request->person_conno,
            'email' => $request->email,
            'hotline' => $request->hotline,
            'warehouseType_id' => $request->warehouseType_id,
            'opening_hrs' => $request->opening_hrs,
            'closing_hrs' => $request->closing_hrs,
            'landmark' => $request->landmark,
            'description' => $request->description,
            'size_area' => $request->size_area,
            'insurance_info' => $filepath_insurance,
            'certifications_compliance' => $filepath_certifications,
            'usage' => $request->usage,
            'is_biohazard' => $request->is_biohazard,
            'precautionary_measure' => $request->precautionary_measure,
            'maintenance_schedule' => $request->maintenance_schedule,
            'vendor_contracts' => $filepath_contract,
            'min_temp' => $request->min_temp,
            'max_temp' => $request->max_temp,
            'special_handling_info' => $request->special_handling_info,
            'facebook_link' => $request->facebook_link,
            'twitter_link' => $request->twitter_link
        ];

        DB::beginTransaction();
        try {
            $sanitized_data = [];
            foreach($warehouse_data as $key => $value) {
                $sanitized_data[$key] = strip_tags(trim($value));
            }
            $warehouse = Warehouse::create($sanitized_data);

            $equipments = explode(",", $request->equipments);
            foreach ($equipments as $key) {
                $warehouse->equipment()->attach($key);
            }

            $categories = explode(",", $request->categories);
            foreach ($categories as $key) {
                $warehouse->category()->attach($key);
            }

            DB::commit();
            return response()->json([ 'message' => 'Warehouse is added successfully!' ], 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'error' => $e->getMessage(), 'message' => $this->_try_again ], 500);
        }
    }

    public function get_warehouses() {
        $warehouse = Warehouse::with(
            'warehouse_type',
            'equipment',
            'category')
        ->get();

        return response()->json([ 'warehouses' => $warehouse ]);
    }

    public function get_warehouse($warehouse_id) {
        try {
            $query = Warehouse::where('id', $warehouse_id)
            ->with(
                'warehouse_type',
                'equipment',
                'category'
            );
            $warehouse = $query->first();
            return response()->json([ 'warehouse' => $warehouse ], 200);
        } catch (ModelNotFoundException $e) {
            return response()->json([ 'error' => $e->getMessage(), 'message' => $this->_try_again ], 404);
        }
    }

    public function update_warehouse(Request $request, $warehouse_id) {
        $request->validate([
            'name' => 'required',
            'location' => 'required',
            'contact_person' => 'required',
            'person_conno' => 'required',
            'email' => 'required|email|unique:warehouse,email,'.$warehouse_id,
            'hotline' => 'required',
            'warehouseType_id' => 'required',
            'opening_hrs' => 'required',
            'closing_hrs' => 'required',
            'landmark' => 'required',
            'size_area' => 'required',
            'usage' => 'required',
            'is_biohazard' => 'required|boolean',
            'precautionary_measure' => 'required_if:is_bioharzard,==,true',
            'maintenance_schedule' => 'required',
            'equipments' => 'required',
            'categories' => 'required'
        ]);

        DB::beginTransaction();
        try {
            $warehouse = Warehouse::where('id', $warehouse_id)
            ->first();

            // attach and detaching of updated and previous categories
            $original_categories = $warehouse->category->pluck('id')->all();
            $updated_categories = explode(',', $request->categories);
            $categories_to_detach = array_diff($original_categories, $updated_categories);
            $categories_to_attach = array_diff($updated_categories, $original_categories);

            $original_equipments = $warehouse->equipment->pluck('id')->all();
            $updated_equipments = explode(',', $request->equipments);
            $equipments_to_detach = array_diff($original_equipments, $updated_equipments);
            $equipments_to_attach = array_diff($updated_equipments, $original_equipments);

            foreach ($request->except([
                'equipments',
                'categories',
                'insurance_info',
                'certifications_compliance',
                'vendor_contracts'
            ]) as $key => $value) {
                if ($value != $warehouse->$key) {
                    $sanitized_value = strip_tags(trim($value));

                    if ($key == 'email') {
                        $warehouse->$key = strtolower($sanitized_value);
                    } else {
                        $warehouse->$key = $sanitized_value;
                    }
                }
            }

            if ($request->hasFile('insurance_info')) {
                $request->validate([
                    'insurance_info' => 'mimes:pdf,doc,docx|max:5120'
                ]);
                $uploaded_insurance = $request->file('insurance_info');
                $filepath_insurance = $uploaded_insurance->store('public/warehouse/insurance');
                $warehouse->insurance_info = $filepath_insurance;
            }
    
            if ($request->hasFile('certifications_compliance')) {
                $request->validate([
                    'certifications_compliance' => 'mimes:pdf,doc,docx|max:5120'
                ]);
                $uploaded_certifications = $request->file('certifications_compliance');
                $filepath_certifications = $uploaded_certifications->store('public/warehouse/certifications');
                $warehouse->certifications_compliance = $filepath_certifications;
            }
            
            if ($request->hasFile('vendor_contracts')) {
                $request->validate([
                    'vendor_contracts' => 'mimes:pdf,doc,docx|max:5120'
                ]);
                $uploaded_vendorContract = $request->file('vendor_contracts');
                $filepath_contract = $uploaded_vendorContract->store('public/warehouse/vendor_contracts');
                $warehouse->$vendor_contracts = $filepath_contract;
            }

            if (!empty($categories_to_detach)) {
                $warehouse->category()->detach($categories_to_detach);
            }

            if (!empty($categories_to_attach)) {
                $warehouse->category()->attach($categories_to_attach);
            }

            if (!empty($equipments_to_detach)) {
                $warehouse->equipment()->detach($equipments_to_detach);
            }

            if (!empty($equipments_to_attach)) {
                $warehouse->equipment()->attach($equipments_to_attach);
            }

            $warehouse->save();
            DB::commit();
            return response()->json([ 'message' => 'Warehouse successfully updated!' ], 200);

        } catch (ModelNotFoundException | \Exception $e) {
            DB::rollback();
            return response()->json([ 'error' => $e->getMessage(), 'message' => $this->_try_again ]);
        }
    }

    public function remove_warehouse($warehouse_id) {
        DB::beginTransaction();
        try {
            $warehouse = Warehouse::findOrFail($warehouse_id);

            $warehouse->delete();
            DB::commit();
            return response()->json([ 'message' => 'Warehouse successfully removed!' ], 200);
        } catch (ModelNotFoundException $e) {
            DB::rollback();
            return response()->json([ 'error' => $e->getMessage(), 'message' => $this->_try_again ], 404);
        }
    }

    public function download_file($type, $warehouse_id) {
        $warehouse = Warehouse::where('id', $warehouse_id)->first();

        if (!$warehouse) {
            return response()->json([ 'message' => 'Warehouse does not exists.' ], 404);
        }
        
        $path = $type == 'insurance'
        ? $warehouse->insurance_info
        : ($type == 'certifications'
        ? $warehouse->certifications_compliance
        : ($type == 'contract'
        ? $warehouse->vendor_contracts
        : ''));

        // get extension and sanitized file path to prevent directory traversal attacks
        $sanitized_path = trim($path);
        $ext = pathinfo($sanitized_path, PATHINFO_EXTENSION);
        
        // get the file path and set the file name for download
        $file_path = storage_path("app/".$sanitized_path);
        $file_name = $type == 'insurance' ? '_Insurance Info.' : ($type == 'certifications' ? '_Certifications and Compliance.' : ($type == 'contract' ? '_Vendor Contract.' : ''));
        $file_name = $warehouse->id.$file_name.$ext;
        
        return response()->download($file_path, $file_name);
    }

    public function get_category_warehouse($category_id) {
        try {
            $warehouses = Warehouse::whereHas('category', function($query) use ($category_id) {
                $query->where('category.id', $category_id); // Specify the table name for the id column
            })->get();
            return response()->json([ 'warehouses' => $warehouses ], 200);
        } catch (ModelNotFoundException | \Exception $e) {
            return response()->json([ 'error' => $e->getMessage() ]);
        }
    }
}