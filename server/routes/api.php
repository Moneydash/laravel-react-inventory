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
use App\Http\Controllers\ProductDeliveryController;
use App\Http\Controllers\WarehouseTypeController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\AuditTrailController;
use App\Http\Controllers\LeadController;

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

# routes for users (unauthenticated routes)
Route::post('register', [UserController::class, 'register_user'])->name('user.register');
Route::post('login', [UserController::class, 'login'])->name('user.login');

# unauthenticated routes for downloading files
Route::get('warehouse-file/download/{type}/{warehouse_id}', [WarehouseController::class, 'download_file'])->name('warehouse.downloadFile');
Route::get('product-image/download/{product_id}', [ProductController::class, 'download_image'])->name('product.downloadImage');
Route::get('supplier-file/download/{type}/{supplier_id}', [SupplierController::class, 'download_file'])->name('supplier.downloadFile');

# Routes for users
Route::middleware(['auth:api'])->prefix('user')->group(function() {
    # non-admin routes
    Route::post('logout', [UserController::class, 'logout'])->name('user.logout');
    Route::get('get_user/{user_id}', [UserController::class, 'get_user'])->name('user.get');
    Route::put('update_account/{user_id}', [UserController::class, 'update_account'])->name('user.update');
    Route::patch('change_password/{user_id}', [UserController::class, 'change_password'])->name('user.changePass');

    # super admin and admin routes
    Route::middleware('role:Super Admin,Administrator')->get('get_users', [UserController::class, 'get_users_list'])->name('user.getAll');
    Route::middleware('role:Super Admin,Administrator')->get('get_roles', [UserController::class, 'get_roles'])->name('user.getRoles');
    Route::middleware('role:Super Admin,Administrator')->post('create_user', [UserController::class, 'create_user'])->name('user.create');

    # super admin and admin routes
    Route::middleware('role:Super Admin')->delete('remove_user/{user_id}', [UserController::class, 'remove_user'])->name('user.remove');
    Route::middleware('role:Super Admin, Administrator')->put('update_user/{user_id}', [UserController::class, 'update_user_role'])->name('user.updateRole');
});

# check if the access token is valid and not modified on the client side...
Route::middleware('auth:api')->get('checkAuth', function () {
    return response()->json([ 'message' => 'Authenticated' ]);
})->name('checkAuth');

