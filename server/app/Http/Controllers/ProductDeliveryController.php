<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Batches;
use App\Models\ProductDelivery;
use App\Models\CreditHistory;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ProductDeliveryController extends Controller
{
    public function generate_batch_number() {
        do {
            // Generate a random number portion for batch number
            $randomNumber = mt_rand(1000000, 9999999);
            $batch_num = 'BATCH ' . $randomNumber;
    
            // check if the batch number already exists
            $exists = DB::table('batches')->where('batch_num', $batch_num)->exists();

        } while ($exists);

        if ($exists) {
            return response()->json(['error' => 'Failed to generate unique batch number. Please try again.'], 500);
        } else {
            return response()->json(['batch_number' => $batch_num], 200);
        }
    }

    public function generate_delivery_poNumber() {
        do {
            // Generate a random number portion for batch number
            $randomNumber = mt_rand(10000000, 99999999);
            $delivery_poNumber = 'DELIVERY-PO' . $randomNumber;
    
            // check if the batch number already exists
            $exists = DB::table('product_delivery')->where('po_number', $delivery_poNumber)->exists();
        } while ($exists);

        if ($exists) {
            return response()->json(['error' => 'Failed to generate unique batch number. Please try again.'], 500);
        } else {
            return response()->json(['delivery_po_number' => $delivery_poNumber], 200);
        }
    }

    public function add_delivery_items(Request $request) {
        $items = $request->items;
        $rules = [
            '*.customer_id' => 'required|exists:customers,id',
            '*.po_number' => 'required|string|unique:product_delivery,po_number',
            '*.price' => 'required|regex:/^\d+(\.\d{1,2})?$/|min:1',
            '*.product_id' => 'required|exists:products,id',
            '*.quantity' => 'required|numeric|min:1',
            '*.subtotal' => 'required|regex:/^\d+(\.\d{1,2})?$/|min:1',
        ];

        // simple validation on batch_number
        $request->validate([
            'batch_number' => 'required|string|unique:batches,batch_num',
            'delivery_person' => 'required|exists:delivery_persons,id'
        ], [
            'batch_number.required' => 'Batch Number is required.',
            'batch_number.unique' => 'Batch Number already exists.',
            'delivery_person.required' => 'Delivery Person is required.',
            'delivery_person.exists' => 'Delivery person is not yet registered.' 
        ]);

        $validator = Validator::make($items, $rules);
        if ($validator->fails()) { // check if validation fails
            return response()->json([ 'errors' => $validator->errors() ], 422);
        }

        DB::beginTransaction();
        try {
            // save the batch number on batches table first
            $save_batch = Batches::create(['batch_num' => $request->batch_number]);
            $batch_id = $save_batch->id; // get the batch id of the saved batch number

            // save on the product_delivery table
            foreach($items as $item) {
                $delivery_data = [
                    'po_number' => $item['po_number'],
                    'batch_id' => $batch_id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $item['subtotal'],
                    'customer_id' => $item['customer_id'],
                    'delivery_status' => 0,
                    'delivery_person_id' => $request->delivery_person
                ];

                $save_item = ProductDelivery::create($delivery_data);
            }

            // get the totals of subtotal for each customers purchase
            $totals = [];
            foreach ($items as $item) {
                $customerId = $item['customer_id'];
                $subtotal = $item['subtotal'];

                if (!isset($totals[$customerId])) {
                    // If this is the first occurrence of the customer ID,
                    // initialize the subtotal for this customer.
                    $totals[$customerId] = $subtotal;
                } else {
                    // If the customer ID is already in the totals array,
                    // add the subtotal to the existing total.
                    $totals[$customerId] += $subtotal;
                }
            }

            // save credit history
            foreach ($totals as $customerId => $subtotal) {
                $credit_data = [
                    'customer_id' => $customerId,
                    'credit_amnt' => $subtotal,
                    'credit_status' => 0,
                    'credit_dateTime' => now()
                ];
                $save_credit = CreditHistory::create($credit_data);
            }

            DB::commit();
            return response()->json([ 'message' => 'Item(s) are ready for delivery.' ], 200);
            
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'error' => $e->getMessage(), 'message' => 'Oops, something went wrong. Please try again later.' ], 500);
        }
    }

    public function get_delivery_items() {
        $query = ProductDelivery::where('delivery_status', '!=', '2')
        ->with('products', 'delivery_persons', 'batches', 'customers');

        $get_items = $query->get();
        return response()->json([ 'items' => $get_items ], 200);
    }
}
