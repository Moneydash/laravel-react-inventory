<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // insert initial and default roles
        $role_data = [
            [
                'id' => Str::uuid(),
                'role_name' => 'Administrator',
                'role_status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'role_name' => 'Staff Manager',
                'role_status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'role_name' => 'Staff',
                'role_status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'role_name' => 'Developer',
                'role_status' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        Role::insert($role_data);
    }
}
