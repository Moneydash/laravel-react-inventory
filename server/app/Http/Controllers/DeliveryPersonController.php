<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PrimaryId;
use App\Models\AuditTrail;
use App\Models\SecondaryId;
use App\Models\DeliveryPerson;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class DeliveryPersonController extends Controller
{
    public function get_primary_ids() {
        $primary_ids = PrimaryId::select(
            'id', 'name', 'description'
        )
        ->orderBy('order')
        ->get();
        
        return response()->json([ 'primary_ids' => $primary_ids ]);
    }

    public function get_secondary_ids() {
        $secondary_ids = SecondaryId::select(
            'id', 'name', 'description'
        )
        ->where('name', '!=', 'N/A')
        ->orderBy('order')
        ->get();

        return response()->json([ 'secondary_ids' => $secondary_ids ]);
    }

    public function create_delivery_person(Request $request) {
        $request->validate([
            'firstname' => 'required',
            'lastname' => 'required',
            'primaryID_id' => 'required',
            'primary_id_img' => 'required|mimes:jpeg,jpg,png,gif|max:5120',
            'secondaryID_id' => 'nullable',
            'secondary_id_img' => [
                'nullable',
                Rule::requiredIf(function () use ($request) {
                    return $request->secondaryID_id != null;
                }),
            ],
            'contact_number' => 'required',
            'email_address' => 'nullable|email|unique:delivery_persons',
            'home_address' => 'required',
        ]);
    
        $filepath_primary = null;
        if ($request->hasFile('primary_id_img')) {
            $uploadedFile_primary = $request->file('primary_id_img');
            $filepath_primary = $uploadedFile_primary->store('public/delivery_persons/primary');
        }
    
        $filepath_secondary = null;
        if ($request->hasFile('secondary_id_img')) {
            $request->validate([
                'secondary_id_img' => 'mimes:jpeg,jpg,png,gif|max:5120',
            ]);
            $uploadedFile_secondary = $request->file('secondary_id_img');
            $filepath_secondary = $uploadedFile_secondary->store('public/delivery_persons/secondary');
        }
        
        if ($request->secondaryID_id == null) {
            $nullId = SecondaryId::where('name', 'N/A')->first();
            # apply the n/a if secondary is null or if the user doesn't choose from the frontend
            $request->secondaryID_id = $nullId->id;
        }
    
        $delivery_person_data = [
            'firstname' => $request->firstname,
            'middlename' => $request->middlename,
            'lastname' => $request->lastname,
            'primaryID_id' => $request->primaryID_id,
            'primary_id_img' => $filepath_primary,
            'contact_number' => $request->contact_number,
            'secondaryID_id' => $request->secondaryID_id,
            'secondary_id_img' => $filepath_secondary,
            'email_address' => $request->email_address,
            'home_address' => $request->home_address,
        ];
    
        DB::beginTransaction();
        try {
            $delivery_person = DeliveryPerson::create($delivery_person_data);

            if ($delivery_person) {
                # track delivery personnel creation
                AuditTrail::create([
                    'user_id' => auth()->user()->id,
                    'action' => 'create',
                    'description' => 'Created delivery personnel. ID: ' . $delivery_person->id
                ]);
            }
    
            DB::commit();
            return response()->json(['message' => 'Delivery Personnel data has been saved successfully.'], 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function get_delivery_persons_table(Request $request) {
        # Retrieve query parameters with default values
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 10);
        $search = $request->query('search', '');

        $query = DeliveryPerson::with('primaryId', 'secondaryId');

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('firstname', 'like', "%{$search}%")
                ->orWhere('lastname', 'like', "%{$search}%")
                ->orWhere('contact_number', 'like', "%{$search}%");
            });
        }

        # Paginate the results
        $delivery_persons = $query->paginate($perPage, ['*'], 'page', $page);

        # track delivery personnel view
        AuditTrail::create([
            'user_id' => auth()->user()->id,
            'action' => 'view',
            'description' => 'Viewed all delivery personnels.'
        ]);

        return response()->json($delivery_persons, 200);
    }
    
    public function get_delivery_persons_list() {
        $delivery_persons = DeliveryPerson::where('delivery_status', 1) # check for delivery personnel availability
        ->orderBy('lastname')
        ->get();

        return response()->json([ 'delivery_persons' => $delivery_persons ], 200);
    }

    public function get_delivery_person($delivery_person_id) {
        try {
            $delivery_person_data = DeliveryPerson::findOrFail($delivery_person_id);

            # track delivery personnel view
            AuditTrail::create([
                'user_id' => auth()->user()->id,
                'action' => 'view',
                'description' => 'Viewed delivery personnel ID: ' . $delivery_person_id
            ]);

            return response()->json([ 'delivery_personnel_info' => $delivery_person_data ]);
        } catch (ModelNotFoundException $ex) {
            return response()->json([ 'error' => $ex->getMessage() ], 404);
        }
    }

    public function remove_delivery_person($delivery_person_id) {
        DB::beginTransaction();
        try {
            $delivery_person = DeliveryPerson::findOrFail($delivery_person_id);
            $delivery_person->delete();

            # track delivery personnel removal
            AuditTrail::create([
                'user_id' => auth()->user()->id,
                'action' => 'remove',
                'description' => 'Removed delivery personnel. ID: ' . $delivery_person->id
            ]);

            DB::commit();
            return response()->json([ 'message' => 'Delivery Personnel has been removed.' ], 200);
        } catch (ModelNotFoundException $e) {
            DB::rollback();
            return response()->json([ 'error' => $e->getMessage() ], 500);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'error' => $e->getMessage() ], 500);
        }
    }
}