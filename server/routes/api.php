<?php

// laravel dependencies
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// controllers
use App\Http\Controllers\UserController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\NavigationController;
use App\Http\Controllers\SubNavigationController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DeliveryPersonController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// routes for users (unauthenticated routes)
Route::post('/register', [UserController::class, 'register_user'])->name('user.register');
Route::post('/login', [UserController::class, 'login'])->name('user.login');

// Routes for users
Route::middleware(['auth:sanctum'])->prefix('user')->group(function() {
    Route::middleware('auth:sanctum')->post('/logout', [UserController::class, 'logout'])->name('user.logout');
    Route::middleware('auth:sanctum')->get('/get_users', [UserController::class, 'get_users_list'])->name('user.getAll');
    Route::middleware('auth:sanctum')->get('/get_roles', [UserController::class, 'get_roles'])->name('user.getRoles');
    Route::middleware('auth:sanctum')->post('/create_user', [UserController::class, 'create_user'])->name('user.create');
    Route::middleware('auth:sanctum')->get('/get_user/{user_id}', [UserController::class, 'get_user'])->name('user.get');
    Route::middleware('auth:sanctum')->put('/update_user/{user_id}', [UserController::class, 'update_user_role'])->name('user.updateRole');
    Route::middleware('auth:sanctum')->patch('/disable_user/{user_id}', [UserController::class, 'disable_user'])->name('user.disable');
    Route::middleware('auth:sanctum')->put('/update_account/{user_id}', [UserController::class, 'update_account'])->name('user.update');
    Route::middleware('auth:sanctum')->patch('/change_password/{user_id}', [UserController::class, 'change_password'])->name('user.changePass');
});

// check if the access token is valid and not modified on the client side...
Route::middleware('auth:sanctum')->get('/checkAuth', function () {
    return response()->json([ 'message' => 'Authenticated' ]);
})->name('checkAuth');

// Routes for supplier
Route::middleware(['auth:sanctum'])->prefix('supplier')->group(function() {
    Route::middleware('auth:sanctum')->post('/add_supplier', [SupplierController::class, 'add_supplier'])->name('supplier.add');
    Route::middleware('auth:sanctum')->get('/get_suppliers', [SupplierController::class, 'get_suppliers'])->name('supplier.getAll');
    Route::middleware('auth:sanctum')->get('/get_supplier/{supplier_id}', [SupplierController::class, 'get_supplier'])->name('supplier.getInfo');
    Route::middleware('auth:sanctum')->put('/update_supplier/{supplier_id}', [SupplierController::class, 'update_supplier'])->name('supplier.update');
    Route::middleware('auth:sanctum')->patch('/remove_supplier/{supplier_id}', [SupplierController::class, 'remove_supplier'])->name('supplier.remove');
    Route::middleware('auth:sanctum')->get('/get_removed_suppliers', [SupplierController::class, 'get_removed_suppliers'])->name('supplier.getRemoved');
    Route::middleware('auth:sanctum')->get('/get_supplier_products/{supplier_id}', [SupplierController::class, 'get_supplier_products'])->name('supplier.getProducts');
});

// Routes for categories
Route::middleware('auth:sanctum')->get('get_categories', [CategoryController::class, 'get_categories'])->name('category.getAll');

// Routes for products
Route::middleware(['auth:sanctum'])->prefix('product')->group(function() {
    Route::middleware('auth:sanctum')->post('/add_product', [ProductController::class, 'add_product'])->name('product.add');
    Route::middleware('auth:sanctum')->get('/get_products', [ProductController::class, 'get_products'])->name('product.getAll');
    Route::middleware('auth:sanctum')->get('/get_product/{product_id}', [ProductController::class, 'get_product'])->name('product.getInfo');
    Route::middleware('auth:sanctum')->post('/update_product/{product_id}', [ProductController::class, 'update_product'])->name('product.update');
    Route::middleware('auth:sanctum')->patch('/remove_product/{product_id}', [ProductController::class, 'remove_product'])->name('product.remove');
    Route::middleware('auth:sanctum')->get('/get_parent_products', [ProductController::class, 'get_parent_products'])->name('product.getParent');
});

