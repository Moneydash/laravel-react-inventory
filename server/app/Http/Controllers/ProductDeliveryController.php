<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Batches;
use App\Models\ProductDelivery;
use App\Models\CreditHistory;
use App\Models\DeliveryPerson;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;

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
            # save the batch number on batches table first
            $save_batch = Batches::create(['batch_num' => $request->batch_number]);
            $batch_id = $save_batch->id; // get the batch id of the saved batch number

            # save on the product_delivery table
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

            # get the totals of subtotal for each customers purchase
            $subtotals = [];
            foreach ($items as $item) {
                $customerId = $item['customer_id'];
                $subtotal = $item['subtotal'];

                if (!isset($subtotals[$customerId])) {
                    # If this is the first occurrence of the customer ID,
                    # initialize the subtotal for this customer.
                    $subtotals[$customerId] = $subtotal;
                } else {
                    # If the customer ID is already in the totals array,
                    # add the subtotal to the existing total.
                    $subtotals[$customerId] += $subtotal;
                }
            }

            # get the totals of quantity for each customers purchase
            $quantities = [];
            foreach ($items as $item) {
                $productId = $item['product_id'];
                $quantity = $item['quantity'];

                if (!isset($quantities[$productId])) {
                    # If this is the first occurrence of the product ID,
                    # initialize the quantity for the customer selected product.
                    $quantities[$productId] = $quantity;
                } else {
                    # If the product ID is already in the totals array,
                    # add the quantity to the existing total quantity.
                    $quantities[$productId] += $quantity;
                }
            }

            # update product stocks
            foreach($quantities as $productId => $quantity) {
                $product = Product::where('id', $productId)->first();
                $stocks = $product->stocks - $quantity;
                $product->stocks = $stocks <= 0 ? 0 : $stocks; // put zero if the subtracted quantity is a negative value
                $product->save();
            }

            # save credit history
            foreach ($subtotals as $customerId => $subtotal) {
                $credit_data = [
                    'customer_id' => $customerId,
                    'credit_amnt' => $subtotal,
                    'credit_status' => 0,
                    'credit_dateTime' => now()
                ];
                $save_credit = CreditHistory::create($credit_data);
            }

            $delivery_person = DeliveryPerson::where('id', $request->delivery_person)->first();
            if (!$delivery_person) {
                return response()->json([ 'message' => 'Delivery Personnel not found.' ], 404);
            }

            # make the delivery personnel unavailable
            # because he is delivering customers items
            $delivery_person->delivery_status = 0;
            $delivery_person->save();

            DB::commit();
            return response()->json([ 'message' => 'Item(s) are ready for delivery.' ], 200);
            
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'error' => $e->getMessage(), 'message' => 'Oops, something went wrong. Please try again later.' ], 500);
        }
    }

    public function get_delivery_items(Request $request) {
        // Retrieve query parameters with default values
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 10);
        $search = $request->query('search', '');

        $query = ProductDelivery::with('products', 'delivery_persons', 'batches', 'customers');

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('po_number', 'like', "%{$search}%")
                ->orWhereHas('batches', function($q) use ($search) {
                    $q->where('batch_num', 'like', "%{$search}%");
                })
                ->orWhereHas('customers', function($q) use ($search) {
                    $q->where('firstname', 'like', "%{$search}%")
                    ->orWhere('lastname', 'like', "%{$search}%");
                });
            });
        }

        $items = $query->paginate($perPage, ['*'], 'page', $page);
        return response()->json($items, 200);
    }

    public function update_status($status, $delivery_id) {
        DB::beginTransaction();
        $message = $status == 1 ? 'Item has been picked up!' : 'Item has been delivered';
        
        try {
            $item = ProductDelivery::where('id', $delivery_id)->firstOrFail();
            
            # update only if the delivery_status is not 2 or delivered/completed
            if ($item->delivery_status != 2) {
                $item->delivery_status = $status;
                $item->save();
    
                # Check if all items assigned to the delivery person are completed
                $deliveryPersonId = $item->delivery_person_id;
                $allItemsCompleted = ProductDelivery::where('delivery_person_id', $deliveryPersonId)
                    ->where('delivery_status', '!=', 2)
                    ->exists();
    
                if (!$allItemsCompleted) {
                    # Update delivery person's status to 'completed' or any appropriate status
                    $deliveryPerson = DeliveryPerson::where('id', $deliveryPersonId)->firstOrFail();
                    $deliveryPerson->delivery_status = 1;
                    $deliveryPerson->save();
                }
            }
    
            DB::commit();
            return response()->json([ 'message' => $message ], 200);
        } catch (ModelNotFoundException $e) {
            DB::rollback();
            return response()->json(['error' => $e->getMessage(), 'message' => 'Oops, something went wrong. Please try again later.'], 500);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => $e->getMessage(), 'message' => 'Oops, something went wrong. Please try again later.'], 500);
        }
    }
}
