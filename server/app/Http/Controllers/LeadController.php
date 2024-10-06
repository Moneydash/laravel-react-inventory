<?php

namespace App\Http\Controllers;

use App\Http\Requests\Lead\StoreLeadRequest;
use App\Models\AuditTrail;
use App\Models\Leads;
use Illuminate\Http\Request;
use App\Models\LeadSource;
use App\Models\LeadTitle;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class LeadController extends Controller
{
    private $_errMsg = 'Oops, something went wrong. Please try again later.';
    public function get_lead_sources() {
        $sources = LeadSource::get();
        return response()->json([ 'lead_sources' => $sources ], 200);
    }

    public function get_lead_job_roles() {
        $roles = LeadTitle::get();
        return response()->json([ 'lead_roles' => $roles ], 200);
    }

    public function store(StoreLeadRequest $request) {
        DB::beginTransaction();
        try {
            $lead = Leads::create($request->only([
                'firstname',
                'lastname',
                'email',
                'contact_num',
                'lead_owner',
                'lead_source_id',
                'company_name',
                'industry_type_id',
                'job_title_id',
                'lead_status',
                'notes',
                'website',
                'interests',
                'campaign'
            ]));

            if ($lead) {
                # track lead creation
                AuditTrail::create([
                    'user_id' => auth()->user()->id,
                    'action' => 'add',
                    'description' => 'Sales Lead has been added. ID: '.$lead->id
                ]);
            }

            DB::commit();
            return response()->json([ 'message' => 'Lead has been added successfully.' ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Lead Creation failed', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => $e->getMessage(),
                'message' => $this->_errMsg
            ], 500);
        }
    }

    public function index(Request $request) {
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 10);
        $search = $request->query('search', '');

        $search_cols = ['id', 'lead_owner', 'firstname', 'lastname', 'email'];
        $with_tables = ['lead_source', 'lead_title', 'industry'];

        AuditTrail::create([
            'user_id' => auth()->user()->id,
            'action' => 'view',
            'description' => 'Viewed all Sales Leads. Page: '.$page." Rows-per-Page: ".$perPage
        ]);

        $leads = paginate_table($page, $perPage, $search, new Leads(), $with_tables, $search_cols);

        return response()->json($leads, 200);
    }

    public function get($lead_id) {
        try {
            $lead = Leads::findOrFail($lead_id);
            # track lead view
            AuditTrail::create([
                'user_id' => auth()->user()->id,
                'action' => 'view',
                'description' => 'Viewed Lead Information. ID: '.$lead->id
            ]);
            return response()->json([ 'lead' => $lead ], 200);
        } catch (ModelNotFoundException $e) {
            Log::error('Fetch Lead Failed', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([ 'error' => $e->getMessage(), 'message' => 'Lead Not found.' ], 400);
        } catch (\Exception $e) {
            Log::error('Fetch Lead Failed', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([ 'error' => $e->getMessage(), 'message' => 'Something went wrong. Please try again later.' ], 500);
        }
    }
    
    public function update(StoreLeadRequest $request, $lead_id) {
        try {
            # Attempt to find the lead or fail
            $lead = Leads::findOrFail($lead_id);
    
            # Begin the transaction here, inside the try block
            DB::beginTransaction();
    
            # Extract and sanitize input fields from the request
            $sanitizedData = array_map(fn($value) => strip_tags(trim($value)), $request->only([
                'firstname', 'lastname', 'email', 'contact_num', 'lead_owner',
                'lead_source_id', 'company_name', 'industry_type_id', 
                'job_title_id', 'lead_status', 'notes', 'website', 
                'interests', 'campaign'
            ]));

            AuditTrail::create([
                'user_id' => auth()->user()->id,
                'action' => 'update',
                'description' => 'Sales Lead has been updated. ID: '.$lead->id
            ]);

            $lead->update($sanitizedData);
            DB::commit();
    
            return response()->json(['message' => 'Lead has been updated successfully.'], 200);
    
        } catch (ModelNotFoundException $e) {
            # Handle the case where the lead is not found
            Log::error('Fetch Lead Failed', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => $e->getMessage(), 'message' => 'Lead not found.'], 404);
    
        } catch (\Exception $e) {
            # Rollback in case of failure during the transaction
            DB::rollBack();
    
            # Log the exception
            Log::error('Update Lead Failed', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
    
            return response()->json(['error' => $e->getMessage(), 'message' => 'Something went wrong. Please try again later.'], 500);
        }
    }    
}