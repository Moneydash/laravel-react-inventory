<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CreditHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CustomerController extends Controller
{
    public function create_customer(Request $request) {
        $request->validate([
            'customer_img' => 'required|mimes:jpeg,jpg,png,gif|max:5120',
            'firstname' => 'required',
            'lastname' => 'required',
            'contact_number' => 'required',
            'email' => 'required|email|unique:customers',
            'customer_location' => 'required'
        ]);

        if ($request->hasFile('customer_img')) {
            $uploadedFile = $request->file('customer_img');
            $filepath = $uploadedFile->store('public/customers'); // store the file in the "public" directory
        }

        $customer_data = [
            'customer_img' => $filepath,
            'firstname' => $request->firstname,
            'middlename' => $request->middlename === '' ? '' : $request->middlename,
            'lastname' => $request->lastname,
            'contact_number' => $request->contact_number,
            'email' => strtolower($request->email),
            'customer_location' => $request->customer_location
        ];

        DB::beginTransaction();
        try {
            Customer::create($customer_data);
            
            DB::commit();
            return response()->json([ 'message' => 'Customer Data has been saved successfully.' ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'error' => $e->getMessage() ]);
        }
    }

    public function get_customers() {
        $customers = Customer::where('customer_status', 1)->get();

        return response()->json([ 'customers' => $customers ]);
    }

    public function get_customer($customer_id) {
        $customer_data = Customer::findOrFail($customer_id)
        ->where('customer_status', 1)
        ->first();

        return response()->json([ 'customer_data' => $customer_data ]);
    }

    public function update_customer($customer_id, Request $request) {
        $request->validate([
            'firstname' => 'required',
            'lastname' => 'required',
            'contact_number' => 'required',
            'email' => 'required|email',
            'customer_location' => 'required'
        ]);

        DB::beginTransaction();
        try {
            $customer = Customer::findOrFail($customer_id)
            ->where('customer_status', 1)
            ->first();

            if ($request->hasFile('customer_img')) {
                $request->validate([
                    'customer_img' => 'mimes:jpeg,jpg,png,gif|max:5120', // max of 5MB
                ]);
                $filepath = $request->file('customer_img')->store('public/customers');
                $customer->customer_img = $filepath;
            }

            if ($request->firstname != $customer->firstname) {
                $customer->firstname = $request->firstname;
            }

            if ($request->middlename != $customer->middlename) {
                $customer->middlename = $request->middlename;
            }

            if ($request->lastname != $customer->lastname) {
                $customer->lastname = $request->lastname;
            }

            if ($request->contact_number != $customer->contact_number) {
                $customer->contact_number = $request->contact_number;
            }

            if (strtolower($request->email) != strtolower($customer->email)) {
                $request->validate([ 'email' => 'unique:customers' ]);
                $customer->email = strtolower($request->email);
            }

            if ($request->customer_location != $customer->customer_location) {
                $customer->customer_location = $request->customer_location;
            }

            $customer->save();

            DB::commit();
            return response()->json([ 'message' => 'Customer data has been updated successfully.' ]);
        } catch (ModelNotFoundException $e) {
            DB::rollback();
            return response()->json([ 'error' => $e->getMessage() ]);
        }
    }

    public function get_customer_payment($customer_id) {
        $query = CreditHistory::select('customer_id', DB::raw('MAX(id) as id'))
        ->where('customer_id', $customer_id)
        ->where('credit_status', 0)
        ->groupBy('customer_id');

        $credit = $query->first();

        return response()->json([ 'credit_standing' => $credit ], 200);
    }
    
    public function get_clear_customers() {
        $query = CreditHistory::select('customer_id', DB::raw('MAX(id) as id'))
        ->where('credit_status', 1)
        ->with('customers')
        ->groupBy('customer_id');
    
        $customers = $query->get();
        return response()->json([ 'customers' => $customers ], 200);
    }

    public function deactivate_customer($customer_id) {
        DB::beginTransaction();

        try {
            $customer = Customer::findOrFail($customer_id)
            ->where('customer_status', 1)
            ->first();

            $customer->customer_status = 0;
            $customer->save();

            DB::commit();
            return response()->json([ 'message' => 'Customer has been deactivated successfully.' ]);
        } catch (ModelNotFoundException $e) {
            DB::rollback();
            return response()->json([ 'error' => $e->getMessage() ]);
        }
    }
}
