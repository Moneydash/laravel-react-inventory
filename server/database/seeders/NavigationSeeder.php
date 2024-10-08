<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Navigation;
use App\Models\Role;
use Illuminate\Support\Facades\DB;

class NavigationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // insert initial and default navigation
        $nav_data = [
            [
                'id' => Str::uuid(),
                'navigation_name' => 'Dashboard',
                'navigation_url' => 'dashboard',
                'navigation_icon' => 'DashboardOutlined',
                'order' => 1,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'navigation_name' => 'Inventory',
                'navigation_url' => 'inventory',
                'navigation_icon' => 'LayersOutlined',
                'order' => 2,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'navigation_name' => 'Logistics',
                'navigation_url' => 'delivery',
                'navigation_icon' => 'LocalShippingOutlined',
                'order' => 3,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'navigation_name' => 'Sales Leads',
                'navigation_url' => 'leads',
                'navigation_icon' => 'Diversity3Outlined',
                'order' => 4,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'navigation_name' => 'Members',
                'navigation_url' => 'users',
                'navigation_icon' => 'Groups2Outlined',
                'order' => 5,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'navigation_name' => 'Profile',
                'navigation_url' => 'profile',
                'navigation_icon' => 'Person2Outlined',
                'order' => 6,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'navigation_name' => 'Analytics',
                'navigation_url' => 'reports',
                'navigation_icon' => 'AnalyticsOutlined',
                'order' => 7,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'navigation_name' => 'System Logs',
                'navigation_url' => 'audit-trails',
                'navigation_icon' => 'DevicesOutlined',
                'order' => 8,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
            [
                'id' => Str::uuid(),
                'navigation_name' => 'System Settings',
                'navigation_url' => 'configurations',
                'navigation_icon' => 'SettingsOutlined',
                'order' => 9,
                'status' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ]
        ];

        Navigation::insert($nav_data);

        // roles
        $admin = Role::where('role_name', 'Administrator')->first();
        $staff_manager = Role::where('role_name', 'Staff Manager')->first();
        $staff = Role::where('role_name', 'Staff')->first();
        $developer = Role::where('role_name', 'Developer')->first();

        // navigations
        $dashboard_nav = Navigation::where('navigation_url', 'dashboard')->first();
        $products_nav = Navigation::where('navigation_url', 'inventory')->first();
        $prod_delivery_nav = Navigation::where('navigation_url', 'delivery')->first();
        $user_list_nav = Navigation::where('navigation_url', 'users')->first();
        $profile_nav = Navigation::where('navigation_url', 'profile')->first();
        $reports_nav = Navigation::where('navigation_url', 'reports')->first();
        $audit_trail_nav = Navigation::where('navigation_url', 'audit-trails')->first();
        $settings_nav = Navigation::where('navigation_url', 'configurations')->first();

        DB::beginTransaction();
        try {
            if ($admin && $staff_manager && $staff && $developer) {
                // for admin access and permissions
                foreach($nav_data as $navigation) {
                    // grant access to all navigations and permissions
                    $navigation_model = Navigation::where('id', $navigation['id'])->first();
                    if ($navigation_model) {
                        $navigation_model->roles()->attach([
                            $admin->id => ['create' => 1, 'read' => 1, 'update' => 1, 'delete' => 1, 'download' => 1, 'upload' => 1, 'created_at' => now(), 'updated_at' => now()],
                            $developer->id => ['create' => 1, 'read' => 1, 'update' => 1, 'delete' => 0, 'download' => 1, 'upload' => 1, 'created_at' => now(), 'updated_at' => now()]
                        ]);
                    }
                }

                // for staff manager access and permissions
                $dashboard_nav->roles()->attach($staff_manager->id, ['create' => 0, 'read' => 1, 'update' => 0, 'delete' => 0, 'download' => 1, 'upload' => 0, 'created_at' => now(), 'updated_at' => now()]);
                $products_nav->roles()->attach($staff_manager->id, ['create' => 1, 'read' => 1, 'update' => 1, 'delete' => 0, 'download' => 1, 'upload' => 0, 'created_at' => now(), 'updated_at' => now()]);
                $prod_delivery_nav->roles()->attach($staff_manager->id, ['create' => 1, 'read' => 1, 'update' => 1, 'delete' => 0, 'download' => 0, 'upload' => 0, 'created_at' => now(), 'updated_at' => now()]);
                $profile_nav->roles()->attach($staff_manager->id, ['create' => 1, 'read' => 1, 'update' => 1, 'delete' => 0, 'download' => 0, 'upload' => 0, 'created_at' => now(), 'updated_at' => now()]);
                $reports_nav->roles()->attach($staff_manager->id, ['create' => 0, 'read' => 1, 'update' => 0, 'delete' => 0, 'download' => 1, 'upload' => 0, 'created_at' => now(), 'updated_at' => now()]);

                // for staff access and permissions
                $dashboard_nav->roles()->attach($staff->id, ['create' => 0, 'read' => 1, 'update' => 0, 'delete' => 0, 'download' => 0, 'upload' => 0, 'created_at' => now(), 'updated_at' => now()]);
                $products_nav->roles()->attach($staff->id, ['create' => 0, 'read' => 1, 'update' => 0, 'delete' => 0, 'download' => 1, 'upload' => 0, 'created_at' => now(), 'updated_at' => now()]);
                $profile_nav->roles()->attach($staff->id, ['create' => 1, 'read' => 1, 'update' => 1, 'delete' => 0, 'download' => 0, 'upload' => 0, 'created_at' => now(), 'updated_at' => now()]);
                $reports_nav->roles()->attach($staff->id, ['create' => 0, 'read' => 1, 'update' => 0, 'delete' => 0, 'download' => 1, 'upload' => 0, 'created_at' => now(), 'updated_at' => now()]);

                DB::commit();
            } else {
                throw new \Exception("One or more roles not found!");
            }
        } catch (\Exception $e) {
            DB::rollback();
            $this->command->error($e->getMessage());
        }
    }
}
