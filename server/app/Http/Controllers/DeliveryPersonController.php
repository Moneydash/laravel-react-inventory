<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PrimaryId;
use App\Models\SecondaryId;
use App\Models\DeliveryPerson;
use Illuminate\Support\Facades\DB;

class DeliveryPersonController extends Controller
{
    public function get_primary_ids() {
        $primary_ids = PrimaryId::get();
        
        return response()->json([ 'primary_ids' => $primary_ids ]);
    }

    public function get_secondary_ids() {
        $secondary_ids = SecondaryId::get();

        return response()->json([ 'secondary_ids' => $secondary_ids ]);
    }

    public function create_delivery_person(Request $request) {
        $request->validate([
            'firstname' => 'required',
            'lastname' => 'required',
            'primaryID_id' => 'required',
            'primary_id_img' => 'required|mimes:jpeg,jpg,png,gif|max:5120',
            'secondary_id_img' => 'required_if:secondaryID_id,!=,null',
            'contact_number' => 'required',
            'email_address' => 'email|unique:delivery_persons',
            'home_address' => 'required'
        ]);

        if ($request->hasFile('primary_id_img')) {
            $uploadedFile_primary = $request->file('primary_id_img');
            $filepath_primary = $uploadedFile_primary->store('public/delivery_persons/primary'); // store the file in the "public" directory
        }

        if ($request->hasFile('secondary_id_img')) {
            $uploadedFile_secondary = $request->file('secondary_id_img');
            $filepath_secondary = $uploadedFile_secondary->store('public/delivery_persons/secondary'); // store the file in the "public" directory
        }

        $delivery_person_data = [
            'firstname' => $request->firstname,
            'middlename' => $request->middlename,
            'lastname' => $request->lastname,
            'primaryID_id' => $request->primaryID_id,
            'primary_id_img' => $filepath_primary,
            'secondaryID_id' => $request->secondaryID_id,
            'secondary_id_img' => $filepath_secondary,
            'contact_number' => $request->contact_number,
            'email_address' => $request->email_address,
            'home_address' => $request->home_address,
            'status' => 1
        ];

        DB::beginTransaction();
        try {
            DeliveryPerson::create($delivery_person_data);

            DB::commit();
            return response()->json([ 'message' => 'Delivery Personnel data has been saved successfully.' ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'error' => $e->getMessage() ]);
        }
    }

    public function get_delivery_persons() {
        $delivery_persons = DeliveryPerson::where('status', 1)
        ->with('primaryId', 'secondaryId')
        ->get();

        return response()->json([ 'delivery_persons' => $delivery_persons ]);
    }

    public function get_delivery_person($delivery_person_id) {
        $delivery_person_data = DeliveryPerson::findOrFail($delivery_person_id)
        ->where('status', 1)
        ->first();

        return response()->json([ 'delivery_personnel_info' => $delivery_person_data ]);
    }

    public function remove_delivery_person($delivery_person_id) {
        DB::beginTransaction();

        try {
            $delivery_person = DeliveryPerson::findOrFail($delivery_person_id)
            ->where('status', 1)
            ->first();

            $delivery_person->status = 0;
            $delivery_person->save();

            DB::commit();
            return response()->json([ 'message' => 'Delivery Personnel has been removed.' ]);
        } catch (ModelNotFoundException $e) {
            DB::rollback();
            return response()->json([ 'error' => $e->getMessage() ]);
        }
    }
}
