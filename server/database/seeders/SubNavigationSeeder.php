<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Navigation;
use App\Models\SubNavigation;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

class SubNavigationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // parent navigations
        $inventory = Navigation::where('navigation_url', 'inventory')->first();
        $profile = Navigation::where('navigation_url', 'profile')->first();
        $product_delivery = Navigation::where('navigation_url', 'delivery')->first();

        $subnav_data = [
            [
                'id' => Str::uuid(),
                'parent_navigation_id' => $inventory->id,
                'sub_navigation_name' => 'Product Management',
                'sub_navigation_url' => 'products-list',
                'sub_navigation_desc' => 'Manages Products Listing Information',
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'parent_navigation_id' => $inventory->id,
                'sub_navigation_name' => 'Product Category Management',
                'sub_navigation_url' => 'categories',
                'sub_navigation_desc' => 'Manages Product Categories',
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'parent_navigation_id' => $inventory->id,
                'sub_navigation_name' => 'Warehouse Management',
                'sub_navigation_url' => 'warehouse-management',
                'sub_navigation_desc' => 'Manages Warehouse and Inventory Storage',
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'parent_navigation_id' => $inventory->id,
                'sub_navigation_name' => 'Suppliers Relationship Management',
                'sub_navigation_url' => 'suppliers',
                'sub_navigation_desc' => 'Manages Suppliers Listing Information',
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'parent_navigation_id' => $inventory->id,
                'sub_navigation_name' => 'Purchase Management',
                'sub_navigation_url' => 'purchase-orders',
                'sub_navigation_desc' => 'Manages Inventory Purchase',
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'parent_navigation_id' => $profile->id,
                'sub_navigation_name' => 'Update Profile',
                'sub_navigation_url' => 'update-profile',
                'sub_navigation_desc' => 'Manages Account Information',
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'parent_navigation_id' => $profile->id,
                'sub_navigation_name' => 'Change Password',
                'sub_navigation_url' => 'change-password',
                'sub_navigation_desc' => 'Manages User Account Security',
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'parent_navigation_id' => $product_delivery->id,
                'sub_navigation_name' => 'Product Delivery',
                'sub_navigation_url' => 'delivery-items',
                'sub_navigation_desc' => 'Manage delivery items of the Inventory',
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'parent_navigation_id' => $product_delivery->id,
                'sub_navigation_name' => 'Batch Management',
                'sub_navigation_url' => 'batches-delivery',
                'sub_navigation_desc' => 'Manage Product Batch Delivery',
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'parent_navigation_id' => $product_delivery->id,
                'sub_navigation_name' => 'Delivery Personnel Management',
                'sub_navigation_url' => 'delivery-persons',
                'sub_navigation_desc' => 'Manage Personnels for Product Deliveries',
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'parent_navigation_id' => $product_delivery->id,
                'sub_navigation_name' => 'Customer Relationship Management',
                'sub_navigation_url' => 'customers',
                'sub_navigation_desc' => 'Manage Customers and their informations',
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        SubNavigation::insert($subnav_data);

        $admin = Role::where('role_name', 'Administrator')->first();
        $staff_manager = Role::where('role_name', 'Staff Manager')->first();
        $staff = Role::where('role_name', 'Staff')->first();
        $developer = Role::where('role_name', 'Developer')->first();

        // subnavigations
        $products_list = SubNavigation::where('sub_navigation_url', 'products-list')->first();
        $categories = SubNavigation::where('sub_navigation_url', 'categories')->first();
        $suppliers = SubNavigation::where('sub_navigation_url', 'suppliers')->first();
        $po = SubNavigation::where('sub_navigation_url', 'purchase-orders')->first();
        $update_profile = SubNavigation::where('sub_navigation_url', 'update-profile')->first();
        $change_pass = SubNavigation::where('sub_navigation_url', 'change-password')->first();
        $delivery_items = SubNavigation::where('sub_navigation_url', 'delivery-items')->first();
        $batches_delivery = SubNavigation::where('sub_navigation_url', 'batches-delivery')->first();
        $delivery_persons = SubNavigation::where('sub_navigation_url', 'delivery-persons')->first();

        DB::beginTransaction();
        try {
            if ($admin && $staff_manager && $staff && $developer) {
                foreach($subnav_data as $subnav) {
                    $sub_navigation_model = SubNavigation::where('id', $subnav['id'])->first();

                    if ($sub_navigation_model) {
                        $sub_navigation_model->roles()->attach([
                            $admin->id => ['create' => 1, 'read' => 1, 'update' => 1, 'delete' => 1, 'download' => 1, 'upload' => 1, 'created_at' => now(), 'updated_at' => now()],
                            $developer->id => ['create' => 1, 'read' => 1, 'update' => 1, 'delete' => 0, 'download' => 1, 'upload' => 1, 'created_at' => now(), 'updated_at' => now()]
                        ]);
                    }
                }

                // for staff managers
                $products_list->roles()->attach($staff_manager->id, ['create' => 1, 'read' => 1, 'update' => 1, 'delete' => 0, 'download' => 0, 'upload' => 0, 'created_at' => now(), 'updated_at' => now()]);
                $categories->roles()->attach($staff_manager->id, ['create' => 1, 'read' => 1, 'update' => 1, 'delete' => 0, 'download' => 0, 'upload' => 0, 'created_at' => now(), 'updated_at' => now()]);
                $suppliers->roles()->attach($staff_manager->id, ['create' => 1, 'read' => 1, 'update' => 1, 'delete' => 0, 'download' => 0, 'upload' => 0, 'created_at' => now(), 'updated_at' => now()]);
                $po->roles()->attach($staff_manager->id, ['create' => 1, 'read' => 1, 'update' => 1, 'delete' => 0, 'download' => 0, 'upload' => 0, 'created_at' => now(), 'updated_at' => now()]);
                $update_profile->roles()->attach($staff_manager->id, ['create' => 1, 'read' => 1, 'update' => 1, 'delete' => 0, 'download' => 0, 'upload' => 0, 'created_at' => now(), 'updated_at' => now()]);
                $change_pass->roles()->attach($staff_manager->id, ['create' => 1, 'read' => 1, 'update' => 1, 'delete' => 0, 'download' => 0, 'upload' => 0, 'created_at' => now(), 'updated_at' => now()]);
                $delivery_items->roles()->attach($staff_manager->id, ['create' => 1, 'read' => 1, 'update' => 1, 'delete' => 0, 'download' => 0, 'upload' => 0, 'created_at' => now(), 'updated_at' => now()]);
                $batches_delivery->roles()->attach($staff_manager->id, ['create' => 0, 'read' => 1, 'update' => 0, 'delete' => 0, 'download' => 0, 'upload' => 0, 'created_at' => now(), 'updated_at' => now()]);

                // for staff
                $products_list->roles()->attach($staff->id, ['create' => 0, 'read' => 1, 'update' => 0, 'delete' => 0, 'download' => 0, 'upload' => 0, 'created_at' => now(), 'updated_at' => now()]);
                $update_profile->roles()->attach($staff->id, ['create' => 1, 'read' => 1, 'update' => 1, 'delete' => 0, 'download' => 0, 'upload' => 0, 'created_at' => now(), 'updated_at' => now()]);
                $change_pass->roles()->attach($staff->id, ['create' => 1, 'read' => 1, 'update' => 1, 'delete' => 0, 'download' => 0, 'upload' => 0, 'created_at' => now(), 'updated_at' => now()]);
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            $this->command->error($e->getMessage());
        }
    }
}
