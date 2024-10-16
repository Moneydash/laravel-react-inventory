<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $role_data = [
            [
                'name' => 'Super Admin',
                'guard_name' => 'api', // or 'api' if you're using API authentication
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Staff Manager',
                'guard_name' => 'api',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Staff',
                'guard_name' => 'api',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Administrator',
                'guard_name' => 'api',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        foreach ($role_data as $role) {
            Role::create($role);
        }
    }
}
