<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\PurchaseOrder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\Cache;

class PurchaseOrderController extends Controller
{
    public function generate_po_number() {
        do {
            // Generate a random number portion for PO number
            $randomNumber = mt_rand(100000, 999999);
            $poNumber = "PO" . $randomNumber;
    
            // check if saved to cache
            $cached = Cache::get('po_numbers' . $poNumber);
            if (!$cached) {
                $exists = DB::table('purchase_orders')->where('po_number', $poNumber)->exists();
            } else {
                $exists = true; // Mark as existing to regenerate
            }
        } while ($exists);

        $cached_po = Cache::tags(['po_number'])->put('po_numbers' . $poNumber, true, 60);
        return response()->json(['po_number' => $poNumber], 200);
    }

    public function generate_tracking_number() {
        $length = 14; // character length for the tracking number
        $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $nums = '0123456789';
        $charactersLength = strlen($chars);
        $numbersLength = strlen($nums);
    
        do {
            // Generate a random alphanumeric portion for tracking number
            $bytes = openssl_random_pseudo_bytes($length);
            $track_num = 'IIQ';
            for ($i = 0; $i < $length; $i++) {
                $index = ord($bytes[$i]) % $charactersLength;
                $track_num .= $chars[$index];
            }
            for ($i = 0; $i < $length; $i++) {
                $index = ord($bytes[$i]) % $numbersLength;
                $track_num .= $nums[$index];
            }
    
            // Check if the tracking number already exists
            $exists = DB::table('purchase_orders')->where('tracking_num', $track_num)->exists();
    
        } while ($exists);
    
        return response()->json([ 'tracking_number' => $track_num ], 200);
    }

    public function add_purchase_order(Request $request) {
        $request->validate([
            'po_number' => 'required|unique:purchase_orders',
            'supplier_id' => 'required',
            'product_id' => 'required',
            'quantity' => 'required|integer',
            'unit_price' => 'required',
            'subtotal' => 'required',
            'tax_rate' => 'required',
            'tax_amount' => 'required',
            'discount' => 'required',
            'total' => 'required',
            'shipping_method' => 'required',
            'billing_address' => 'required',
            'documents' => 'required|mimes:pdf,doc,docx|max:5120',
            'priority_lvl' => 'required',
            'tracking_num' => 'required|unique:purchase_orders',
            'warehouse_id' => 'required'
        ]);

        // computation
        $subtotal = $request->quantity * $request->unit_price;
        $subtotal = number_format($subtotal, 2, ".", ""); // format before recompute on discounted subtotal
        $discounted_subtotal = $subtotal - ($subtotal * ($request->discount / 100));
        $discounted_subtotal = number_format($discounted_subtotal, 2, ".", "");
        $taxAmnt = $discounted_subtotal * ($request->tax_rate / 100);
        $taxAmnt = number_format($taxAmnt, 2, ".", "");
        $totalAmnt = $discounted_subtotal + $taxAmnt;
        $totalAmnt = number_format($totalAmnt, 2, ".", "");

        if ($request->hasFile('documents')) {
            $uploaded_documents = $request->file('documents');
            $filepath_documents = $uploaded_documents->store('public/purchase_order/documents');
        }

        $po_data = [
            'po_number' => $request->po_number,
            'supplier_id' => $request->supplier_id,
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
            'unit_price' => $request->unit_price,
            'subtotal' => $discounted_subtotal,
            'tax_rate' => $request->tax_rate,
            'tax_amount' => $taxAmnt,
            'discount' => $request->discount,
            'total' => $totalAmnt,
            'shipping_method' => $request->shipping_method,
            'billing_address' => $request->billing_address,
            'additional_charges' => $request->additional_charges,
            'documents' => $filepath_documents,
            'po_notes' => $request->po_notes,
            'priority_lvl' => $request->priority_lvl,
            'tracking_num' => $request->tracking_num,
            'order_status' => 0, # count as pending upon ordering
            'approval_status' => 0, # for approval status
            'date_of_order' => date('Y-m-d H:i:s'),
            'warehouse_id' => $request->warehouse_id
        ];

        DB::beginTransaction();
        try {
            PurchaseOrder::create($po_data);
            
            DB::commit();
            return response()->json([ 'message' => 'Successfully created a purchase!' ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'error_message' => $e->getMessage() ]);
        }
    }

    public function get_purchase_orders($approval_status) {
        $purchase_orders = PurchaseOrder::with('products', 'suppliers', 'warehouse')
        ->where('approval_status', $approval_status)
        ->orderBy('created_at', 'desc')
        ->get();

        return response()->json([ 'purchase_order_data' => $purchase_orders ]);
    }