# Routes for the inventory
Route::middleware(['auth:api'])->prefix('inventory')->group(function() {
    # Routes for products - all users
    Route::prefix('product')->group(function() {
        Route::get('get_products_infos', [ProductController::class, 'get_products_infos'])->name('product.getAll');
    });

    # Routes for products - super admin, admin, staff manager
    Route::prefix('product')->middleware('role:Super Admin,Administrator,Staff Manager')->group(function() {
        Route::post('add_product', [ProductController::class, 'add_product'])->name('product.add');
        Route::get('get_products', [ProductController::class, 'get_products'])->name('product.getProductsOnly');
        Route::get('get_product/{product_id}', [ProductController::class, 'get_product'])->name('product.getInfo');
        Route::post('update_product/{product_id}', [ProductController::class, 'update_product'])->name('product.update');
        Route::get('get_parent_products', [ProductController::class, 'get_parent_products'])->name('product.getParent');
        Route::get('get_price/{product_id}', [ProductController::class, 'get_product_price'])->name('product.getPrice');
        Route::get('get_parent_products_exclude_self/{product_id}', [ProductController::class, 'get_parent_products_exclude_self'])->name('product.getParentExcludeSelf');
    });

    # super admin routes
    Route::prefix('product')->middleware('role:Super Admin')->group(function() {
        Route::delete('remove_product/{product_id}', [ProductController::class, 'remove_product'])->name('product.remove');
    });

    # Routes for categories - all users
    Route::prefix('category')->group(function() {
        Route::get('get_categories', [CategoryController::class, 'get_categories'])->name('category.getAll');
    });
    
    Route::prefix('category')->middleware('role:Super Admin, Administrator, Staff Manager')->group(function() {
        Route::get('get_category/{category_id}', [CategoryController::class, 'get_category'])->name('category.getInfo');
        Route::post('create', [CategoryController::class, 'store'])->name('category.add');
        Route::put('update/{category_id}', [CategoryController::class, 'update_category'])->name('category.update');
    });

    # Routes for suppliers
    Route::prefix('supplier')->middleware('role:Super Admin,Administrator,Staff Manager')->group(function() {
        Route::post('add_supplier', [SupplierController::class, 'add_supplier'])->name('supplier.add');
        Route::get('get_suppliers', [SupplierController::class, 'get_suppliers'])->name('supplier.getAll');
        Route::get('get_supplier/{supplier_id}', [SupplierController::class, 'get_supplier'])->name('supplier.getInfo');
        Route::post('update_supplier/{supplier_id}', [SupplierController::class, 'update_supplier'])->name('supplier.update');
        Route::get('get_supplier_products/{supplier_id}', [SupplierController::class, 'get_supplier_products'])->name('supplier.getProducts');
    });

    # super admin routes
    Route::prefix('supplier')->middleware('role:Super Admin')->group(function() {
        Route::delete('remove/{supplier_id}', [SupplierController::class, 'remove_supplier'])->name('supplier.remove');
        Route::get('get_removed_suppliers', [SupplierController::class, 'get_removed_suppliers'])->name('supplier.getRemoved');
        Route::put('restore/{supplier_id}', [SupplierController::class, 'restore_supplier'])->name('supplier.restore');
    });

    # Routes for purchase orders - super admin, admin, staff manager
    Route::prefix('purchase_order')->middleware('role:Super Admin,Administrator,Staff Manager')->group(function() {
        Route::get('generate_po_number', [PurchaseOrderController::class, 'generate_po_number'])->name('purchase_order.generatePoNumber');
        Route::get('generate_track_number', [PurchaseOrderController::class, 'generate_tracking_number'])->name('purchase_order.generateTrackingNumber');
        Route::post('add_purchase_order', [PurchaseOrderController::class, 'add_purchase_order'])->name('purchase_order.add');
        Route::get('get_purchase_orders/{approval_status}', [PurchaseOrderController::class, 'get_purchase_orders'])->name('purchase_order.getAll');
        Route::get('get_purchase_order/{purchase_order_number}', [PurchaseOrderController::class, 'get_purchase_order'])->name('purchase_order.getInfo');
        Route::post('update_purchase_order/{purchase_order_number}', [PurchaseOrderController::class, 'update_purchase_order'])->name('purchase_order.update');
        Route::patch('purchase_approval/{po_number}/{status}', [PurchaseOrderController::class, 'purchase_approval'])->name('purchase_order.updateApproval');
        Route::patch('close_order/{po_number}', [PurchaseOrderController::class, 'closeOrder'])->name('purchase_order.close');
    });

    # Routes for warehouse - super admin, admin, staff manager
    Route::prefix('warehouse')->middleware('role:Super Admin,Administrator,Staff Manager')->group(function() {
        Route::get('get_types', [WarehouseTypeController::class, 'get_types'])->name('warehouse.getTypes');
        Route::get('get_warehouses', [WarehouseController::class, 'get_warehouses'])->name('warehouse.getAll');
        Route::get('get_warehouse/{warehouse_id}', [WarehouseController::class, 'get_warehouse'])->name('warehouse.getInfos');
        Route::get('get_category_warehouse/{category_id}', [WarehouseController::class, 'get_category_warehouse'])->name('warehouse.getCategoryBased');
        Route::post('create', [WarehouseController::class, 'store'])->name('warehouse.create');
        Route::post('update_warehouse/{warehouse_id}', [WarehouseController::class, 'update_warehouse'])->name('warehouse.updateInfo');
        Route::delete('remove/{warehouse_id}', [WarehouseController::class, 'remove_warehouse'])->name('warehouse.remove');
    });

    # Routes for equipment - super admin, admin, staff manager
    Route::prefix('equipment')->middleware('role:Super Admin,Administrator,Staff Manager')->group(function() {
        Route::get('get_equipments', [EquipmentController::class, 'get_equipments'])->name('equipment.getAll');
    });
});

