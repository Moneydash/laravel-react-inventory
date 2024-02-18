<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\PurchaseOrder;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class PurchaseOrderController extends Controller
{
    public function generate_po_number() {
        do {
            // Generate a random number portion
            $randomNumber = mt_rand(100000, 999999);
    
            // Create the PO number
            $poNumber = "PO" . $randomNumber;
    
            // Check if the PO number already exists in the database
            $exists = DB::table('purchase_orders')->where('po_number', $poNumber)->exists();
        } while ($exists);

        return response()->json([ 'po_number' => $poNumber ]);
    }

    public function add_purchase_order(Request $request) {
        $request->validate([
            'po_number' => 'required|unique:purchase_orders',
            'supplier_id' => 'required',
            'billing_address' => 'required',
            'shipping_address' => 'required',
            'product_id' => 'required',
            'quantity' => 'required|integer',
            'unit_price' => 'required',
            'subtotal' => 'required',
            'order_status' => 'required'
        ]);

        $subtotal = $request->quantity * $request->unit_price;
        $subtotal = number_format($subtotal, 2, '.', '');

        $purchase_order_data = [
            'po_number' => $request->po_number,
            'supplier_id' => $request->supplier_id,
            'billing_address' => $request->billing_address,
            'shipping_address' => $request->shipping_address,
            'product_id' => $request->product_id,
            'quantity' => $request->quantity,
            'unit_price' => $request->unit_price,
            'subtotal' => $subtotal,
            'order_status' => $request->order_status,
            'purchase_order_notes' => $request->purchase_order_notes,
            'delivery_notes' => $request->delivery_notes,
            'date_of_order' => date('Y-m-d H:i:s')
        ];

        DB::beginTransaction();
        try {
            PurchaseOrder::create($purchase_order_data);
            
            DB::commit();
            return response()->json([ 'message' => 'Successfully purchase an order!' ]);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([ 'error_message' => $e->getMessage() ]);
        }
    }

    public function get_purchase_orders() {
        $purchase_orders = PurchaseOrder::with('products', 'suppliers')
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
        $request->validate([
            'supplier_id' => 'required',
            'billing_address' => 'required',
            'shipping_address' => 'required',
            'product_id' => 'required',
            'quantity' => 'required|integer',
            'unit_price' => 'required',
            'order_status' => 'required'
        ]);

        DB::beginTransaction();
        try {
            $purchase_order = PurchaseOrder::where('po_number', $purchase_order_number)->first();
            $purchase_order->fill($request->only([
                'supplier_id', 'billing_address', 'shipping_address', 'product_id', 'quantity',
                'unit_price', 'order_status', 'purchase_order_notes', 'delivery_notes'
            ]));
    
            $purchase_order->subtotal = number_format($request->quantity * $request->unit_price, 2, '.', '');
    
            if ($request->order_status == 2) {
                $product = Product::findOrFail($purchase_order->product_id);
                $product->stocks = $product->stocks + $purchase_order->quantity;
                $product->save();
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
}