    public function get_purchase_order($purchase_order_number) {
        $purchase_order_data = PurchaseOrder::where('po_number', $purchase_order_number)
        ->first();

        return response()->json([ 'purchase_order_data' => $purchase_order_data ]);
    }

    public function update_purchase_order($purchase_order_number, Request $request) {
        $po = PurchaseOrder::where('po_number', $purchase_order_number)->first();
        $request->validate([
            'po_number' => 'required|unique:purchase_orders,po_number,'.$po->id,
            'supplier_id' => 'required',
            'product_id' => 'required',
            'quantity' => 'required|integer',
            'unit_price' => 'required',
            'subtotal' => 'required',
            'tax_rate' => 'required',
            'tax_amount' => 'required',
            'discount' => 'required',
            'total' => 'required',
            'shipping_method' => 'required',
            'billing_address' => 'required',
            'priority_lvl' => 'required',
            'tracking_num' => 'required|unique:purchase_orders,tracking_num,'.$po->id,
            'warehouse_id' => 'required'
        ]);

        // computation
        $subtotal = $request->quantity * $request->unit_price;
        $subtotal = number_format($subtotal, 2, ".", ""); // format before recompute on discounted subtotal
        $discounted_subtotal = $subtotal - ($subtotal * ($request->discount / 100));
        $discounted_subtotal = number_format($discounted_subtotal, 2, ".", "");
        $taxAmnt = $discounted_subtotal * ($request->tax_rate / 100);
        $taxAmnt = number_format($taxAmnt, 2, ".", "");
        $totalAmnt = $discounted_subtotal + $taxAmnt;
        $totalAmnt = number_format($totalAmnt, 2, ".", "");

        DB::beginTransaction();
        try {
            $purchase_order = PurchaseOrder::where('po_number', $purchase_order_number)->first();
            foreach ($request->except(['documents']) as $key => $value) {
                if ($value != $purchase_order->$key) {
                    $purchase_order->$key = $value;
                    switch ($key) {
                        case 'subtotal':
                            $purchase_order->subtotal = $discounted_subtotal;
                            break;
                        case 'tax_amount':
                            $purchase_order->tax_amount = $taxAmnt;
                            break;
                        case 'total':
                            $purchase_order->total = $totalAmnt;
                            break;
                        default:
                            break;
                    }
                }
            }

            if ($request->hasFile('documents')) {
                $request->validate([
                    'documents' => 'mimes:pdf,doc,docx|max:5120'
                ]);
                $filepath = $request->file('documents')->store('public/purchase_order/documents');
                $purchase_order->documents = $filepath;
            }
    
            $purchase_order->save();
            DB::commit();
            $closed = $request->order_status == 2 ? ' and has been closed.' : '';
            return response()->json(['message' => 'Purchase order has been updated' . $closed]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error_message' => $e->getMessage()]);
        }
    }

    public function purchase_approval($po_number, $status) {
        DB::beginTransaction();
        try {
            $purchase_order = PurchaseOrder::where('po_number', $po_number)->first();
            $message = '';

            if (!$purchase_order) {
                return response()->json([ 'error' => 'Purchase order not found.' ], 404);
            }

            switch ($status) {
                case 1:
                    $purchase_order->approval_status = 1;
                    $purchase_order->shipping_date = now();
                    $message = 'approved';
                    break;
                case 2:
                    $purchase_order->approval_status = 2;
                    $purchase_order->shipping_date = null;
                    $message = 'disapproved';
                    break;
                default:
                    return response()->json([ 'error' => 'Invalid status' ], 400);
            }

            $purchase_order->save();
            DB::commit();
            return response()->json([ 'message' => "Purchase has been $message" ], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'error' => $e->getMessage(), 'message' => 'Oops, something went wrong. Please try again later.' ]);
        }
    }

    public function closeOrder($po_number) {
        DB::beginTransaction();
        try {
            $purchase_order = PurchaseOrder::where('po_number', $po_number)->first();
            $purchase_order->order_status = 1;
            $purchase_order->save();

            $product = Product::where('id', $purchase_order->product_id)->first();
            $product->stocks = $product->stocks + $purchase_order->quantity;
            $product->save();
            
            DB::commit();
            return response()->json([ 'message' => 'Order is complete and close!' ], 200);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'error' => $e->getMessage(), 'message' => 'Oops, something went wrong. Please try again later.' ]);
        }
    }
}
