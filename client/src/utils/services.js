const base_api = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';
const api = {
    // unauthenticated services
    login: '/login',
    register: '/register',

    // authenticated services
    // user auth
    checkAuth: '/checkAuth',
    logOut: '/user/logout',
    get_Navs: '/user_nav/get_navigations/',
    get_inventory_subNav: '/user_sub_nav/get_inventoryControl_sub_navigations/',
    get_deliveryHub_subNav: '/user_sub_nav/get_prodDelivery_sub_navigations/',
    get_profile_subNav: '/user_sub_nav/get_profile_sub_navigations/',
    get_Users: '/user/get_users',
    get_Roles: '/user/get_roles',
    update_User: '/user/update_user/',
    create_User: '/user/create_user',
    disable_User: '/user/disable_user/',
    change_Password: '/user/change_password/',
    get_Account_info: '/user/get_user/',
    update_Account: '/user/update_account/',
    
    // inventory
    // inventory - suppliers submodules
    get_Suppliers: '/inventory/supplier/get_suppliers',
    get_Removed_suppliers: '/inventory/supplier/get_removed_suppliers',
    get_Supplier: '/inventory/supplier/get_supplier/',
    restore_Supplier: '/inventory/supplier/restore/',
    update_Supplier: '/inventory/supplier/update_supplier/',
    add_Supplier: '/inventory/supplier/add_supplier',
    get_Supplier_products: '/inventory/supplier/get_supplier_products/',
    remove_Supplier: '/inventory/supplier/remove_supplier/',
    download_Supplier_file: '/supplier-file/download/',

    // inventory - categories submodules
    get_Categories: '/inventory/category/get_categories',
    get_Category: '/inventory/category/get_category/',
    update_Category: '/inventory/category/update/',
    add_Category: '/inventory/category/create',

    // inventory - products submodules
    get_Products: '/inventory/product/get_products_infos',
    get_Products_only: '/inventory/product/get_products',
    get_Parent_products: '/inventory/product/get_parent_products',
    get_Parent_products_exclude_self: '/inventory/product/get_parent_products_exclude_self/',
    get_Product: '/inventory/product/get_product/',
    update_Product: '/inventory/product/update_product/',
    add_Product: '/inventory/product/add_product',
    remove_Product: '/inventory/product/remove_product/',
    get_Product_price: '/inventory/product/get_price/',
    download_Product_image: '/product-image/download/',

    // inventory - purchase orders submodules
    get_Purchase_orders: '/inventory/purchase_order/get_purchase_orders/',
    generate_Po: '/inventory/purchase_order/generate_po_number',
    generate_Track_number: '/inventory/purchase_order/generate_track_number',
    get_Purchase_order: '/inventory/purchase_order/get_purchase_order/',
    update_Purchase_order: '/inventory/purchase_order/update_purchase_order/',
    add_Purchase_order: '/inventory/purchase_order/add_purchase_order',
    update_Purchase_approval: '/inventory/purchase_order/purchase_approval/',
    close_Order: '/inventory/purchase_order/close_order/',

    // inventory - warehouse submodules
    get_Warehouse_types: '/inventory/warehouse/get_types',
    add_Warehouse: '/inventory/warehouse/create',
    get_Warehouses: '/inventory/warehouse/get_warehouses',
    get_Categories_warehouses: '/inventory/warehouse/get_category_warehouse/',
    get_Warehouse: '/inventory/warehouse/get_warehouse/',
    update_Warehouse: '/inventory/warehouse/update_warehouse/',
    remove_Warehouse: '/inventory/warehouse/remove/',
    download_File: '/warehouse-file/download/',

    // inventory - equipment submodules
    get_Equipments: '/inventory/equipment/get_equipments',

    // delivery
    // delivery - customers submodules
    get_Customers: '/delivery/customer/get_customers',
    get_Customer_types: '/delivery/customer/get_types',
    get_Industry_types: '/delivery/customer/get_industries',
    get_Customer: '/delivery/customer/get_customer/',
    get_Customer_payment: '/delivery/customer/get_customer_payment/',
    update_Customer: '/delivery/customer/update_customer/',
    add_Customer: '/delivery/customer/create_customer',
    get_Paid_customers: '/delivery/customer/get_paid_customers',
    remove_Customer: '/delivery/customer/remove_customer/',

    // delivery - delivery personnel submodules
    get_Delivery_persons: '/delivery/delivery_person/get_delivery_persons_table',
    get_Delivery_persons_list: '/delivery/delivery_person/get_delivery_persons',
    get_Delivery_person: '/delivery/delivery_person/get_info/',
    get_Primary_ids: '/delivery/delivery_person/get_primary',
    get_Secondary_ids: '/delivery/delivery_person/get_secondary',
    add_Delivery_person: '/delivery/delivery_person/add_delivery_person',
    remove_Delivery_person: '/delivery/delivery_person/remove_delivery_person/',

    // delivery - product delivery submodules
    get_Item_deliveries: '/delivery/item_delivery/get_items',
    update_Delivery_status: '/delivery/item_delivery/update_status/',
    generate_Batch_num: '/delivery/item_delivery/generate_batch_number',
    generate_Delivery_po: '/delivery/item_delivery/generate_po_number',
    deliver_Items: '/delivery/item_delivery/deliver_items',

    // audit trail
    get_Audit_Trails: '/audit_trail/get_system_logs',
    get_Audit_Trail: '/audit_trail/get_system_log/'

};

// Prepend base_api to each endpoint
const modifiedEndpoints = {};
Object.keys(api).forEach((key) => {
    modifiedEndpoints[key] = base_api + api[key];
});

module.exports = modifiedEndpoints;