# Routes for delivery hub
Route::middleware(['auth:api'])->prefix('delivery')->group(function() {
    # Routes for customers under delivery hub module - super admin, admin, staff manager
    Route::prefix('customer')->middleware('role:Super Admin,Administrator,Staff Manager')->group(function() {
        Route::get('get_types', [CustomerController::class, 'get_types'])->name('customer.getCustomerTypes');
        Route::get('get_industries', [CustomerController::class, 'get_industries'])->name('customer.getIndustries');
        Route::get('get_customers', [CustomerController::class, 'get_customers'])->name('customer.getAll');
        Route::get('get_customer/{customer_id}', [CustomerController::class, 'get_customer'])->name('customer.getInfo');
        Route::get('get_customer_payment/{customer_id}', [CustomerController::class, 'get_customer_payment'])->name('customer.getPayment');
        Route::get('get_paid_customers', [CustomerController::class, 'get_clear_customers'])->name('customer.getPaid');
        Route::post('update_customer/{customer_id}', [CustomerController::class, 'update_customer'])->name('customer.update');
        Route::post('create_customer', [CustomerController::class, 'create_customer'])->name('customer.create');
    });

    # super admin routes
    Route::prefix('customer')->middleware('role:Super Admin')->group(function() {
        Route::delete('remove_customer/{customer_id}', [CustomerController::class, 'remove_customer'])->name('customer.remove');
    });

    # Routes for delivery persons under delivery hub module - super admin, admin, staff manager
    Route::prefix('delivery_person')->middleware('role:Super Admin,Administrator,Staff Manager')->group(function() {
        Route::get('get_primary', [DeliveryPersonController::class, 'get_primary_ids'])->name('delivery_person.get_primaryId');
        Route::get('get_secondary', [DeliveryPersonController::class, 'get_secondary_ids'])->name('delivery_person.get_secondaryId');
        Route::post('add_delivery_person', [DeliveryPersonController::class, 'create_delivery_person'])->name('delivery_person.create');
        Route::get('get_delivery_persons_table', [DeliveryPersonController::class, 'get_delivery_persons_table'])->name('delivery_person.getAll'); # table with their infos
        Route::get('get_delivery_persons', [DeliveryPersonController::class, 'get_delivery_persons_list'])->name('delivery_person.getList'); # list only without infos
        Route::get('get_info/{delivery_person_id}', [DeliveryPersonController::class, 'get_delivery_person'])->name('delivery_person.getInfo');
    });

    # super admin routes
    Route::prefix('delivery_person')->middleware('role:Super Admin')->group(function() {
        Route::delete('remove_delivery_person/{delivery_person_id}', [DeliveryPersonController::class, 'remove_delivery_person'])->name('delivery_person.remove');
    });

    # Routes for item delivery under delivery hub module - super admin, admin, staff manager
    Route::prefix('item_delivery')->middleware('role:Super Admin,Administrator,Staff Manager')->group(function() {
        Route::get('generate_batch_number', [ProductDeliveryController::class, 'generate_batch_number'])->name('item_delivery.generateBatch');
        Route::get('generate_po_number', [ProductDeliveryController::class, 'generate_delivery_poNumber'])->name('item_delivery.generatePoNumber');
        Route::get('get_items', [ProductDeliveryController::class, 'get_delivery_items'])->name('item_delivery.getItemsInfos');
        Route::post('deliver_items', [ProductDeliveryController::class, 'add_delivery_items'])->name('item_delivery.deliverItems');
        Route::patch('update_status/{status}/{delivery_id}', [ProductDeliveryController::class, 'update_status'])->name('item_delivery.updateStatus');
    });
});

# Routes for leads - super admin, admin, staff manager
Route::middleware(['auth:api, role:Super Admin,Administrator,Staff Manager'])->prefix('leads')->group(function() {
    Route::get('get-sources', [LeadController::class, 'get_lead_sources'])->name('leads.getSources');
    Route::get('get-job-roles', [LeadController::class, 'get_lead_job_roles'])->name('leads.getJobRoles');
    Route::get('get-leads', [LeadController::class, 'index'])->name('leads.getAll');
    Route::get('get-lead/{lead_id}', [LeadController::class, 'get'])->name('leads.getOne');
    Route::post('add-lead', [LeadController::class, 'store'])->name('leads.addLead');
    Route::put('update-lead/{lead_id}', [LeadController::class, 'update'])->name('leads.updateLead');
});

# Routes for audit trail - super admin, admin
Route::middleware(['auth:api, role:Super Admin,Administrator'])->prefix('trail')->group(function() {
    Route::get('get_system_logs', [AuditTrailController::class, 'index'])->name('trail.getAll');
    Route::get('get_system_log/{id}', [AuditTrailController::class, 'view'])->name('trail.getOne');
});

# Route for user navigations based on assigned role - all users
Route::middleware(['auth:api'])->prefix('user_nav')->group(function() {
    Route::get('get_navigations/{role_id}/{user_id}', [NavigationController::class, 'get_navigations'])->name('navigations.getRoleNav'); // navigations
});

# Routes for sub navigations based on assigned role
Route::middleware(['auth:api'])->prefix('user_sub_nav')->group(function() {
    # Routes for sub navigations - all users
    Route::get('get_profile_sub_navigations/{role_id}/{user_id}', [SubNavigationController::class, 'get_profile_sub_navigations'])->name('subnavigations.getProfileSubNavRole');
    Route::get('get_inventoryControl_sub_navigations/{role_id}/{user_id}', [SubNavigationController::class, 'get_inventoryControl_sub_navigations'])->name('subnavigations.getInventoryControl');
    
    # Routes for sub navigations - super admin, admin, staff manager
    Route::middleware('role:Super Admin,Administrator,Staff Manager')->get('get_prodDelivery_sub_navigations/{role_id}/{user_id}', [SubNavigationController::class, 'get_productDelivery_sub_navigations'])->name('subnavigations.getProductDelivery');
});