// Routes for purchase orders
Route::middleware(['auth:sanctum'])->prefix('purchase_order')->group(function() {
    Route::middleware('auth:sanctum')->get('/generate_po_number', [PurchaseOrderController::class, 'generate_po_number'])->name('purchase_order.generatePoNumber');
    Route::middleware('auth:sanctum')->post('/add_purchase_order', [PurchaseOrderController::class, 'add_purchase_order'])->name('purchase_order.add');
    Route::middleware('auth:sanctum')->get('/get_purchase_orders', [PurchaseOrderController::class, 'get_purchase_orders'])->name('purchase_order.getAll');
    Route::middleware('auth:sanctum')->get('/get_purchase_order/{purchase_order_number}', [PurchaseOrderController::class, 'get_purchase_order'])->name('purchase_order.getInfo');
    Route::middleware('auth:sanctum')->put('/update_purchase_order/{purchase_order_number}', [PurchaseOrderController::class, 'update_purchase_order'])->name('purchase_order.update');
});

// Routes for customers
Route::middleware(['auth:sanctum'])->prefix('customer')->group(function() {
    Route::middleware('auth:sanctum')->post('/create_customer', [CustomerController::class, 'create_customer'])->name('customer.create');
    Route::middleware('auth:sanctum')->get('/get_customers', [CustomerController::class, 'get_customers'])->name('customer.getAll');
    Route::middleware('auth:sanctum')->get('/get_customer/{customer_id}', [CustomerController::class, 'get_customer'])->name('customer.getInfo');
    Route::middleware('auth:sanctum')->post('/update_customer/{customer_id}', [CustomerController::class, 'update_customer'])->name('customer.update');
    Route::middleware('auth:sanctum')->get('/get_customer_payment/{customer_id}', [CustomerController::class, 'get_customer_payment'])->name('customer.getPayment');
    Route::middleware('auth:sanctum')->patch('/remove_customer/{customer_id}', [CustomerController::class, 'deactivate_customer'])->name('customer.remove');
});

// Routes for delivery persons, getting of primary and secondary id is included also in this route
Route::middleware(['auth:sanctum'])->prefix('delivery_person')->group(function() {
    Route::middleware('auth:sanctum')->get('/get_primary', [DeliveryPersonController::class, 'get_primary_ids'])->name('delivery_person.get_primaryId');
    Route::middleware('auth:sanctum')->get('/get_secondary', [DeliveryPersonController::class, 'get_secondary_ids'])->name('delivery_person.get_secondaryId');
    Route::middleware('auth:sanctum')->post('/add_delivery_person', [DeliveryPersonController::class, 'create_delivery_person'])->name('delivery_person.create');
    Route::middleware('auth:sanctum')->get('/get_delivery_persons', [DeliveryPersonController::class, 'get_delivery_persons'])->name('delivery_person.getAll');
    Route::middleware('auth:sanctum')->get('/get_info/{delivery_person_id}', [DeliveryPersonController::class, 'get_delivery_person'])->name('delivery_person.getInfo');
    Route::middleware('auth:sanctum')->patch('/remove_delivery_person/{delivery_person_id}', [DeliveryPersonController::class, 'remove_delivery_person'])->name('delivery_person.remove');
});

// Route for user navigations based on assigned role
Route::middleware(['auth:sanctum'])->prefix('user_nav')->group(function() {
    Route::middleware('auth:sanctum')->get('/get_navigations/{role_id}', [NavigationController::class, 'get_navigations'])->name('navigations.getRoleNav'); // navigations
});

// Routes for sub navigations based on assigned role
Route::middleware(['auth:sanctum'])->prefix('user_sub_nav')->group(function() {
    Route::middleware('auth:sanctum')->get('/get_profile_sub_navigations/{role_id}', [SubNavigationController::class, 'get_profile_sub_navigations'])->name('subnavigations.getProfileSubNavRole');
    Route::middleware('auth:sanctum')->get('/get_prodDelivery_sub_navigations/{role_id}', [SubNavigationController::class, 'get_productDelivery_sub_navigations'])->name('subnavigations.getProductDelivery');
    Route::middleware('auth:sanctum')->get('/get_inventoryControl_sub_navigations/{role_id}', [SubNavigationController::class, 'get_inventoryControl_sub_navigations'])->name('subnavigations.getInventoryControl');
});