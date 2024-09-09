<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerType;
use App\Models\IndustryType;
use App\Models\CompanyInformation;
use App\Models\CreditHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CustomerController extends Controller
{
    private function generate_acctNumber() {
        $lastCustomer = Customer::withTrashed()->orderBy('account_number', 'desc')->first();
        if ($lastCustomer && !empty($lastCustomer->account_number)) {
            $lastAccountNumber = intval($lastCustomer->account_number);
        } else {
            $lastAccountNumber = 0;
        }

        $nextAccountNumber = $lastAccountNumber + 1;
        $formattedNumber = sprintf("%06d", $nextAccountNumber);

        return $formattedNumber;
    }
    
    # get the different types of customer
    public function get_types() {
        $type = CustomerType::get();
        return response()->json([ 'customer_types' => $type ], 200);
    }

    # get the different types of industry
    public function get_industries() {
        $industry = IndustryType::get();
        return response()->json([ 'industry_types' => $industry ], 200);
    }
    
    public function create_customer(Request $request) {
        $request->validate([
            'firstname' => 'required',
            'lastname' => 'required',
            'contact_number' => 'required',
            'email' => 'required|email|unique:customers',
            'customer_location' => 'required',
            'billing_address' => 'required',
            'shipping_address' => 'required',
            'tin' => 'required',
            'customer_type_id' => 'required',
            'has_company' => 'required|boolean',
            'industry_type_id' => 'required_if:has_company,1',
            'company_size' => 'required_if:has_company,1',
            'years' => 'required_if:has_company,1'
        ]);

        DB::beginTransaction();
        try {
            // insert the company information first to the company id
            $company = null;
            if ($request->has_company) {
                $company_info_data = [
                    'industry_type_id' => $request->industry_type_id,
                    'company_size' => $request->company_size,
                    'years_of_operation' => $request->years
                ];

                $company = CompanyInformation::create($company_info_data);
            }

            $customer_data = [
                'account_number' => $this->generate_acctNumber(),
                'firstname' => $request->firstname,
                'middlename' => $request->middlename ?? '',
                'lastname' => $request->lastname,
                'contact_number' => $request->contact_number,
                'email' => strtolower($request->email),
                'customer_location' => $request->customer_location,
                'billing_address' => $request->billing_address,
                'shipping_address' => $request->shipping_address,
                'tin' => $request->tin,
                'website' => $request->website ?? '',
                'social_link' => $request->social_link ?? '',
                'customer_notes' => $request->customer_notes ?? '',
                'has_company' => $request->has_company,
                'customer_type_id' => $request->customer_type_id,
                'company_info_id' => $company ? $company->id : null
            ];
            $customer = Customer::create($customer_data);
            
            DB::commit();
            return response()->json([ 'message' => 'Customer Data has been saved successfully.' ], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'error' => $e->getMessage() ], 500);
        }
    }

    public function get_customers(Request $request) {
        // Retrieve query parameters with default values
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 10);
        $search = $request->query('search', '');

        // Query the customers table with optional search and eager load relationships
        $query = Customer::with('company_info', 'customer_type');

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('firstname', 'like', "%{$search}%")
                ->orWhere('lastname', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('account_number', 'like', "%{$search}%");
            });
        }

        // Paginate the results
        $customers = $query->paginate($perPage, ['*'], 'page', $page);

        // Return the paginated customers in JSON format
        return response()->json($customers, 200);
    }

    public function get_customer($customer_id) {
        try {
            $customer_data = Customer::with('company_info', 'customer_type')->findOrFail($customer_id);

            return response()->json([ 'customer_data' => $customer_data ]);
        } catch (ModelNotFoundException $e) {
            return response()->json([ 'error' => $e->getMessage(), 'message' => 'Oops, something went wrong. Please try again later.' ]);
        }
    }

    public function update_customer($customer_id, Request $request) {
        $request->validate([
            'firstname' => 'required',
            'lastname' => 'required',
            'contact_number' => 'required',
            'email' => 'required|email|unique:customers,email,'.$customer_id,
            'customer_location' => 'required',
            'billing_address' => 'required',
            'shipping_address' => 'required',
            'tin' => 'required',
            'customer_type_id' => 'required',
            'has_company' => 'required|boolean',
            'industry_type_id' => 'required_if:has_company,1',
            'company_size' => 'required_if:has_company,1',
            'years' => 'required_if:has_company,1'
        ]);

        DB::beginTransaction();
        try {
            # company
            $company = null;
            $customer = Customer::where('id', $customer_id)->first();
            if (!$customer) {
                return response()->json([ 'error' => 'Customer not found.' ], 404);
            }

            # check if customer has company
            # if customer has company, update it
            if ($customer->company_info_id != null) {
                $company = CompanyInformation::where('id', $customer->company_info_id)->first();

                if (!$company) {
                    return response()->json([ 'error' => 'Company Information not found.' ], 404);
                }

                if ($request->has_company) {
                    foreach ($request->only([
                        'industry_type_id',
                        'company_size',
                        'years',
                    ]) as $key => $value) {
                        # sanitized value before updating
                        $sanitized = strip_tags(trim($value));
                        if ($key == 'years') {
                            if ($value != $company->years_of_operation) {
                                $company->years_of_operation = $sanitized;
                            }
                        } else {
                            if ($value != $company->key) {
                                $company->$key = $sanitized;
                            }
                        }
                    }
                    $company->save();
                } else {
                    # remove the company information and remove the company information
                    $customer->company_info_id = null;
                    $company->delete();
                }
            } else {
                # else create a new company if the customer has a new company
                if ($request->has_company) {
                    $company = [
                        'industry_type_id' => $request->industry_type_id,
                        'company_size' => $request->company_size,
                        'years_of_operation' => $request->years
                    ];
                    $company = CompanyInformation::create($company);
                }
                $customer->company_info_id = $company ? $company->id : null;
            }

                # customer
                foreach($request->except([
                    'industry_type_id',
                    'company_size',
                    'years',
                    'company_info_id'
                ]) as $key => $value) {
                    $sanitized = ($value == null || $value == '') ? null : strip_tags(trim($value));

                    if ($key == 'email') {
                        $sanitized = strtolower($sanitized);
                    }

                    if ($sanitized !== $customer->$key) {
                        $customer->$key = $sanitized;
                    }
                }

                $customer->save();
                DB::commit();

            return response()->json([ 'message' => 'Customer data has been updated successfully.', 'customer' => $customer ]);
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
        # Fetch customers with paid credits (credit_status = 1) from CreditHistory
        $paidCustomersQuery = CreditHistory::select('customer_id', DB::raw('MAX(id) as id'))
            ->where('credit_status', 1)
            ->groupBy('customer_id');
        
        $paidCustomerIds = $paidCustomersQuery->pluck('customer_id');
    
        # Fetch customers from CreditHistory that are already paid
        $paidCustomers = Customer::whereIn('id', $paidCustomerIds)->get();
    
        # Fetch customers who have no credit history (newly created customers)
        $newCustomers = Customer::whereNotIn('id', function ($query) {
            $query->select('customer_id')->from('credit_history');
        })->get();
    
        # Merge both collections
        $customers = $paidCustomers->merge($newCustomers);
    
        return response()->json(['customers' => $customers], 200);
    }

    public function remove_customer($customer_id) {
        DB::beginTransaction();
        try {
            $customer = Customer::findOrFail($customer_id);
            $customer->delete();

            DB::commit();
            return response()->json([ 'message' => 'Customer has been removed successfully.' ]);
        } catch (ModelNotFoundException $e) {
            DB::rollback();
            return response()->json([ 'error' => $e->getMessage() ]);
        }
    }

    // public function get_invoice($customer_id) {
    //     // $invoice 
    // }
}